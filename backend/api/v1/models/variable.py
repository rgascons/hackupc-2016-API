from db import db


class Variable(db.Model):
	__tablename__ = 'variables'

	id = db.Column(db.String, primary_key=True)
	value = db.Column(db.String(255))


def getVariable(name, default = None):
    data = Variable.query.filter_by(id=name).first()

    if data == None and default != None:
        data = Variable(id=name, value=default)
        db.session.add(data)
        db.session.commit()

    return data