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
        bad=[temp,suggestions[2],suggestions[3],suggestions[0],suggestions[1]]
        good=[temp,suggestions[1],suggestions[0],suggestions[3],suggestions[2]]
        notsure=[temp,suggestions[0],suggestions[1],suggestions[2],suggestions[3]]
    else:
        bad=[suggestions[2],suggestions[3],suggestions[0],suggestions[1]]
        good=[suggestions[1],suggestions[0],suggestions[3],suggestions[2]]
        notsure=[suggestions[0],suggestions[1],suggestions[2],suggestions[3]]
    l=['bad','disappoint','terrible','awful','delay','slow','disliked','didn\'t']
    
    ll=['good','thank','nice','fast']
    
    
    w=query.strip().split()
    temp=re.search('not[*]good',query)
    if(temp):
        return bad
    for i in l:
        if i in w:
            return bad
    for i in ll:
        if i in w:
            return good
    return notsure

    
    
    
    


