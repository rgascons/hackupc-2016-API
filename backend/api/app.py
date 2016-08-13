from flask import Flask
import v1
from v1.models import db

hupcAPI = Flask(__name__)
hupcAPI.register_blueprint(v1.apiv1)
hupcAPI.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tmp/test.db'
db.init_app(hupcAPI)

with hupcAPI.app_context():
    db.create_all()