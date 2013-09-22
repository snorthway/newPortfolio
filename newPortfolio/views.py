from newPortfolio import app, db_util
from flask import render_template
import os

# def aws_url(folder, photo):
# 	return "https://s3.amazonaws.com/snorthway_portfolio/%s/%s" % (folder, photo)

@app.route('/')
def home():
	return render_template('home.html')

@app.route('/rad/')
def rad():
	return render_template('rad.html')