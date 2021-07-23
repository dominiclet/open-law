from flask import Flask, request, Response, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo

from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager

from bson import ObjectId
from queue import Queue
from collections import deque
from datetime import timedelta
from werkzeug.security import generate_password_hash, check_password_hash
import json

app = Flask(__name__)
# To allow Cross-origin resource sharing
app.config["CORS_HEADERS"] = "Content-Type"
cors = CORS(app, origins=["http://localhost:3000", "https://lawmology.herokuapp.com"], supports_credentials=True)
# MongoDB setup
app.config["MONGO_URI"] = "mongodb://localhost:27017/open_law"
# app.config["MONGO_URI"] = "mongodb+srv://dominic:HY3JRkvfL2T5pstz@cluster0.avlfw.mongodb.net/open_law?retryWrites=true&w=majority"
mongo = PyMongo(app)

# Initialize recent edits deque
# Activity is stored as {"id": , "case_name": , "action": , "subtopic": , "time": }
recent_edits = deque(maxlen=10)

# Initialize dictionary to store categories and their corresponding number of cases
# key: category
# value: [list of cases in category]
categories_dict = {}

#### Authentication setup ####
# Set this as an environment variable (here temporarily for testing)
TOKEN_EXPIRY = timedelta(days=1)
app.config["JWT_SECRET_KEY"] = "ivanlikesgayporn"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = TOKEN_EXPIRY
jwt = JWTManager(app)

"""
Handles login
"""
@app.route("/login", methods=['POST'])
def login():
    username = request.json.get("username")
    password = request.json.get("password")
    data = mongo.db.users.find_one({"username": username})
    if not data or not check_password_hash(data.get("password"), password):
        return jsonify({"msg": "Bad username or password"}), 401
    else:
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token)

"""
Handles logout
"""
# Maybe set up a blocklist? Is there a need? 

"""
Handles verification of password
"""
@app.route("/verifypw", methods=['POST'])
@jwt_required()
def verifypw():
    username = get_jwt_identity()
    password = request.json.get("password")
    data = mongo.db.users.find_one({"username": username})
    if not data or not check_password_hash(data.get("password"), password):
        return jsonify({"msg": "Bad password"}), 401
    else:
        return "", 200

"""
Handles change password
"""
@app.route("/changepw", methods=['POST'])
@jwt_required()
def changepw():
    username = get_jwt_identity()
    new_password = request.json.get("newPassword")
    data = mongo.db.users.find_one({"username": username})
    data["password"] = generate_password_hash(new_password)
    mongo.db.users.replace_one({"username": username}, data, True)
    return "", 200

"""
Handles registration of user
"""
@app.route("/register", methods=['POST'])
def register():
    data = request.json
    new_user = {
        "name": data.get("name"),
        "year": data.get("year"),
        "username": data.get("username"),
        "email": data.get("email"),
        "password": generate_password_hash(data.get("password"))
    }
    _id = mongo.db.users.insert(new_user)
    return str(_id), 200

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
@jwt_required()
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
        # Updates individual holding tag
        data[category][int(index)]["tag"] = updated_data["data"]["tag"]
        # Update the general tags of the case
        case_tags = set()
        for holding in data[category]:
            for tag in holding["tag"]:
                case_tags.add(tag)
        data["tag"] = list(case_tags)
    # Update last edited time
    data["lastEdit"] = updated_data["data"]["time"]
    # Update last edited person
    data["lastEditBy"] = get_jwt_identity()
    mongo.db.case_summaries.replace_one(query, data, True)

    # Update recent edit queue
    recent_edits.append({
        "id": caseId,
        "name": get_jwt_identity(),
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
@jwt_required()
def edit_case_identifiers(caseId):
    # Query by object ID of case
    query = {"_id": ObjectId(caseId)}
    # Fetch original data then update
    data = mongo.db.case_summaries.find_one_or_404(query)
    updated_data = json.loads(request.data)
    prev_name = data["name"]
    prev_citation = data["citation"]
    # Update case name
    data["name"] = updated_data["data"]["name"]
    # Update citations
    data["citation"] = updated_data["data"]["citation"]
    # Update case link
    data["link"] = updated_data["data"]["link"]
    # Update last edited time
    data["lastEdit"] = updated_data["data"]["time"]
    # Update person who last edited
    data["lastEditBy"] = get_jwt_identity()
    mongo.db.case_summaries.replace_one(query, data, True)

    # Update recent edit queue
    recent_edits.append({
        "id": caseId,
        "name": get_jwt_identity(),
        "action": "EDITCASENAME",
        "time": data["lastEdit"],
        "prevName": prev_name,
        "prevCitation": prev_citation,
        "case_name": data["name"],
        "currCitation": data["citation"]
    })

    return "", 200


"""
Add a new sub-topic entry
"""
@app.route("/addNewTopic/<caseId>/<category>", methods=['POST'])
@jwt_required()
def add_new_topic(caseId, category):
    # Query case
    query = {"_id": ObjectId(caseId)}
    data = mongo.db.case_summaries.find_one_or_404(query)
    # Need to add empty tag array and set ratio if category is holding
    if category == "holding":
        empty_entry = {"title": "", "content": "", "tag": [], "ratio": 2}
    else:
        empty_entry = {"title": "", "content": ""}
    data[category].append(empty_entry)

    # Update last edited time
    data["lastEdit"] = json.loads(request.data)["data"]["time"]
    # Update person who added case
    data["lastEditedBy"] = get_jwt_identity()

    mongo.db.case_summaries.replace_one(query, data, True)

    # Update recent activity queue
    recent_edits.append({
        "id": caseId,
        "name": get_jwt_identity(),
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
@jwt_required()
def delete_topic(caseId, category, index):
    query = {"_id": ObjectId(caseId)}
    data = mongo.db.case_summaries.find_one_or_404(query)
    # Remove specified entry
    data[category].pop(int(index))
    # Update last edited time
    data["lastEdit"] = json.loads(request.data)["time"]
    # Update person who last edited
    data["lastEditBy"] = get_jwt_identity()

    mongo.db.case_summaries.replace_one(query, data, True)

    # Update recent activity queue
    recent_edits.append({
        "id": caseId,
        "name": get_jwt_identity(),
        "case_name": data["name"],
        "action": "DELETE",
        "time": data["lastEdit"]
    })
    return json.dumps(data[category]), 200

"""
Updates issues
caseId: Unique case ID
"""
@app.route("/updateIssues/<caseId>", methods=['POST'])
@jwt_required()
def update_issues(caseId):
    query = {"_id": ObjectId(caseId)}
    data = mongo.db.case_summaries.find_one_or_404(query)
    incoming_data = json.loads(request.data)
    # Update issues
    data["issues"] = incoming_data["issuesData"]
    # Update last edit time
    data["lastEdit"] = incoming_data["time"]
    # Update last edit person
    data["lastEditBy"] = get_jwt_identity()

    mongo.db.case_summaries.replace_one(query, data, True)

    # Update recent activity queue
    recent_edits.append({
        "id": caseId,
        "name": get_jwt_identity(),
        "case_name": data["name"],
        "action": "EDITISSUES",
        "time": data["lastEdit"]
    })
    return json.dumps(data["issues"]), 200


"""
Returns the list of recent activities currently in the queue
"""
@app.route("/recentActivity", methods=['GET'])
@jwt_required()
def recent_activity():
    return json.dumps(list(recent_edits))

"""
Returns the list of cases for each tag with given limit
"""
@app.route("/casesTag/<queryTag>/<limit>", methods=['GET'])
def get_cases_by_tag(queryTag, limit=10):
    try:
        categories_dict[queryTag]
    except KeyError:
        getcategories()
    finally:
        limit = int(limit)
        if limit > len(categories_dict[queryTag]):
            limit = len(categories_dict[queryTag])
        return JSONEncoder().encode(categories_dict[queryTag][:limit])

"""
Returns all related cases for a given case based on matching tags
"""
@app.route("/relatedCases/<caseId>", methods=['GET'])
def get_related_cases(caseId):
    # get tags of input case
    tags = mongo.db.case_summaries.find_one_or_404({"_id": ObjectId(caseId)})["tag"]
    related_cases = []
    # find cases with most number of similar tags and append to list
    for i in range(len(tags)):
        data = mongo.db.case_summaries.find({"tag": {"$all": tags[i:]}})
        for j in data:
            if j not in related_cases and j["_id"] != ObjectId(caseId):
                related_cases.append(j)
    return JSONEncoder().encode(related_cases)



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
        "citation": [post_data["caseCitation"]],
        "tag": [],
        "lastEdit": "",
        "lastEditBy": get_jwt_identity(),
        "facts": [],
        "holding": [],
        "issues": []
    }
    _id = mongo.db.case_summaries.insert(new_doc)

    # Update recent activity queue
    recent_edits.append({
        "id": str(_id),
        "name": get_jwt_identity(),
        "case_name": new_doc["name"],
        "action": "ADDCASE",
        "time": post_data["time"]
    })
    return str(_id), 200

"""
Returns list of categories with corresponding number of cases in each category.
Only loops through tags of all cases when categories_dict is empty.
"""
@app.route("/categories", methods=['GET'])
def getcategories():
    if not categories_dict:
        data = mongo.db.case_summaries.find()
        for case in data:
            for tag in case["tag"]:
                if tag not in categories_dict:
                    categories_dict[tag] = [case]
                else:
                    categories_dict[tag].append(case)
    categories = []
    for tag in categories_dict:
        categories.append([tag, len(categories_dict[tag])])
    return JSONEncoder().encode(categories)


"""
Returns individual case information
"""
@app.route("/cases/<caseId>", methods=['GET'])
def getcase(caseId):
    data = mongo.db.case_summaries.find_one_or_404({"_id": ObjectId(caseId)})
    return JSONEncoder().encode(data)

"""
Returns forum posts for each case sorted by timestamp
"""
@app.route("/<caseId>/posts", methods=['GET'])
def get_posts(caseId):
    # find a way to sort, sort = {'_id': -1}
    data = mongo.db.case_summaries.find_one_or_404({"_id": ObjectId(caseId)})
    return JSONEncoder().encode(data["posts"])

"""
Search functionality
"""
@app.route("/search", methods=['GET'])
def search():
    query = request.args.get("q")
    cursor = mongo.db.case_summaries.find({"$text": {"$search": query}}, {
        "name": 1,
        "citation": 1,
        "issues": 1,
        "tag": 1,
        "lastEdit": 1,
        "lastEditBy": 1,
        "score": {"$meta": "textScore"}
    }).sort([("score", {"$meta": "textScore"})]).limit(10)
    return JSONEncoder().encode(list(cursor))

"""
Helper class
"""
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
