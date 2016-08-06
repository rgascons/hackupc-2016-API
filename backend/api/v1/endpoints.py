from flask import Flask, request, jsonify
import uuid
import datetime

TOKEN_DURATION = 999
UNAUTHORIZED = 'Unauthorized'
userSessions = {}

# AUTH LOGIN
# GET /api/v1/login
@applicationManager.route('/api/v1/login', methods=['GET'])
@asJSON
def login_user():
    username = request.form['username']
    pwd = request.form['password']
    token = generate_token()
    saveCurrentToken(username, token)
    return jsonify({"token": token})

# GET ALL APPLICANTS
# GET /api/v1/applicants
@applicationManager.route('/api/v1/applicants', methods=['GET'])
@requires_token
@asJSON
def get_users():
    pass

# GET LAST JUDGED APPLICATION
# GET /api/v1/application/last
@applicationManager.route('/api/v1/application/last', methods=['GET'])
@requires_token
@asJSON
def get_last_application():
    return null

# GET NEXT APPLICATION TO JUDGE
# GET /api/v1/application/next
@applicationManager.route('/api/v1/application/next', methods=['GET'])
@requires_token
@asJSON
def get_next_application():
    return null

# RATE AN APPLICATION
# POST /api/v1/rate/<int:application_id>/<rating>
@applicationManager.route('/api/v1/rate/<rating>', methods=['POST'])
@requires_token
@asJSON
def rate_application(application_id, rating):
    return null

# CHANGE STATE OF APPLICATION
# POST /api/v1/rate/<int:application_id>/<state>
@applicationManager.route('/api/v1/state/<state>', methods=['POST'])
@requires_token
@asJSON
def change_application_state(application_id, state):
    return null

# GET APPLICATION DETAIL
# POST /api/v1/application/<int:application_id>
@applicationManager.route('/api/v1/application/<int:application_id>', methods=['GET'])
@requires_token
@asJSON
def get_application_detail(application_id):
    return null

if __name__ == "__main__":
    app.run()