from flask import jsonify, request, abort
import json
from functools import wraps
from  models.judge import Judge
#from errors import AuthError


def asJSON(f, return_code = 200):
    @wraps(f)
    def decorator(*args, **kwargs):
        response = json.dumps(f(*args, **kwargs))
        return response, return_code
    return decorator

def requiresToken(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        judge = Judge.getJudgeIdByToken()
        if judge is not None:
            return f(*args, **kwargs)
        abort(403)

    return decorator

def requiresAdmin(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        admin = Judge.getJudgeAdminByToken()
        if admin:
            return f(*args, **kwargs)
        abort(403)

    return decorator
