from newPortfolio import app
from flask import render_template
import os

def aws_url(folder, photo):
	return "https://s3.amazonaws.com/%s/%s/%s" % (os.environ.get('S3_BUCKET'), folder, photo)

@app.route('/')
def home():
	photo = aws_url("photography","IMG_6461e.jpg")
	return render_template('home.html', photo=photo)