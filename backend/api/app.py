from flask import Flask
import v1
from v1.models import db
from logging import info, error, warning, DEBUG
import logging

logging.basicConfig(filename='api.log',format='[%(asctime)s][%(levelname)s]: %(message)s',level=logging.DEBUG)

hupcAPI = Flask(__name__)
info("API Flask application initialized")
hupcAPI.register_blueprint(v1.apiv1)
info("API v1 Blueprint registered")
hupcAPI.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tmp/test.db'
db.init_app(hupcAPI)
info("Database connection initialized")

with hupcAPI.app_context():
    db.create_all()