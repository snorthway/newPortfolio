import sqlite3
import os

from PIL import Image
from PIL.ExifTags import TAGS


static_path = '/home/snorthway/newPortfolio/static/'

conn = sqlite3.connect('/home/snorthway/newPortfolio/portfolio.db')
c = conn.cursor()

photo_path = os.path.join(static_path, 'photo')

photos = []

for f in os.listdir(photo_path):
	date = scrape_date(os.path.join(photo_path, f))
	

def scrape_date(path):
	date = None
	i = Image.open(path)
	info = i._getexif()
	if info is not None:
		for tag, value in info.items():
			decoded = TAGS.get(tag, tag)
			if decoded == "DateTimeOriginal":
				date = value
	return date