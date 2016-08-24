from flask import jsonify, request, abort
from functools import wraps
from  models.judge import Judge
#from errors import AuthError


def asJSON(f, return_code = 200):
    @wraps(f)
    def decorator(*args, **kwargs):
        response = jsonify(f(*args, **kwargs))
        response.status_code = return_code
        return response
    return decorator

def requiresToken(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        judge = Judge.getJudgeIdByToken()
        if judge is not None:
            return f(*args, **kwargs)
        abort(403)

    return decorator