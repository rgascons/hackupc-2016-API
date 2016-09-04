from math import *

#Fill with the data received by the backend
jutges = [
    [{"app_id":"1", "score":"worse"},{"app_id":"2", "score":"better"},{"app_id":"3", "score":"better"},{"app_id":"4", "score":"better"},{"app_id":"5", "score":"better"}],
    [{"app_id":"5", "score":"worse"},{"app_id":"4", "score":"worse"},{"app_id":"3", "score":"worse"},{"app_id":"2", "score":"worse"},{"app_id":"1", "score":"worse"}]
]

# List with all appids
app_ids = []

for judge_votations in jutges:
    for application in judge_votations:
        if (application["app_id"] not in app_ids):
            app_ids.append(application["app_id"])

#Algorithm based on response:
#http://stats.stackexchange.com/questions/83005/how-to-calculate-ratings-rankings-from-paired-comparison-pairwise-comparison-o
#Count how many times each item is beaten by each other, store in matrix
counter = {}
total_comparisons = {}
for app_id in app_ids:
    if app_id not in total_comparisons:
        total_comparisons[app_id] = {}
        for app_id2 in app_ids:
            if app_id2 not in total_comparisons[app_id]:
                total_comparisons[app_id][app_id2] = 0


for judge_votations in jutges:
    for i in range(1, len(judge_votations)):
        #Start in 1 because the first comparison is the pair 0-1
        app_id = judge_votations[i]["app_id"]
        app_id_old = judge_votations[i - 1]["app_id"]
        score = judge_votations[i]["score"]

        #There is a comparison, store it
        total_comparisons[app_id][app_id_old] += 1
        total_comparisons[app_id_old][app_id] += 1
        #The comparison is better, store it in the wins matrix
        if score == "better" :
            if app_id not in counter:
                counter[app_id] = {}
                counter[app_id][app_id_old] = 1
            elif app_id_old not in counter[app_id]:
                    counter[app_id][app_id_old] = 1
            else :
                counter[app_id][app_id_old] += 1

#Now we have the matrix prepared, do the fun
#init all gamma to 0
gamma = {}
for app_id in app_ids:
    if (app_id not in gamma):
        #Init gamma arbitratily
        gamma[app_id] = 1

iterations = 100000

for it in range(0, iterations):
    for app_id in app_ids:
        total_wins = 0
        if app_id in counter.keys():
            total_wins = sum(counter[app_id].values())
        sumatory = 0.0
        for app_id2 in app_ids:
            if (app_id != app_id2):
                total_c = total_comparisons[app_id][app_id2] + total_comparisons[app_id2][app_id]
                divisor = 1
                if gamma[app_id] + gamma[app_id2] > 0.0:
                    divisor = gamma[app_id] + gamma[app_id2]
                sumatory = sumatory + (total_c / divisor)
        gamma[app_id] = total_wins * (1 / sumatory)
        #Now normalize gamma
        mean = float(sum(gamma.values())) / max(len(gamma.values()), 1)
        for key in gamma.keys():
            gamma[key] = gamma[key] / mean
#print result
print(sorted(gamma, key=gamma.get, reverse=True))
