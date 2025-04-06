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
    s1 = ['why','what']
    s2 = [' 1 ',' a dollar ',' a pound ',' a euro ',' 1$ ',' $1 ',' extra dollar ',' extra pound ',' extra euro ']
    s3 = ['$','dollar','euro','pound']
    s4 = ['extra','another']
    s5 = ['account','statement','memo']
    s6 = ['charged','added']
    s7 = ['still','reverted']
    words = []
    for word in query:
        word = word.lower()
        words.append(word)

    for marker in s7:
        if marker in words:
            suggestions.append(l[5])
            suggestions.append(l[6])
            suggestions.append(l[0])
            suggestions.append(l[1])
            return suggestions
    for marker in s2:
        if marker in query:
            suggestions.append(l[3])
            suggestions.append(l[2])
            suggestions.append(l[0])
            suggestions.append(l[1])
            return suggestions
    suggestions.append(l[4])
    suggestions.append(l[3])
    suggestions.append(l[0])
    suggestions.append(l[1])
    return suggestions
