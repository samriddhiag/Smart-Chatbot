import json
import os
import random

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
    bag1 = ['exchange', 'rate']
    bag2 = ['country', 'countries', 'abroad']
    bag3 = ['calculated', 'formula', 'commission']
    bag4 = ['weekends', 'weekend', 'weekday']

    words = query.lower().split(' ')
    for word in words:
        if word in bag2:
            suggestions.append(responses[0])
            suggestions.append(responses[1])
            suggestions.append(responses[4])
            suggestions.append(responses[8])
            return suggestions

    for word in words:
        if word in bag4:
            suggestions.append(responses[3])
            suggestions.append(responses[4])
            suggestions.append(responses[0])
            suggestions.append(responses[8])
            return suggestions

    for word in words:   
        if word in bag1:
            suggestions.append(responses[4])
            suggestions.append(responses[5])
            suggestions.append(responses[7])
            suggestions.append(responses[9])
            return suggestions

    for word in words:
        if word in bag3:
            suggestions.append(responses[8])
            suggestions.append(responses[2])
            suggestions.append(responses[5])
            suggestions.append(responses[7])
            return suggestions
    suggestions.append('Give a minute, let me check')

    return suggestions
