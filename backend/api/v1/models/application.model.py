from .. import db

class Application(db.Model):
	__tablename__ = 'applications'

	# Columns TODO
	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	name = db.Column(db.String(256))
	email = db.Column(db.String(128))
	newbie = db.Column(db.Boolean)
