from newPortfolio import app
from flask import render_template
import os

# def aws_url(folder, photo):
# 	return "https://s3.amazonaws.com/snorthway_portfolio/%s/%s" % (folder, photo)

@app.route('/')
def home():
	return render_template('home.html')