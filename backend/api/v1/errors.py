class ValidationError(object):
	def __init__(self, field, message):
		self.field = field
		self.message = message

@applicationManager.errorhandler(ValidationError)
@asJSON(400)
def handleValidationError(error):
	return {
		'msg': error.message,
		'type': 'Validation',
		'field': error.field
	}