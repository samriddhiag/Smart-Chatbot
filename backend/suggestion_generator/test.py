import requests
import preprocessing as p
import nltk
nltk.download('punkt')

queries = [] 

queries.append('I lost my card somewhere what should i do?')
queries.append('Can you immediately block my card then?')
queries.append('By when will i get my new card?')
queries.append('Ok thanks')

queries.append('Hey good evening')
queries.append('My daughter is 15. Can she open an account?')
queries.append('Ok cool')

queries.append('What is this extra dollar charge for on my most recent statemnet?')
queries.append('I do not like it at all')

queries.append('What were the recent activities on my account?')
queries.append('hahaha i am broke')
queries.append('I want to take a home loan')

queries.append('I have a pending cash withdrawal')
queries.append('Oh this is terrible')

queries.append('I want to have multiple currencies account')
queries.append('I dont remember my password')
queries.append('Wow thats great')

queries.append('I want to transfer some funds')
queries.append('It shows transaction failed')
queries.append('Oh ok thankyou')
 
#varying emotions examples
queries.append('Send me the address of branches in mumbai')
queries.append('I need to know the address of the branches in mumbai')
 
queries.append('My card hasn\'t arrived yet')
queries.append('Why is it taking so long for my cards to arrive')
 
queries.append('I have some issues with my card. Can you look into it.')
queries.append('Why the heck my card is not working')
queries.append('My card is not working properly. I dont know what to do.')


for query in queries:
    query = p.preprocess(query)
    payload = {'data': query}
    emotion = requests.post('http://127.0.0.1:5000/emotion_detection', json=payload).text.split(';')[0].replace('"','')
    payload = {'data': query}
    intent = requests.post('http://127.0.0.1:6000/intent-classification', json=payload).text.split()[0].replace('"','')
    module = __import__(intent)
    suggestions = module.generate(query,emotion)
    print('query : '+query)
    print('\n')
    print('emotion detected: '+emotion)
    print('intent detected: '+intent)
    print('_'*100)
    for i in range(len(suggestions)):
        print('suggestion '+str(i+1)+' : '+suggestions[i])
    print('\n')
