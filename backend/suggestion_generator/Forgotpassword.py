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
    l = data[os.path.basename(__file__)[:-3]]
    s1 = ['forgot','lost']
    s2 = ['net banking' ,'account' ,'atm' ,'debit card' ,'card']
    s3 = ['password' ,'pin' ,'userid']
    s4 = ['reset','change','set']
    words = []
    for word in query:
        word = word.lower()
        words.append(word)

    for marker in s4:
        if marker in query:
             suggestions.append(l[4])
             suggestions.append(l[2])
             suggestions.append(l[0])
             suggestions.append(l[3])
             return suggestions
    for marker in s2:
        if marker in query:
            suggestions.append(l[3])
            suggestions.append(l[2])
            suggestions.append(l[4])
            suggestions.append(l[1])
            return suggestions
    for marker in s3:
        if marker in query:
            suggestions.append(l[3])
            suggestions.append(l[2])
            suggestions.append(l[0])
            suggestions.append(l[1])
            return suggestions
    suggestions.append(l[2])
    suggestions.append(l[3])
    suggestions.append(l[0])
    suggestions.append(l[1])
    
    return suggestions