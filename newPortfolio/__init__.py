import os
from flask import Flask
from flask_s3 import FlaskS3

s3 = FlaskS3()

def start_app():
	app = Flask(__name__)
	s3.init_app(app)
	return app

app = start_app()

app.config['S3_BUCKET_NAME'] = 'snorthway_portfolio'


app.debug = True

from views import *

if __name__ == '__main__':
	app.run()
