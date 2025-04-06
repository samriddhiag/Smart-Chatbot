import os
import random
import json

def generate(query, emotion):
    suggestions = []
    name = 'json_files/emotion_replies.json'
    f = open(name,'r')
    data = json.load(f)
    if emotion in data and len(data[emotion])>0:
        suggestions.append(data[emotion][random.randint(0,len(data[emotion])-1)])
    name = 'json_files/suggestions.json'
    f = open(name,'r')
    data = json.load(f)
    responses = data[os.path.basename(__file__)[:-3]]
    suggestions.append(responses[0])
    suggestions.append(responses[1])
    suggestions.append(responses[2])
    suggestions.append(responses[3])

    return suggestions
