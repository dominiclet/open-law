from flask import Flask
from flask_cors import CORS
from flask_pymongo import PyMongo
from bson import ObjectId
import json

app = Flask(__name__)
# To allow Cross-origin resource sharing
CORS(app)
# MongoDB setup
app.config["MONGO_URI"] = "mongodb://localhost:27017/open_law"
mongo = PyMongo(app)


@app.route("/")
def test():
    return "Success!"


@app.route("/testmongo")
def testmongo():
    return JSONEncoder().encode(mongo.db.case_summaries.find_one())


@app.route("/cases")
def getcases():
    data = mongo.db.case_summaries.find()
    case_information = []
    for i in data:
        case_information.append(i)
    return JSONEncoder().encode(case_information)


@app.route("/cases/<caseId>")
def getcase(caseId):
    data = mongo.db.case_summaries.find_one_or_404({"_id": ObjectId(caseId)})
    return JSONEncoder().encode(data)


# For JSON encoding of MongoDB ObjectId field
class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)
