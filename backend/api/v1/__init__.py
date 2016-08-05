from flask import Flask, request, jsonify
import uuid
import datetime

applicationManager = Flask(__name__)

if __name__ == "__main__":
    applicationManager.run()