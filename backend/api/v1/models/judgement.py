from db import db

class Judgement(db.Model):
	__tablename__ = 'judgements'

	# Columns TODO
	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	rating = db.Column(db.String(6))
	judge_id = db.Column(db.Integer)
	judge_index = db.Column(db.Integer)