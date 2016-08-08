from flask import Blueprint
# import uuid
# import datetime
from decorators import asJSON, requiresToken

apiv1 = Blueprint('apiv1', __name__)

# AUTH LOGIN
# GET /api/v1/login
@apiv1.route('/api/v1/login', methods=['GET'])
@asJSON
def login_user():
    pass

# GET ALL APPLICANTS
# GET /api/v1/applicants
@apiv1.route('/api/v1/applicants', methods=['GET'])
@requiresToken
@asJSON
def get_applicants():
    print "ayyyyy"
    return {"name": "marce", "id": 3}

# GET LAST JUDGED APPLICATION
# GET /api/v1/application/last
@apiv1.route('/api/v1/application/last', methods=['GET'])
@requiresToken
@asJSON
def get_last_application():
    pass

# GET NEXT APPLICATION TO JUDGE
# GET /api/v1/application/next
@apiv1.route('/api/v1/application/next', methods=['GET'])
@requiresToken
@asJSON
def get_next_application():
    pass

# RATE AN APPLICATION
# POST /api/v1/rate/<int:application_id>/<rating>
@apiv1.route('/api/v1/rate/<rating>', methods=['POST'])
@requiresToken
@asJSON
def rate_application(application_id, rating):
    pass

# CHANGE STATE OF APPLICATION
# POST /api/v1/state/<int:application_id>/<state>
@apiv1.route('/api/v1/state/<int:application_id>/<state>', methods=['POST'])
@requiresToken
@asJSON
def change_application_state(application_id, state):
    pass

# GET APPLICATION DETAIL
# POST /api/v1/application/<int:application_id>
@apiv1.route('/api/v1/application/<int:application_id>', methods=['GET'])
@requiresToken
@asJSON
def get_application_detail(application_id):
    pass