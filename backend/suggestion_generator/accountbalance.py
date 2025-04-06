import nltk
import json
import random
def add_emotion(emotion):
    suggestions=[]
    k = open('json_files/emotion_replies.json')
    data1 = json.load(k)
    if(emotion=="sadness" or emotion=="anger" or emotion=="fear"):
        suggestions.append(data1[emotion][random.randint(0, 2)])
    return suggestions


def generate(text,emotion):
    suggestions=[]
    suggestions=add_emotion(emotion)
    l1=['balance']
    l2=['list','all']
    f = open('json_files/suggestions.json')
    data = json.load(f)
    text1 =nltk.word_tokenize(text)
    for word in text1:
        if word in l1:
            suggestions.append(data["accountbalance"][0])
            suggestions.append(data["accountbalance"][1])
            suggestions.append(data["accountbalance"][4])
            suggestions.append(data["accountbalance"][3])
            return suggestions
        if word in l2:
            suggestions.append(data["accountbalance"][6])
            suggestions.append(data["accountbalance"][5])
            suggestions.append(data["accountbalance"][0])
            suggestions.append(data["accountbalance"][3])
            return suggestions
    suggestions.append(data["accountbalance"][0])
    suggestions.append(data["accountbalance"][1])
    suggestions.append(data["accountbalance"][2])
    suggestions.append(data["accountbalance"][3])
    return suggestions