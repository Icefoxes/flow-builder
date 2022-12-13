import pymongo

conn_str = 'mongodb://localhost:27017'

client = pymongo.MongoClient(conn_str, serverSelectionTimeoutMS=5000)
db = client['gnomon']
table = db['teams']