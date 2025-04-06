import numpy as np
import requests
import json

X_test=[]

X_test.append('I lost my card somewhere what should i do?')
#X_test.append('Can you immediately block my card then?')
X_test.append('By when will i get my new card?')
 
X_test.append('Hey good evening')
X_test.append('My daughter is 15. Can she open an account?')
X_test.append('Ok cool')
 
X_test.append('What is this extra dollar charge for on my most recent statemnet?')
X_test.append('I do not like it at all')
 
X_test.append('What were the recent activities on my account?')
X_test.append('Hahaha')
#X_test.append('I want to take a home loan')
 
#X_test.append('I have a pending cash withdrawal')
#X_test.append('Oh this is terrible')
 
#X_test.append('I want to have multiple currencies account')
X_test.append('I dont remember my password')
#X_test.append('Wow thats great')

X_test.append('I want to transfer some funds')
X_test.append('Wow thats great')
X_test.append('It shows transaction failed')
X_test.append('Oh ok thankyou')
 
#varying emotions examples
X_test.append('Send me the address of branches in mumbai')
X_test.append('I need to know the address of the branches in mumbai')
 
X_test.append('My card hasn\'t arrived yet')
X_test.append('Why is it taking so long for my cards to arrive')
 
X_test.append('I have some issues with my card. Can you look into it.')
X_test.append('Why the heck my card is not working')
X_test.append('My card is not working properly. I dont know what to do.')


for x_test in X_test:
    print(x_test)
    payload = {'data': x_test}
    y_predict = requests.post('http://127.0.0.1:6000/intent-classification', json=payload).text
    print(y_predict)