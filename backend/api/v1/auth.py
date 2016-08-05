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