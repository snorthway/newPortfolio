from newPortfolio import app, db_util
from flask import render_template
import os

# def aws_url(folder, photo):
# 	return "https://s3.amazonaws.com/snorthway_portfolio/%s/%s" % (folder, photo)

@app.route('/')
def home():
	return render_template('home.html')

@app.route('/contact')
def contact():
	return render_template('contact.html')

@app.route('/art')
def art():
	return render_template('art.html')

@app.route('/engineering')
def engineering():
	return render_template('engineering.html')