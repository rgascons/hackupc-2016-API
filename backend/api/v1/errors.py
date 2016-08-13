from endpoints import apiv1
from decorators import asJSON

BAD_REQUEST = 400
UNAUTHORIZED = 401
NOT_FOUND = 404
INTERNAL_SERVER_ERROR = 500

class AuthError(object):
	def __init__(self, field, message):
		self.field = field
		self.message = message

@apiv1.errorhandler(AuthError)
@asJSON(return_code=BAD_REQUEST)
def handleAuthError(error):
	return {
		'msg': error.message,
		'type': 'Auth',
		'field': error.field
	}