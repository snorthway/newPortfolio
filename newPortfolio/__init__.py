import os
from flask import Flask

app = Flask(__name__)
app.debug = False

from views import *

if __name__ == '__main__':
	app.run()
