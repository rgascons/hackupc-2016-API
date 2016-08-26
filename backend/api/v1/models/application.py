from db import db
import json

class Application(db.Model):
    __tablename__ = 'applications'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(256))
    email = db.Column(db.String(128))
    newbie = db.Column(db.Boolean)
    data = db.Column(db.Text())
    state = db.Column(db.String(10))

    def to_dict(self):
        final_json = dict()

        final_json['id'] = self.id
        final_json['name'] = self.name
        final_json['email'] = self.email
        final_json['newbie'] = self.newbie
        final_json['state'] = self.state

        partial_data = json.loads(self.data)

        final_json.update(partial_data)

        return final_json

    @staticmethod
    def getByID(id):
        app = Application.query.filter_by(id=id).first()
        return app

