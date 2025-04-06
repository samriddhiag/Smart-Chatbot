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
        broken=[temp,suggestions[0],suggestions[2],suggestions[3],suggestions[1]]
        notworking=[temp,suggestions[1],suggestions[2],suggestions[4],suggestions[3]]
        expired=[temp,suggestions[5],suggestions[2],suggestions[3],suggestions[1]]
    else:
        broken=[suggestions[0],suggestions[2],suggestions[3],suggestions[1]]
        notworking=[suggestions[1],suggestions[2],suggestions[4],suggestions[3]]
        expired=[suggestions[5],suggestions[2],suggestions[3],suggestions[1]]
    l=['broke','damaged','scratches']
    
    ll=['validity','decline','reject','stop','problem']
    
    lll=['expired']
    
    temp=re.search('not[*]work',query)
    if(temp):
        return notworking
    temp=re.search('not[*]accept',query)
    if(temp):
        return notworking
    #temp=re.search('not[*]accept',query)
    #if(temp):
    #    return expired
    w=query.strip().split()
    for i in l:
        if i in w:
            return broken
    for i in ll:
        if i in w:
            return notworking
    for i in lll:
        if i in w:
            return expired
    return notworking

    
    
    


