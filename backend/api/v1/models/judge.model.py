from .. import db

class Judge(db.Model):
	__tablename__ = 'judges'

	# Columns TODO
	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	name = db.Column(db.String(256))
	email = db.Column(db.String(128))
	password = db.Column(db.String(256))
	token = db.Column(db.String(256))