from flask import Flask, jsonify
from flask_restful import Api, Resource, reqparse
import numpy as np
import pandas as pd
import torch
from torch import tensor
from transformers import BertForSequenceClassification, BertTokenizer
import logging
logging.basicConfig(encoding='utf-8', level=logging.ERROR, format='%(asctime)s:%(levelno)s:%(message)s')
logging.debug('logged in')
from transformers import AutoConfig

pretrained_checkpoint = "distilbert-base-uncased"
config = AutoConfig.from_pretrained(pretrained_checkpoint)
app = Flask(__name__)
api = Api(app)

parser = reqparse.RequestParser()
parser.add_argument('data')


# Define how the api will respond to the post requests
class Intent_Classification(Resource):
    def post(self):
        args = parser.parse_args()
        X = args['data']
        print(X)
        inputs = tokenizer(X, return_tensors="pt")
        with torch.no_grad():
            logits = model(**inputs).logits
        
        predictions = torch.nn.functional.softmax(logits, dim=-1)
        proba=predictions.max()
        predicted_class_id = logits.argmax().item()
        print(X+ "-----"+possible_labels[predicted_class_id])
        result= possible_labels[predicted_class_id]
        X = (f'{result} : {proba}')
        return X

api.add_resource(Intent_Classification, '/intent-classification')

if __name__ == '__main__':
    device = torch.device('cpu')


    #loading the presaved model
    try:
        path='./model'
        model = BertForSequenceClassification.from_pretrained(path)
        model.to(device)
    except FileNotFoundError:
        logging.error('File '+path+' has not been found')
    except:
        logging.error('Unable to read from the file '+path)


    #loading the weights
    try:
        path='./intent_classification.pth'
        model.load_state_dict(torch.load(path, map_location=torch.device('cpu')))
    except FileNotFoundError:
        logging.error('File '+path+' has not been found')
    except:
        logging.error('Unable to read from the file '+path)


    #loading the tokenizer
    try:
        path='./tokenizer'
        tokenizer = BertTokenizer.from_pretrained(path)
    except FileNotFoundError:
        logging.error('File '+path+' has not been found')
    except:
        logging.error('Unable to read from the file '+path)



    #loading the label file
    try:
        path='./label_file.npy'
        possible_labels =np.load('./label_file.npy',allow_pickle=True)
    except FileNotFoundError:
        logging.error('File '+path+' has not been found')
    except:
        logging.error('Unable to read from the file '+path)
    app.run(debug=True, port=6000)