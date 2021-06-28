from flask import Flask, request, Response, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo

from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager

from bson import ObjectId
from queue import Queue
import json

app = Flask(__name__)
# To allow Cross-origin resource sharing
cors = CORS(app)
# MongoDB setup
app.config["MONGO_URI"] = "mongodb://localhost:27017/open_law"
mongo = PyMongo(app)

# Initialize recent edits queue
# Activity is stored as {"id": , "case_name": , "action": , "subtopic": , "time": }
recent_edits = Queue(10)

#### Authentication setup ####
# Set this as an environment variable (here temporarily for testing)
app.config["JWT_SECRET_KEY"] = "ivanlikesgayporn"
jwt = JWTManager(app)

"""
Handles login
"""
@app.route("/login", methods=['POST'])
def login():
    username = request.json.get("username")
    password = request.json.get("password")
    if username != "test" or password != "test":
        return jsonify({"msg": "Bad username or password"}), 401
    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token)

"""
Allows pinging of backend to verify JWT
"""
@app.route("/token/ping", methods=['POST'])
@jwt_required()
def ping():
    return "", 200

# For edit case summary page
"""
Handles posting of case summary sub-topic and its contents into database

caseId: Unique ID of the case
category: facts/holding
index: The index where the subtopic is located in the JSON array
"""
@app.route("/editSubTopic/<caseId>/<category>/<index>", methods=['POST'])
def edit_sub_topic(caseId, category, index):
    # Query by object ID of case
    query = {"_id": ObjectId(caseId)}
    # Fetch original data then update
    data = mongo.db.case_summaries.find_one_or_404(query)
    updated_data = json.loads(request.data)
    # Update topic title
    data[category][int(index)]["title"] = updated_data["data"]["topic"]
    # Update text
    data[category][int(index)]["content"] = updated_data["data"]["text"]
    # Need to handle ratio and tags data if category is holding
    if category == "holding":
        data[category][int(index)]["ratio"] = updated_data["data"]["ratio"]
        data[category][int(index)]["tag"] = updated_data["data"]["tag"]
    # Update last edited time
    data["lastEdit"] = updated_data["data"]["time"]
    mongo.db.case_summaries.replace_one(query, data, True)

    # Update recent edit queue
    recent_edits.put({
        "id": caseId,
        "case_name": data["name"],
        "action": "EDIT",
        "subtopic": updated_data["data"]["topic"],
        "time": updated_data["data"]["time"]
    })
    return "", 200


"""
Handles posting of case name and citation
"""
@app.route("/editCaseIdentifiers/<caseId>", methods=['POST'])
def edit_case_identifiers(caseId):
    # Query by object ID of case
    query = {"_id": ObjectId(caseId)}
    # Fetch original data then update
    data = mongo.db.case_summaries.find_one_or_404(query)
    updated_data = json.loads(request.data)
    # Update case name
    data["name"] = updated_data["data"]["name"]
    # Update citations
    data["citation"] = updated_data["data"]["citation"]
    # Update last edited time
    data["lastEdit"] = updated_data["data"]["time"]
    mongo.db.case_summaries.replace_one(query, data, True)
    return "", 200


"""
Add a new sub-topic entry
"""
@app.route("/addNewTopic/<caseId>/<category>", methods=['POST'])
def add_new_topic(caseId, category):
    # Query case
    query = {"_id": ObjectId(caseId)}
    data = mongo.db.case_summaries.find_one_or_404(query)
    # Need to add empty tag array and set ratio if category is holding
    if category == "holding":
        empty_entry = {"title": "", "content": "", "tag": [], "ratio": False}
    else:
        empty_entry = {"title": "", "content": ""}
    data[category].append(empty_entry)
    mongo.db.case_summaries.replace_one(query, data, True)

    # Update last edited time
    data["lastEdit"] = json.loads(request.data)["data"]["time"]
    # Update recent activity queue
    recent_edits.put({
        "id": caseId,
        "case_name": data["name"],
        "action": "ADDTOPIC",
        "time": data["lastEdit"]
    })
    return empty_entry, 200


"""
Delete a sub-topic entry

caseId: Unique case ID
category: facts/holding
index: Index to identify the sub-topic entry that is deleted
"""
@app.route("/deleteTopic/<caseId>/<category>/<index>", methods=['DELETE'])
def delete_topic(caseId, category, index):
    query = {"_id": ObjectId(caseId)}
    data = mongo.db.case_summaries.find_one_or_404(query)
    # Remove specified entry
    data[category].pop(int(index))
    mongo.db.case_summaries.replace_one(query, data, True)

    # Update last edited time
    data["lastEdit"] = json.loads(request.data)["time"]
    # Update recent activity queue
    recent_edits.put({
        "id": caseId,
        "case_name": data["name"],
        "action": "DELETE",
        "time": data["lastEdit"]
    })
    return json.dumps(data[category]), 200


"""
Returns the list of recent activities currently in the queue
"""
@app.route("/recentActivity", methods=['GET'])
def recent_activity():
    return json.dumps(list(recent_edits.queue))

"""
Adds a new case with mostly empty data.
Case name must be provided.
"""
@app.route("/addNewCase", methods=['POST'])
@jwt_required()
def add_new_case():
    post_data = json.loads(request.data)

    new_doc = {
        "name": post_data["caseName"],
        "citation": [],
        "tag": [],
        "lastEdit": "",
        "facts": [],
        "holding": []
    }
    _id = mongo.db.case_summaries.insert(new_doc)

    # Update recent activity queue
    recent_edits.put({
        "id": str(_id),
        "case_name": new_doc["name"],
        "action": "ADDCASE",
        "time": post_data["time"]
    })
    return str(_id), 200

"""
Returns list of categories (based on tags of cases)
"""
@app.route("/categories")
def getcategories():
    data = mongo.db.case_summaries.find()
    categories = []
    for i in data:
        for j in i["tag"]:
            if j not in categories:
                categories.append(j)
    return JSONEncoder().encode(categories)


"""
Returns individual case information
"""
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


"""
Test methods
"""
@app.route("/")
def test():
    return "Success!"


@app.route("/testmongo")
def testmongo():
    return JSONEncoder().encode(mongo.db.case_summaries.find_one())
