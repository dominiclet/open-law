from flask import Flask
from flask_cors import CORS
from flask_pymongo import PyMongo
from bson import ObjectId
import json

app = Flask(__name__)
# To allow Cross-origin resource sharing
CORS(app)
# MongoDB setup
app.config["MONGO_URI"] = "mongodb://localhost:27017/test"
mongo = PyMongo(app)

@app.route("/")
def test():
    return "Success"

@app.route("/testmongo")
def testmongo():
    return JSONEncoder().encode(mongo.db.cases.find_one())

@app.route("/cases")
def getcases():
    data = mongo.db.cases.find()
    case_information = []
    for i in data:
        case_information.append(i)
    return JSONEncoder().encode(case_information)

@app.route("/cases/<name>")
def getcase(name):
    data = mongo.db.cases.find({"name" : name})
    case_information = []
    for i in data:
        case_information.append(i)
    return JSONEncoder().encode(case_information[0])


# For JSON encoding of MongoDB ObjectId field
class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self,o)
