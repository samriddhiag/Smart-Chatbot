import os
import json
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
    bag2 = ['ordered', 'order', 'issue', 'new', 'card']
    bag3 = ['delivery', 'lost', 'delivered', 'courier', 'deliver', 'delivering']
    bag4 = ['track', 'tracking', 'tracked', 'arrive', 'arrived', 'come']

    words = query.lower().split(' ')
    for word in words:
        if word in bag4:
            suggestions.append(responses[1])
            suggestions.append(responses[3])
            suggestions.append(responses[4])
            suggestions.append(responses[6])
            return suggestions
    
    for word in words:
        if word in bag3:
            suggestions.append(responses[8])
            suggestions.append(responses[9])
            suggestions.append(responses[7])
            suggestions.append(responses[2])
            return suggestions
    
    for word in words:
        if word in bag2:
            suggestions.append(responses[0])
            suggestions.append(responses[5])
            suggestions.append(responses[7])
            suggestions.append(responses[4])
            return suggestions
    
    suggestions.append('Please wait, Let me get back to you.')
    return suggestions


