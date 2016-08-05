 # Return as JSON, by default it return a 200 OK, can be overriden by return_code
 def asJSON(return_code = 200):
 	@functools.wraps(f)
 	def wrapped(*args, **kwargs):
 		response = jsonify(f())
 		response.status_code = return_code
 	return wrapped