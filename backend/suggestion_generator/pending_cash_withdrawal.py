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
        verifying=[temp,suggestions[3],suggestions[1],suggestions[0],suggestions[3]]
        failed=[temp,suggestions[0],suggestions[2],suggestions[1],suggestions[3]]
        didntshow=[temp,suggestions[1],suggestions[3],suggestions[0],suggestions[2]]
    else:
        verifying=[suggestions[3],suggestions[1],suggestions[0],suggestions[3]]
        failed=[suggestions[0],suggestions[2],suggestions[1],suggestions[3]]
        didntshow=[suggestions[1],suggestions[3],suggestions[0],suggestions[2]]
    l=['verify','already','still','deny','withdraw']
    
    w=query.strip().split()
    temp=re.search('not[*]work',query)
    if(temp):
        return failed
    if 'deny' in w:
        return failed
    if 'verify' in w:
        return verifying
    if 'already' in w or 'still' in w or 'withdraw':
        return didntshow
    return verifying
    
    
    
    


