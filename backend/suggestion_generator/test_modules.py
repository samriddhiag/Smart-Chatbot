import extra_charge_on_statement as e
import fiat_currency_support as f
import preprocessing as p
import Addbeneficiary as a
import accountbalance as ac
import age_limit as al
import branchInfo as bi
import define as d
import Failed as f
import negative_feedback as nf
import nonsense as ns
import cardLinking as c
import cardArrival as ca

queries = [] 
queries.append('My statement has a dollar I have been charged showing up on it')
queries.append('There is a fee I dont recognize on my statement')
queries.append('why was i charged a small amount of $10')
for query in queries:
    query = p.preprocess(query)
    suggestions = c.generate(query,'happy')
    print('query : '+query)
    print('_'*100)
    for i in range(len(suggestions)):
        print('suggestion '+str(i+1)+' : '+suggestions[i])
    print('\n')

