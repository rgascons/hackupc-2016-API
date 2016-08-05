class ValidationError(object):
	def __init__(self, field, message):
		self.field = field
		self.message = message

@applicationManager.errorhandler(ValidationError)
def handleValidationError(error):
	response = jsonify({
		'msg': error.message,
		'type': 'Validation',
		'field': error.field
	})
	response.status_code = 400
	return response