from flask import jsonify
from functools import wraps

def asJSON(return_code = 200):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            response = jsonify(f())
            response.status_code = return_code
        return decorated_function
    return decorator

def requires_token(f):
    @wraps(f)
    def wrappedToken(*args, **kwargs):
        pass
    return wrappedToken