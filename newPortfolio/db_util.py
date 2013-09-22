import sqlite3
from flask import g
from newPortfolio import app

DATABASE = '/home/snorthway/newPortfolio/portfolio.db'

def get_db():
	db = getattr(g, '_database', None)
	if db is None:
		db = g._database = sqlite3.connect(DATABASE)
	return db

def query_db(query):
	cur = get_db().exectue(query)
	rv = cur.fetchall()
	cur.close()
	return rv[0] if rv else None

@app.teardown_appcontext
def close_connection(exception):
	db = getattr(g, '_database', None)
	if db is not None:
		db.close()