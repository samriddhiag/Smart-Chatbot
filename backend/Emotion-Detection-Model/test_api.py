import numpy as np
import requests
import json

X_test=[]

X_test.append('I have some issues with my card. Can you look into it.')
X_test.append('Why the heck my card is not working')
X_test.append('My card is not working properly. I dont know what to do.')
X_test.append('I have a pending cash withdrawal')
X_test.append('Oh this is terrible')
X_test.append('I want to have multiple currencies account')
X_test.append('I dont remember my password')
X_test.append('Wow thats great')

for x_test in X_test:
    print(x_test)
    payload = {'data': x_test}
    y_predict = requests.post('http://127.0.0.1:5000/emotion_detection', json=payload).text
    print(y_predict)
