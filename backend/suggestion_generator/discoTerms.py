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

    words = query.lower().split(' ')
    for word in words:
        if word in ['interest', 'rate']:
            suggestions.append(responses[0])
            suggestions.append("Please wait a minute I will get back to you.")
            return suggestions
    
    for word in words:
        if word in ['emi', 'amount']:
            suggestions.append(responses[2])
            suggestions.append(responses[3])
            suggestions.append("Please wait a minute, let me get back to you.")
            suggestions.append("Let me check and get back to you, please wait.")
            return suggestions
    
    for word in words:
        if word in ['loan']:
            suggestions.append(responses[11])
            suggestions.append(responses[10])
            suggestions.append("Please wait a minute, let me get back to you.")
            suggestions.append("I am looking for the best suited options for you, please wait for a while.")
            return suggestions
    
    for word in words:
        if word in ['amount', 'mobile', 'number']:
            suggestions.append(responses[4])
            suggestions.append(responses[5])
            suggestions.append("Please wait a minute, let me get back to you.")
            suggestions.append(responses[7])
            return suggestions
    
    suggestions.append("Please wait a minute, let me get back to you.")
    suggestions.append("I will check with the team and get back to you")
    suggestions.append("Let me check and get back to you, please wait.")
    suggestions.append("I am looking into the issue, please wait for a while.")
    return suggestions
