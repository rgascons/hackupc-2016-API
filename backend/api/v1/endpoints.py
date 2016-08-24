from flask import Blueprint, request, abort
import uuid
# import datetime
from decorators import asJSON, requiresToken
from typeform import getMoreResponses
import hashlib
from models.judge import Judge
from models.application import Application
from models.judgement import Judgement
from models.db import db
from sqlalchemy import desc

apiv1 = Blueprint('apiv1', __name__)

# AUTH LOGIN
# GET /api/v1/login
@apiv1.route('/api/v1/login', methods=['POST'])
@asJSON
def login_user():
    login_data = request.get_json()
    username = login_data['user']
    pwd = hashlib.sha512(login_data['password']).hexdigest()

    user = Judge.query.filter_by(name=username, password=pwd).first()
    if user is not None:
        token = str(uuid.uuid4())
        user.token = token
        db.session.commit()
        return {'token': token}
    else:
        abort(403)


# GET ALL APPLICANTS
# GET /api/v1/applicants
@apiv1.route('/api/v1/applicants', methods=['GET'])
@requiresToken
@asJSON
def get_applicants():
    applications = Application.query.all()
    applications_json = []
    for app in applications:
        applications_json.append(app.to_dict())

    return applications_json


# GET LAST JUDGED APPLICATION
# GET /api/v1/application/last
@apiv1.route('/api/v1/application/last', methods=['GET'])
@requiresToken
@asJSON
def get_last_application():
    id = Judge.getJudgeIdByToken()

    judgement = Judgement.query\
        .filter_by(judge_id=id, )\
        .filter(Judgement.rating != '')\
        .order_by(desc(Judgement.judge_index))\
        .first()

    if judgement is None:
        return {}

    app_id = judgement.app_id

    app = Application.query.filter_by(id=app_id).first()
    return app.to_dict()

# GET NEXT APPLICATION TO JUDGE
# GET /api/v1/application/next
@apiv1.route('/api/v1/application/next', methods=['GET'])
@requiresToken
@asJSON
def get_next_application():
    id = Judge.getJudgeIdByToken()
    newJudgement = Judgement.query \
        .filter_by(judge_id=id, ) \
        .filter(Judgement.rating is None) \
        .order_by(desc(Judgement.judge_index)) \
        .first()
    new_app_id = newJudgement.app_id
    judgement = Judgement(app_id=new_app_id, judge_id=id)

    appl = Application.query.filter_by(id=new_app_id).first()
    return appl.to_dict()

# RATE AN APPLICATION
# POST /api/v1/rate/<rating>
@apiv1.route('/api/v1/rate/<rating>', methods=['POST'])
@requiresToken
@asJSON
def rate_application(rating):
    id = Judge.getJudgeIdByToken()
    judgement = Judgement.getCurrentJudgementByJudgeId(id)

    if judgement is None:
        return {"status": "ko"}

    judgement.rating = rating
    db.session.commit()

    return {"status": "ok"}

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
    app = Application.query.filter_by(id=application_id).first()

    if app is not None:
        return app.to_dict()
    else:
        abort(404)


# GET APPLICATION DETAIL
# GET /api/v1/fetch
@apiv1.route('/api/v1/fetch', methods=['GET'])
@asJSON
def fetch_responses():
    getMoreResponses()
    return {"result": "ok"}
