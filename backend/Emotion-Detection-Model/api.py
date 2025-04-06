from flask import Flask, jsonify
from flask_restful import Api, Resource, reqparse
import pickle
import re
import numpy as np
import pandas as pd
import json
import tensorflow as tf
import torch
from torch import tensor
from transformers import BertForSequenceClassification, BertTokenizer
import logging
import warnings
from flask_cors import CORS
warnings.filterwarnings("ignore")
warnings.simplefilter(action='ignore', category=FutureWarning)

logging.basicConfig(level=logging.INFO, format='%(asctime)s:%(levelname)s: %(message)s')

app = Flask(__name__)
CORS(app)
api = Api(app)

label2int = {
  "sadness": 4,
  "joy": 2,
  'love': 3,
  "anger": 0,
  "fear": 1,
  "surprise": 5
}

int2label = {
  0: 'anger',
  1: 'fear',
  2: 'joy',
  3: 'love',
  4: 'sadness',
  5: 'surprise'
}
parser = reqparse.RequestParser()
parser.add_argument('data')

def clean(text):
    global str_punc
    text = re.sub(r'[^a-zA-Z ]', '', text)
    text = text.lower()
    return text

# Define how the api will respond to the post requests
class emotion_detector(Resource):
    def post(self):
        args = parser.parse_args()
        X = args['data']
        print(X)
        try:
          inputs = [tokenizer.encode(X, add_special_tokens=True, max_length = 256, pad_to_max_length=True)]
          logging.info('Tokenized the input string')
        except Exception as e:
          logging.error('Error while tokenizing the input string')
          raise e
          return ''

        try:
          attention_masks = [[float(i>0) for i in j] for j in inputs]
          logging.info('attention masks have been generated')
        except Exception as e:
          logging.error('Error while generating the attention masks from the input ids')
          raise e
          return ''

        attention_masks = torch.Tensor(attention_masks)
        inputs = torch.Tensor(inputs)
        try:
          output = model(inputs.int(), token_type_ids=None, attention_mask=attention_masks)
        except Exception as e:
          logging.critical('Unable to pass the inputs to the model, check the input datatypes')
          raise e
          return ''
        
        output = output[0].detach().numpy()
        ans=''
        prediction = np.argmax(output[0])
        ans+=int2label[prediction]+';'
        for i in range(len(output[0])):
            X = int2label[i]+" : "+str(output[0][i])+'     '
            ans+=X
        return ans

api.add_resource(emotion_detector, '/emotion_detection')

if __name__ == '__main__':
    try:
      model = BertForSequenceClassification.from_pretrained('./model')
      logging.info('model has been loaded')
    except Exception as e:
      logging.error('Unable to load the model')
      raise e
    
    try:
      tokenizer = BertTokenizer.from_pretrained('./tokenizer')
      logging.info('tokenizer has been loaded')
    except Exception as e:
      logging.error('Unable to load the tokenizer')
      raise e
    app.run(debug=True, port=5000)