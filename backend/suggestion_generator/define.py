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
    f = open('json_files/suggestions.json')
    data = json.load(f)
    suggestions.append(data["define"][0])
    suggestions.append(data["define"][1])
    suggestions.append(data["define"][2])
    suggestions.append(data["define"][3])
    return suggestions