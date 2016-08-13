from flask import jsonify
from functools import wraps
# from errors import AuthError

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
        # raise AuthError("test", "testing")
        return f(*args, **kwargs)
    return decorator