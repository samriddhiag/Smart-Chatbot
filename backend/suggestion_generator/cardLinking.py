import os
import re
from preprocessing import preprocess
import json
import random
def generate(query,emotion):
    name = 'json_files/suggestions.json'
    f = open(name,'r')
    data = json.load(f)
    suggestions = data[os.path.basename(__file__)[:-3]]
    name = 'json_files/emotion_replies.json'
    f = open(name,'r')
    data = json.load(f)
    if emotion in data and len(data[emotion])>0:
        temp=data[emotion][random.randint(0,len(data[emotion])-1)]
        lose=[temp,suggestions[1],suggestions[0],suggestions[3]]
        lose2=[temp,suggestions[0],suggestions[3],suggestions[1],suggestions[2]]
    else:
        lose=[suggestions[1],suggestions[0],suggestions[3]]
        lose2=[suggestions[0],suggestions[3],suggestions[1],suggestions[2]]
    l=['lost','found','reactivate']
    
    w=query.strip().split()
    if 'lost' in w or 'found' in w or 'reactivate' in w:
        lose=lose+[suggestions[2]]
        return lose
    
    return lose2
    
    
    
    


