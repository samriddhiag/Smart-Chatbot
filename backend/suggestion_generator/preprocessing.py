import json
import nltk
# nltk.download('wordnet')
from nltk.stem import WordNetLemmatizer
  
lemmatizer = WordNetLemmatizer()


def preprocess(query):
    f = open('json_files/synonyms.json')
    data = json.load(f)
    for buf in data['entities']:
        for buf1 in buf['values']:
            # print(str(buf1['value'])+' : '+str(buf1['synonyms']))
            buf_str = ''
            for word in query:
                if word in buf1['synonyms']:
                    buf_str+=buf1['value']
                else:
                    buf_str+=word
            query = buf_str

    new_query = ''
    for word in query:
        new_query += lemmatizer.lemmatize(word) 
    return new_query