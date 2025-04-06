import os
import re
from preprocessing import preprocess
import json
import random

def generate(query,emotion):
    #suggestions = []
    name = 'json_files/suggestions.json'
    f = open(name,'r')
    data = json.load(f)
    suggestions = data[os.path.basename(__file__)[:-3]]
    name = 'json_files/emotion_replies.json'
    f = open(name,'r')
    data = json.load(f)
    if emotion in data and len(data[emotion])>0:
        temp=data[emotion][random.randint(0,len(data[emotion])-1)]
        incorrect=[temp,suggestions[1],suggestions[2],suggestions[0],suggestions[3]]
        badrate=[temp,suggestions[2],suggestions[0],suggestions[1],suggestions[3]]
        dunno=[temp,suggestions[3],suggestions[0],suggestions[2],suggestions[1]]
    else:
        incorrect=[suggestions[1],suggestions[2],suggestions[0],suggestions[3]]
        badrate=[suggestions[2],suggestions[0],suggestions[1],suggestions[3]]
        dunno=[suggestions[3],suggestions[0],suggestions[2],suggestions[1]]
    l=['extra','incorrect','wrong','more','inaccurate','above']
    ll=['bad','terrible','awful','high']
    
    
    w=query.strip().split()
    for i in l:
        if i in w:
            return incorrect
    for i in ll:
        if i in w:
            return badrate
    return dunno

    
    
    
    


