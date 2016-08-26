from urllib2 import Request, urlopen, URLError
from ..settings import apikey, formid, baseapiurl
from logging import info, debug, warning, error
from ..models.variable import Variable, getVariable
from ..models.application import Application
from ..models.db import db
import json

#field_mappings = {'list_26730025_choice': 'best_language',
#                  'yesno_26729967': 'first_hackathon',
#                  'email_26729982': 'email',
#                  'textfield_26729951': 'name'}

field_mappings ={   'textfield_28227510': 'name',
                    'textfield_28227511': 'lastname',
                    'email_28227516': 'email',
                    'dropdown_28227517': 'degree',
                    'textfield_28227512': 'university',
                    'textfield_28227513': 'graduateDate',
                    'yesno_28227519':'adult',
                    'textfield_28227514': 'face',
                    'group_28227508': 'built',
                    'website_28227524': 'github',
                    'website_28227525': 'devpost',
                    'website_28227526':'linkedin',
                    'website_28227527': 'personalSite',
                    'yesno_28227520': 'newbie',
                    'textarea_28227528': 'excitedAbout',
                    'textarea_28227529': 'workedOn',
                    'group_28227509': 'comesFrom',
                    'dropdown_28227518': 'country',
                    'textfield_28227515': 'city',
                    'yesno_28227521': 'needTravelScholarship',
                    'list_28227531_choice': 'tShirtSize',
                    'list_28227532_choice': 'dietaryRequirements',
                    'yesno_28227522': 'applyingAsAteam',
                    'textarea_28227530': 'teammatesName',
                    'statement_28227530': 'statement',
                    'yesno_28227523': 'mlhAuthorization'}

def generateCleanDict(apidata):
    questions_dict = {}
    clean_data = []

    for question in apidata['questions']:
        id = question['id']
        question_text = question['question']
        questions_dict[id] = question_text

    for response in apidata['responses']:
        answers = response['answers']
        tmp_dict = {}
        for field in answers:
            field_name = field_mappings[field]
            tmp_dict[field_name] = answers[field]

        clean_data.append(tmp_dict.copy())

    return clean_data

def createApplications(data):
    for application in data:
        name = application['name']
        del application['name']
        email = application['email']
        del application['email']
        #newbie = application['newbie'] == u'1'
        #del application['newbie']
        string_data = json.dumps(application)
        #app = Application(name=name, email=email, newbie=newbie, data=string_data)
        app = Application(name=name, email=email, data=string_data)
        db.session.add(app)
        info("Added application with email %s", email)

def getMoreResponses():
    offset = getVariable('api_offset', '0')

    info("Getting more responses from typeform API")
    apiurl = baseapiurl.format(apikey=apikey, formid=formid, offset=offset.value)
    info("Using \"%s\" as api url", apiurl)
    request = Request(apiurl)

    try:
        response = urlopen(request)
        info("Request successful")
        response_text = response.read()
        json_dict = json.loads(response_text)

        if('status' in json_dict and json_dict['status'] == 403):
            error("The API responded with: {}", json_dict['message'])
        else:
            num_responses = json_dict['stats']['responses']['showing']
            info("Gathered %s new responses", num_responses)
            clean_data = generateCleanDict(json_dict)

            createApplications(clean_data)
            # Update offset
            offset.value = str(int(offset.value) + num_responses)
            db.session.commit()

    except URLError, e:
        error('Error accessing API')