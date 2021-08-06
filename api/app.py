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
import os
import random
import string

app = Flask(__name__)
# To allow Cross-origin resource sharing
app.config["CORS_HEADERS"] = "Content-Type"
cors = CORS(app, origins=["http://localhost:3000", "https://lawnotes.herokuapp.com"], supports_credentials=True)
# MongoDB setup
# app.config["MONGO_URI"] = "mongodb://localhost:27017/open_law"
app.config["MONGO_URI"] = os.environ.get("MONGO_URI")

mongo = PyMongo(app)

#### Authentication setup ####
# Set this as an environment variable (here temporarily for testing)
TOKEN_EXPIRY = timedelta(days=1)
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = TOKEN_EXPIRY
jwt = JWTManager(app)

# Token for registration
REGISTER_TOKEN = os.environ.get("REGISTER_TOKEN")

# Maximum allowed number of recent edits
MAX_RECENT_EDITS = 5

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
        # Update last login
        data["lastLogin"] = request.json.get("dateTime")
        mongo.db.users.replace_one({"username": username}, data, True)
        # Create access token and return 
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
    if data.get("token") != REGISTER_TOKEN:
        return "Bad token", 401
    # Check if username already exists
    user = mongo.db.users.find_one({"username": data.get("username")})
    if user:
        return "Username taken", 409
    
    # Check if user with this email exists
    user = mongo.db.users.find_one({"email": data.get("email")})
    if user: 
        return "Email in use", 409
    
    new_user = {
        "name": data.get("name"),
        "class": data.get("class"),
        "username": data.get("username"),
        "email": data.get("email"),
        "password": generate_password_hash(data.get("password")),
        "recent_edits": [],
        "permissions": {
            "edit": 1,
            "admin": 0,
            "mod": 0
        },
        "stats": {
            "contributions": None,
            "casesCreated": 0,
            "topReplied": [],
            "forumCount": 0
        },
        "badges": [],
        "lastLogin": ""
    }
    _id = mongo.db.users.insert(new_user)
    return str(_id), 200

"""
Get user data
"""
@app.route("/user/<username>", methods=['GET'])
@jwt_required()
def user_data(username):
    query = {"username": get_jwt_identity()} if username == "self" else {"username": username} 
    data = mongo.db.users.find_one_or_404(query)
    return JSONEncoder().encode(data)

"""
Get data for all users, for admin page
(Requires admin privilege)
"""
@app.route("/admin/users", methods=['GET'])
@jwt_required()
def all_user_data():
    # Validate admin rights of accessing user
    access_user = mongo.db.users.find_one({"username": get_jwt_identity()})
    if not access_user["permissions"]["admin"]:
        return "Admin rights required", 403
    data = mongo.db.users.find({})
    return JSONEncoder().encode(list(data))

"""
Resets password for another user
(Requires admin privilege)
userId: Unique mongoDB database ID of user
"""
@app.route("/admin/resetpw", methods=['POST'])
@jwt_required()
def reset_pw():
    # Validate admin rights of accessing user
    access_user = mongo.db.users.find_one({"username": get_jwt_identity()})
    if not access_user["permissions"]["admin"]:
        return "Admin rights required", 403
    query = {"_id": ObjectId(json.loads(request.data).get("userId"))}
    user_data = mongo.db.users.find_one_or_404(query)
    new_password = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(8))
    user_data["password"] = generate_password_hash(new_password)
    mongo.db.users.replace_one(query, user_data, True)
    return new_password, 200

"""
Toggles edit privilege for user
"""
@app.route("/admin/toggleEdit", methods=['POST'])
@jwt_required()
def toggle_edit():
    # Validate admin rights of accessing user
    access_user = mongo.db.users.find_one({"username": get_jwt_identity()})
    if not access_user["permissions"]["admin"]:
        return "Admin rights required", 403
    query = {"_id": ObjectId(json.loads(request.data).get("userId"))}
    user_data = mongo.db.users.find_one_or_404(query)
    user_data["permissions"]["edit"] = 0 if user_data["permissions"]["edit"] else 1
    mongo.db.users.replace_one(query, user_data, True)
    return f'Edit privileges for {user_data["username"]} {"enabled" if user_data["permissions"]["edit"] else "disabled"}', \
    200

"""
Disables/Enables edit privileges for all users
"""
@app.route("/admin/edit/<action>", methods=['POST'])
@jwt_required()
def edit_all_edit_privileges(action):
    # Validate admin rights of accessing user
    access_user = mongo.db.users.find_one({"username": get_jwt_identity()})
    if not access_user["permissions"]["admin"]:
        return "Admin rights required", 403
    mongo.db.users.update_many({}, {
        '$set': {
            'permissions.edit': 1 if int(action) else 0
        }
    })
    return ""
    

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

@app.route("/editSubTopic/<caseId>/<category>", methods=['POST'])
@jwt_required()
def edit_sub_topic(caseId, category):
    # Query by object ID of case
    query = {"_id": ObjectId(caseId)}
    # Fetch original data then update
    data = mongo.db.case_summaries.find_one_or_404(query)
    updated_data = json.loads(request.data)
    if category == "facts":
        data["facts"] = updated_data.get("factData")
    elif category == "holding":
        # Get original tags to compare with new tags
        original_tag_arr = set()
        for holding in data["holding"]:
            for tag in holding["tag"]:
                original_tag_arr.add(tag)
        # Update general holding data
        data["holding"] = updated_data.get("holdingData")
        # Update the general tags of the case
        case_tags = set()
        for holding in data["holding"]:
            for tag in holding["tag"]:
                case_tags.add(tag)
        data["tag"] = list(case_tags)

        # Find difference between original and new tag lists
        common_tags = case_tags & original_tag_arr
        to_remove = common_tags ^ original_tag_arr
        to_add = common_tags ^ case_tags
        # Handle untagged cases
        if not original_tag_arr:
            to_remove.add("Untagged")
        if not case_tags:
            to_add.add("Untagged")
        # Remove and add based on differences between original and new lists
        for tag in to_remove:
            mongo.db.categories.update(
                {"category" : tag},
                {"$pull" : {"cases" : {"id" : data["_id"]}}}
            )
        for tag in to_add:
            if not mongo.db.categories.find_one({"category": tag}):
                new_category = {
                    "category" : tag,
                    "cases" : []
                }
                mongo.db.categories.insert(new_category)
            new_case = {
                "name" : data["name"],
                "id" : data["_id"],
                "citation" : data["citation"],
                "lastEdit" : data["lastEdit"]
            }
            mongo.db.categories.update({"category": tag}, {'$push': {"cases": new_case}}) 

    # Update last edited time
    data["lastEdit"] = updated_data["time"]
    # Update last edited person
    data["lastEditBy"] = get_jwt_identity()
    mongo.db.case_summaries.replace_one(query, data, True)

    # Update recent activity queue
    mongo.db.activity_log.insert({
        "id": caseId,
        "name": get_jwt_identity(),
        "case_name": data["name"],
        "action": "EDIT",
        "topic": category,
        "time": updated_data["time"]
    })

    # Update recent edits for this user
    update_database_recent_edits(get_jwt_identity(), {
        "caseId": caseId,
        "caseName": data["name"],
        "caseCitation": data["citation"]
    }, data["tag"])

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

    # Update recent activity queue
    mongo.db.activity_log.insert({
        "id": caseId,
        "name": get_jwt_identity(),
        "action": "EDITCASENAME",
        "time": data["lastEdit"],
        "prevName": prev_name,
        "prevCitation": prev_citation,
        "case_name": data["name"],
        "currCitation": data["citation"]
    })

    # Update recent edits and contribution stats
    update_database_recent_edits(get_jwt_identity(), {
        "caseId": caseId,
        "caseName": data["name"],
        "caseCitation": data["citation"]
    }, data["tag"])

    return "", 200

# NO LONGER IN USE
"""
# Add a new sub-topic entry
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
    mongo.db.activity_log.insert({
        "id": caseId,
        "name": get_jwt_identity(),
        "case_name": data["name"],
        "action": "ADDTOPIC",
        "time": data["lastEdit"]
    })

    # Update recent edits and contribution stats
    update_database_recent_edits(get_jwt_identity(), {
        "caseId": caseId,
        "caseName": data["name"],
        "caseCitation": data["citation"]
    }, data["tag"])

    return empty_entry, 200
"""

# NO LONGER IN USE
"""
# Delete a sub-topic entry
# 
# caseId: Unique case ID
# category: facts/holding
# index: Index to identify the sub-topic entry that is deleted
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
    mongo.db.activity_log.insert({
        "id": caseId,
        "name": get_jwt_identity(),
        "case_name": data["name"],
        "action": "DELETE",
        "time": data["lastEdit"]
    })

    # Update recent edits and contributions stats
    update_database_recent_edits(get_jwt_identity(), {
        "caseId": caseId,
        "caseName": data["name"],
        "caseCitation": data["citation"]
    }, data["tag"])

    return json.dumps(data[category]), 200
"""

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
    mongo.db.activity_log.insert({
        "id": caseId,
        "name": get_jwt_identity(),
        "case_name": data["name"],
        "action": "EDITISSUES",
        "time": data["lastEdit"]
    })

    # Update recent edits and contribution stats
    update_database_recent_edits(get_jwt_identity(), {
        "caseId": caseId,
        "caseName": data["name"],
        "caseCitation": data["citation"]
    }, data["tag"])

    return json.dumps(data["issues"]), 200


"""
Returns the list of recent activities currently in the database queue
"""
@app.route("/recentActivity", methods=['GET'])
@jwt_required()
def recent_activity():
    activity = mongo.db.activity_log.find().sort("_id", -1).limit(10)
    return JSONEncoder().encode(list(activity))

"""
Returns the recent edits of this user
"""
@app.route("/recentEdits", methods=['GET'])
@jwt_required()
def recent_edits():
    data = mongo.db.users.find_one_or_404({"username": get_jwt_identity()})
    return jsonify(data.get("recent_edits"))

"""
Returns the list of cases for each tag with given limit
"""
@app.route("/casesTag/<queryTag>/<limit>", methods=['GET'])
@jwt_required()
def get_cases_by_tag(queryTag, limit=10):
    category_cases = mongo.db.categories.find_one_or_404({"category" : queryTag})
    cases = []
    for case in category_cases["cases"]:
        cases.append(mongo.db.case_summaries.find_one({"_id" : case["id"]}))
    # dont know which is faster
    # data = mongo.db.case_summaries.find({"tag" : queryTag})
    limit = int(limit)
    if limit > len(cases):
        limit = len(cases)
    return JSONEncoder().encode(cases[:limit])

"""
Returns all related cases for a given case based on matching tags
"""
@app.route("/relatedCases/<caseId>", methods=['GET'])
@jwt_required()
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
checked: 1 indicates that duplicate checking was done, 0 indicates otherwise
"""
@app.route("/addNewCase/<checked>", methods=['POST'])
@jwt_required()
def add_new_case(checked):
    post_data = json.loads(request.data)

    # If manual user duplicate check was not done yet, check for cases with similar names
    if not int(checked):
        cursor = mongo.db.case_summaries.find({"$text": {"$search": post_data["caseName"]}}, {
            "name": 1,
            "citation": 1,
            "score": {"$meta": "textScore"}
        }).sort([("score", {"$meta": "textScore"})]).limit(5)
        similar_cases = list(cursor)
        # Only return similar case data with a 202 status if the similarity score is high,
        # otherwise just add the case
        if similar_cases[0].get("score") >= 1:
            return JSONEncoder().encode(similar_cases), 202

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
    mongo.db.activity_log.insert({
        "id": str(_id),
        "name": get_jwt_identity(),
        "case_name": new_doc["name"],
        "action": "ADDCASE",
        "time": post_data["time"]
    })

    # Update number of cases added in users database
    user_data = mongo.db.users.find_one_or_404({"username": get_jwt_identity()})
    user_data["stats"]["casesCreated"] += 1
    mongo.db.users.replace_one({"username": get_jwt_identity()}, user_data, True)

    return str(_id), 200

"""
Populates categories collection (should only run once when collection is newly created)
"""
#@app.route("/fill_categories_collection", methods=['GET', 'POST'])
#def add_categories():
#    case_data = mongo.db.case_summaries.find()
#    new_category = {
#        "category" : "Untagged",
#        "cases" : []
#    }
#    mongo.db.categories.insert(new_category)
#
#    for case in case_data:
#        if not case["tag"]:
#            new_case = {
#                "name" : case["name"],
#                "id" : case["_id"],
#                "citation" : case["citation"],
#                "lastEdit" : case["lastEdit"]
#            }
#            mongo.db.categories.update({"category": "Untagged"}, {'$push': {"cases": new_case}})
#            
#        for tag in case["tag"]:
#            if not mongo.db.categories.find_one({"category": tag}):
#                new_category = {
#                    "category" : tag,
#                    "cases" : []
#                }
#                mongo.db.categories.insert(new_category)
#            new_case = {
#                "name" : case["name"],
#                "id" : case["_id"],
#                "citation" : case["citation"],
#                "lastEdit" : case["lastEdit"]
#            }
#            mongo.db.categories.update({"category": tag}, {'$push': {"cases": new_case}})
#    return "Cases updated", 200

"""
Returns list of categories with corresponding number of cases in each category.
"""
@app.route("/categories", methods=['GET'])
@jwt_required()
def getcategories():
    data = mongo.db.categories.find()
    # Populate categories collection if it is empty
    if not data:
        add_categories()
    categories = []
    for category in data:
        categories.append([category["category"], len(category["cases"])])
    return JSONEncoder().encode(categories)

"""
Returns individual case information
caseId: Unique ID of case
action: Either "read" or "write". "write" checks for edit permission of user
"""
@app.route("/cases/<caseId>/<action>", methods=['GET'])
@jwt_required()
def getcase(caseId, action):
    data = mongo.db.case_summaries.find_one({"_id": ObjectId(caseId)})
    user_data = mongo.db.users.find_one({"username": get_jwt_identity()})
    # If data does not exist, then delete it if it exists in recent edits 
    # (since user probably navigated to it via recent edits)
    if not data:
        recent_edits = user_data.get("recent_edits")
        for i, case in enumerate(recent_edits.copy()):
            if case.get("caseId") == caseId:
                recent_edits.pop(i)
                user_data["recent_edits"] = recent_edits
                mongo.db.users.replace_one({"username": get_jwt_identity()}, user_data, True)
                break
        return "Case not found", 404
    
    # If case data is fetched for edit page, check if user has edit privileges
    if action == "write" and not user_data["permissions"]["edit"]:
        return "This account does not have edit permission", 403
                
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
    }).sort([("score", {"$meta": "textScore"})]).limit(20)
    return JSONEncoder().encode(list(cursor))

"""
Helper function to update user database for recently edited case
as well as update the user contributions statistics 
username: username of current user
new_case: mini case info of the case that was recently edited
tags: tags of the case 
void function
"""
def update_database_recent_edits(username, new_case, tags):
    data = mongo.db.users.find_one_or_404({"username": username})
    new_recent_edits = update_recent_edits(data.get("recent_edits"), new_case)
    data["recent_edits"] = new_recent_edits
    if not data["stats"]["contributions"]:
        contributions = {}
        for tag in tags:
            contributions[tag] = 1
        data["stats"]["contributions"] = contributions
    else:
        for tag in tags:
            if tag in data["stats"]["contributions"]:
                data["stats"]["contributions"][tag] += 1
            else:
                data["stats"]["contributions"][tag] = 1
    mongo.db.users.replace_one({"username": username}, data, True)
    return

"""
Helper function to update the list of recent_edits
Note that this function might augment old_lst
old_lst: The previously stored list in database
new_case: The info of the new case that is being inserted
returns: An updated list of recently edited cases
"""
def update_recent_edits(old_lst, new_case):
    history_contains = False
    index = 0
    for i, case_info in enumerate(old_lst):
        if case_info.get("caseId") == new_case.get("caseId"):
            index = i
            history_contains = True
    if history_contains:
        old_lst.pop(index)
        old_lst.append(new_case)
    else:
        old_lst.append(new_case)
        if len(old_lst) > MAX_RECENT_EDITS:
            old_lst.pop(0)
    return old_lst
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
