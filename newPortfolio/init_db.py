"""
Initialize the sqlite3 database with photos from /static/photo/
"""

import sqlite3
import os
import re

from PIL import Image
from PIL.ExifTags import TAGS


static_path = '/home/snorthway/newPortfolio/newPortfolio/static/'

conn = sqlite3.connect('/home/snorthway/newPortfolio/portfolio.db')
c = conn.cursor()

photo_path = os.path.join(static_path, 'photo')

photos = []

for f in os.listdir(photo_path):
	date = scrape_date(os.path.join(photo_path, f))

	try:
		id_num = re.search(r"_(?P<photo_num>\d+)_")
		photos.append(id_num, date)
	except:
		pass
	

def scrape_date(path):
	"""
	Use PIL to get dates from each photo's EXIF tags.
	"""
	date = None
	i = Image.open(path)
	info = i._getexif()
	if info is not None:
		for tag, value in info.items():
			decoded = TAGS.get(tag, tag)
			if decoded == "DateTimeOriginal":
				date = value
	return date