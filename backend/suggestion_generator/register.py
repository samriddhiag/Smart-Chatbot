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
    bag1 = ['registration', 'apply', 'application', 'register', 'form']
    bag2 = ['open', 'sign up', 'account', 'documents', 'document']

    words = query.lower().split(' ')
    for word in words:
        if word in bag1:
            suggestions.append(responses[0])
            suggestions.append(responses[1])
            suggestions.append(responses[3])
            suggestions.append(responses[8])
            return suggestions
    
    for word in words:
        if word in bag2:
            suggestions.append(responses[2])
            suggestions.append(responses[4])
            suggestions.append(responses[6])
            suggestions.append(responses[8])
            return suggestions

    suggestions.append("Please give me a minute, let me get back to you")
    return suggestions
