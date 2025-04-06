from asyncio.windows_events import NULL
import pandas as pd
import numpy as np
import sys
import logging
import random
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score,matthews_corrcoef
from sklearn.preprocessing import LabelEncoder
import torch
import torch.nn.functional as F
from torch.utils.data import TensorDataset, DataLoader, RandomSampler, SequentialSampler
from transformers import BertTokenizer, BertConfig,AdamW, BertForSequenceClassification,get_linear_schedule_with_warmup
from transformers.utils import logging as logging_
import warnings
warnings.filterwarnings("ignore")
warnings.simplefilter(action='ignore', category=FutureWarning)

logging.basicConfig(level=logging.INFO, format='%(asctime)s:%(levelname)s:%(message)s')
logging_.set_verbosity_error 


labelencoder = LabelEncoder()
MAX_LEN = 256

def load_data(paths):
    df = []
    for path in paths:
        try:
            buf = pd.read_csv(path, delimiter=';', header=None, names=['sentence','label'])
            df.append(buf)
        except FileNotFoundError:
            logging.error('File has not been found, check the path')
        except:
            logging.critical('Unable to read from the file '+path)
    return df

def setup_dataframe(df_train, df_val, df_test):
    try:
        df = pd.concat([df_train,df_test,df_val])
    except:
        logging.critical('Unable to concatenate the dataframes together, make sure that the columns of the dataframes are similar')
        sys.exit()
    try:
        df['label_enc'] = labelencoder.fit_transform(df['label'])
    except TypeError:
        logging.error('Error with labelencoder, need to create an object with the labelencoder first')
        sys.exit()
    except:
        logging.error('Error with the labelencoder')
        sys.exit()
    df[['label','label_enc']].drop_duplicates(keep='first')
    df.rename(columns={'label':'label_desc'},inplace=True)
    df.rename(columns={'label_enc':'label'},inplace=True)
    return df

def create_tokenizer(df):
    sentences = df.sentence.values
    try:
        tokenizer = BertTokenizer.from_pretrained('bert-base-uncased',do_lower_case=True)
    except:
        logging.error('Unable to load the tokenizer')
        sys.exit()
    input_ids = [tokenizer.encode(sent, add_special_tokens=True,max_length=MAX_LEN,pad_to_max_length=True) for sent in sentences]
    labels = df.label.values
    attention_masks = []
    attention_masks = [[float(i>0) for i in seq] for seq in input_ids]
    try:
        tokenizer.save_pretrained('./tokenizer')
        logging.info('Successfully saved the tokenizer')
    except:
        logging.warning('Unable to save the tokenizer')
    return input_ids, labels, attention_masks

def helper(input, mask, label, batch_size):
    input = torch.tensor(input)
    mask = torch.tensor(mask)
    label = torch.tensor(label)
    try:
        data = TensorDataset(input, mask, label)
        logging.info('Successfully converted the Dataset')
    except:
        logging.error('Unable to wrap the input data into the TensorDataset class')
        sys.exit()
    sampler = RandomSampler(data)
    dataloader = DataLoader(data, sampler=sampler, batch_size=batch_size)
    return dataloader


def preprocess(input_ids, labels, attention_masks):
    train_inputs,validation_inputs,train_labels,validation_labels = train_test_split(input_ids,labels,random_state=41,test_size=0.1)
    train_masks,validation_masks,_,_ = train_test_split(attention_masks,input_ids,random_state=41,test_size=0.1)
    batch_size = 32
    train_dataloader = helper(train_inputs, train_masks, train_labels, batch_size)
    validation_dataloader = helper(validation_inputs, validation_masks, validation_labels, batch_size)
    return train_dataloader, validation_dataloader

def save_model(model):
    try:
        model.save_pretrained('./model')
        logging.info('Saved the Model')
    except:
        logging.warning('Unable to save the model')
    model_save_name = 'fineTuneModel.pt'
    path = f'./model/{model_save_name}'
    try:
        torch.save(model.state_dict(),path)
        logging.info('Saved the weights of the model')
    except:
        logging.warning('unable to save the weights of the model')
    return


def train_and_evaluate_model(train_dataloader, validation_dataloader):
    try:
        model = BertForSequenceClassification.from_pretrained("bert-base-uncased", num_labels=6)
    except:
        logging.error('Error while loading the pretrained model, please check the name of the model')
    lr=2e-5; adam_epsilon=1e-8; epochs=3; num_warmup_steps=0
    num_training_steps = len(train_dataloader)*epochs
    optimizer = AdamW(model.parameters(), lr=lr,eps=adam_epsilon,correct_bias=False)
    scheduler = get_linear_schedule_with_warmup(optimizer, num_warmup_steps=num_warmup_steps, num_training_steps=num_training_steps)
    train_loss_set = []; learning_rate = []
    model.zero_grad()
    for i in range(1,epochs+1):
        print('epoch '+str(i))
        batch_loss=0; f=0
        for step, batch in enumerate(train_dataloader):
            model.train()
            batch = tuple(t for t in batch)
            b_input_ids, b_input_mask, b_labels = batch
            # Forward pass
            try:
                outputs = model(b_input_ids.long(), token_type_ids=None, attention_mask=b_input_mask.long(), labels=b_labels.long())
            except:
                logging.error('Error in the forward pass')
                sys.exit()
            loss = outputs[0]
            # Backward pass
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
            optimizer.step()
            scheduler.step()
            optimizer.zero_grad()
            batch_loss += loss.item()

        avg_train_loss = batch_loss / len(train_dataloader)
        for param_group in optimizer.param_groups:
            logging.info("\n\tCurrent Learning rate: ",param_group['lr'])
            learning_rate.append(param_group['lr'])
            
        train_loss_set.append(avg_train_loss)
        logging.info(F'\n\tAverage Training loss: {avg_train_loss}')
        model.eval()
        eval_accuracy,eval_mcc_accuracy,nb_eval_steps = 0, 0, 0

        for batch in validation_dataloader:
            batch = tuple(t for t in batch)
            b_input_ids, b_input_mask, b_labels = batch
            with torch.no_grad():
                logits = model(b_input_ids, token_type_ids=None, attention_mask=b_input_mask)
            
            logits = logits[0].to('cpu').numpy()
            label_ids = b_labels.to('cpu').numpy()
            pred_flat = np.argmax(logits, axis=1).flatten()
            labels_flat = label_ids.flatten()
            df_metrics=pd.DataFrame({'Epoch':epochs,'Actual_class':labels_flat,'Predicted_class':pred_flat})
            tmp_eval_accuracy = accuracy_score(labels_flat,pred_flat)
            tmp_eval_mcc_accuracy = matthews_corrcoef(labels_flat, pred_flat)
            eval_accuracy += tmp_eval_accuracy
            eval_mcc_accuracy += tmp_eval_mcc_accuracy
            nb_eval_steps += 1

    logging.info(F'\n\tValidation Accuracy: {eval_accuracy/nb_eval_steps}')
    logging.info(F'\n\tValidation MCC Accuracy: {eval_mcc_accuracy/nb_eval_steps}')
    # save_model(model)
    return model

def pipeline(df):
    input_ids, labels, attention_masks = create_tokenizer(df)
    train_dataloader, validation_dataloader = preprocess(input_ids, labels, attention_masks)
    model = train_and_evaluate_model(train_dataloader, validation_dataloader)
    return model



df_train, df_val, df_test = load_data(['./dataset/train.txt','./dataset/val.txt','./dataset/test.txt'])
df = setup_dataframe(df_train, df_val, df_test)
model = pipeline(df)
save_model(model)
#train_and_evaluate_model()