from urllib2 import Request, urlopen, URLError
from ..settings import apikey, formid, baseapiurl
from logging import info, debug, warning, error
from ..models.variable import Variable, getVariable
from ..models.application import Application
from ..models.db import db
import json

field_mappings = {'list_26730025_choice': 'best_language',
                  'yesno_26729967': 'first_hackathon',
                  'email_26729982': 'email',
                  'textfield_26729951': 'name'}

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
        newbie = application['first_hackathon'] == u'1'
        del application['first_hackathon']
        string_data = json.dumps(application)
        app = Application(name=name, email=email, newbie=newbie, data=string_data)
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