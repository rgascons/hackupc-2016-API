from flask import Flask
import v1

applicationManager = Flask(__name__)
applicationManager.register_blueprint(v1.apiv1)

if __name__ == "__main__":
    applicationManager.run()