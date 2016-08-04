from flask import Flask, request, jsonify
import uuid
import datetime

app = Flask(__name__)

TOKEN_DURATION = 999
UNAUTHORIZED = 'Unauthorized'
userSessions = {}

def token_exists(token):
    return token in userSessions.keys()

#Stores the tokens for each user and the counter to delete it
def generate_token():
    return uuid.uuid4().hex

def saveCurrentToken(username, token):
        today = datetime.datetime.today()
        expireDate = today + datetime.timedelta(seconds=TOKEN_DURATION)
        userSessions[token] = {'username': username, 'timeLeft': expireDate}

#Returns username if authorized. If not, returns unauthorized
def getCurrentUser(token):
    if token_exists(token):
        return userSessions[token]['username']
    else:
        return UNAUTHORIZED

@app.route('/api/v1/login', methods=['POST'])
def login_user():
    username = request.form['username']
    pwd = request.form['password']
    #Check if user is in DB
    #Compute token and send to client
    token = generate_token()
    saveCurrentToken(username, token)
    return {"token": token}

@app.route('/api/v1/users', methods=['GET'])
def get_users():
    currentUser = getCurrentUser(request.args['token'])
    if (currentUser != UNAUTHORIZED):
        return null
    else:
        return null
        #Unauthorized, return invalid request

@app.route('/api/v1/application/last/<int:judge_id>', methods=['GET'])
def get_last_application(judge_id):
    return null

@app.route('/api/v1/application/next/<int:judge_id>', methods=['GET'])
def get_next_application(judge_id):
    return null


@app.route('/api/v1/rate/<int:application_id>/<rating>', methods=['POST'])
def rate_application(application_id, rating):
    return null

@app.route('/api/v1/rate/<int:application_id>/<state>', methods=['POST'])
def change_application_state(application_id, state):
    return null


if __name__ == "__main__":
    app.run()
