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

def is_num_present(text1):
    dig=""
    for word in text1:
        if word.isdigit():
            dig+=word
            return [True,dig]
    return [False,dig]
    
def generate(text,emotion): 
    suggestions=[]
    suggestions=add_emotion(emotion)
    text1=nltk.word_tokenize(text)      
    l1=['how','minimum','what','age','what','would','youngest','eligible','old','would']
    l2=['children','son','daughter','kids','person','someone']
    f = open('json_files/suggestions.json')
    data = json.load(f)
    l=is_num_present(text1)
    if l[0]:
        if int(l[1])>=18:
            suggestions.append(data["age_limit"][6])
            suggestions.append(data["age_limit"][7])
            suggestions.append(data["age_limit"][8])
            suggestions.append(data["age_limit"][9])
        else:
            suggestions.append(data["age_limit"][10])
            suggestions.append(data["age_limit"][11])
            suggestions.append(data["age_limit"][12])
            suggestions.append(data["age_limit"][13])
        return suggestions
    for word in l1:
        if word in text1:
            suggestions.append(data["age_limit"][0])
            suggestions.append(data["age_limit"][1])
            suggestions.append(data["age_limit"][2])
            suggestions.append(data["age_limit"][4])
            return suggestions
    for word in l2:
        if word in text1:
            suggestions.append(data["age_limit"][3])
            suggestions.append(data["age_limit"][4])
            suggestions.append(data["age_limit"][1])
            suggestions.append(data["age_limit"][2])
            return suggestions
    suggestions.append(data["age_limit"][0])
    suggestions.append(data["age_limit"][1])
    suggestions.append(data["age_limit"][4])
    suggestions.append(data["age_limit"][11])
    return suggestions
text=""
#print("enter the text")
#text= input()
#suggestions=suggestion(text)
#print(suggestions)