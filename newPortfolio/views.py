import os
import pandas as pd

from flask import render_template, url_for

from newPortfolio import app, db_util

@app.route('/')
def home():
	return render_template('home.html')

@app.route('/contact')
def contact():
	return render_template('contact.html')

@app.route('/art')
def art():
	num_photos = len(os.listdir("%s/photo" % app.static_folder))
	return render_template('art.html', num_photos=num_photos)

@app.route('/blog')
@app.route('/blog/<title>')
def blog(title=None):
	return render_template('blog.html', title=title)

@app.route('/engineering')
def engineering():
	return render_template('engineering.html')

@app.route('/resume')
def resume():
	return render_template('resume.html')

@app.route('/physarum')
def physarum():
	return render_template('physarum.html')

@app.route('/productivity')
def productivity():

	# Get and read csv
	csv_file = "%s/other/s6.csv" % app.static_folder
	s6 = pd.read_csv(csv_file)

	# Make a new df of the totals for each week (started on a Tuesday, hence the - 5)
	totals_ix = filter(lambda x: x % 8 - 5 == 0, range(len(s6.index)))
	totals = s6.iloc[totals_ix]
	# For totals: index = week
	totals.index = map(lambda x: x + 1, range(len(totals)))

	# Drop 'totals' rows from s6
	s6 = s6.drop(s6.index[totals_ix])
	s6.index = range(len(s6.index))

	# Add 'Week' column for sorting
	s6['Week'] = pd.Series(map(lambda x: (x+2)/7 + 1, range(len(s6.index))))

	# Replace NaNs with zeros
	totals = totals.fillna(0).drop('Unnamed: 0', axis=1).drop('Unnamed: 1', axis=1)
	totals = totals.T
	s6 = s6.fillna(0).rename(columns={'Unnamed: 0': 'Day', 'Unnamed: 1': 'Date'})

	return render_template('productivity.html', s6=s6.to_json(), totals=totals.to_json())