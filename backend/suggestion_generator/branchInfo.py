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
    l1=['do','are','is']
    l2=['where','nearest','address']
    f = open('json_files/suggestions.json')
    data = json.load(f)
    text1 =nltk.word_tokenize(text)
    for word in text1:
        if word in l1:
            suggestions.append(data["branchInfo"][1])
            suggestions.append(data["branchInfo"][2])
            suggestions.append(data["branchInfo"][3])
            suggestions.append(data["branchInfo"][4])
            return suggestions
        if word in l2:
            suggestions.append(data["branchInfo"][5])
            suggestions.append(data["branchInfo"][6])
            suggestions.append(data["branchInfo"][0])
            suggestions.append(data["branchInfo"][2])
            return suggestions
    suggestions.append(data["branchInfo"][3])
    suggestions.append(data["branchInfo"][1])
    suggestions.append(data["branchInfo"][2])
    suggestions.append(data["branchInfo"][0])
    return suggestions


        
