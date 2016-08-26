from db import db
from flask import request

__package__ = "api.v1.models.judge"

class Judge(db.Model):
	__tablename__ = 'judges'

	# Columns TODO
	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	name = db.Column(db.String(256))
	email = db.Column(db.String(128))
	password = db.Column(db.String(256))
	token = db.Column(db.String(256))
	admin = db.Column(db.Boolean)

	@staticmethod
	def getJudgeIdByToken():
		token = request.args.get('token', '')
		judge = Judge.query.filter_by(token=token).first()
		if judge is not None:
			return judge.id
		else:
			return None

	@staticmethod
	def getJudgeAdminByToken():
		token = request.args.get('token', '')
		judge = Judge.query.filter_by(token=token).first()
		if judge is not None:
			return judge.admin
		else:
			return False
