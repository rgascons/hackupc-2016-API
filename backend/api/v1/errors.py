class AuthError(object):
	def __init__(self, field, message):
		self.field = field
		self.message = message

@applicationManager.errorhandler(AuthError)
@asJSON(return_code=401)
def handleAuthError(error):
	return {
		'msg': error.message,
		'type': 'Auth',
		'field': error.field
	}