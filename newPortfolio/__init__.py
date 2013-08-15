import os
from flask import Flask
from flask_s3 import FlaskS3

app = Flask(__name__)
app.config['S3_BUCKET_NAME'] = 'snorthway_portfolio'
s3 = FlaskS3()
s3.init_app(app)

app.debug = True

from views import *

if __name__ == '__main__':
	app.run()
