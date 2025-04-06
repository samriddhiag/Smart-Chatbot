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
        cardlost=[temp,suggestions[2],suggestions[0],suggestions[3],suggestions[1]]
        block=[temp,suggestions[1],suggestions[3],suggestions[0],suggestions[2]]
    else:
        cardlost=[suggestions[2],suggestions[0],suggestions[3],suggestions[1]]
        block=[suggestions[1],suggestions[3],suggestions[0],suggestions[2]]
    l=['lost','loss','stolen','missing']
    
    ll=['block','freeze']
    
    w=query.strip().split()
    temp=re.search('not[*]find',query)
    if(temp):
        return cardlost
    for i in l:
        if i in w:
            return cardlost
    for i in ll:
        if i in w:
            return block
    return cardlost

    
    
    
    


