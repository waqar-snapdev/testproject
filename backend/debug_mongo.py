import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from dotenv import load_dotenv
import sys

# Force load from .env file in the same directory
load_dotenv()

mongo_uri = os.getenv("MONGODB_URI")
print(f"Testing connection to: {mongo_uri}")

if not mongo_uri:
    print("Error: MONGODB_URI not found in environment variables")
    sys.exit(1)

try:
    client = MongoClient(mongo_uri, serverSelectionTimeoutMS=2000)
    # The ismaster command is cheap and does not require auth.
    client.admin.command('ismaster')
    print("Success: Connected to MongoDB!")
except Exception as e:
    print(f"Error: Failed to connect to MongoDB. Exception type: {type(e).__name__}, Message: {e}")
    sys.exit(1)