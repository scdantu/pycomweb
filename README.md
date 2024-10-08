# Instructions to Setup PyComWeb Backend

## Project Structure
```
.
|── __pycache__/         # Compiled Python files (ignored by Git)
|── app/                 # Application folder (contains Flask app logic)
|   ├── __init__.py      # Initializes the Flask app
|   ├── config.py        # Application routes
|   └── routes/          # Folder containing different routes file.
|   └── uploads/         # Folder containing different routes file.
|
|── .env                 # Environment variables
|── .flaskenv            # Flask environment configuration file
|── .gitignore           # Git ignore file
|── requirements.txt     # Python dependencies
└── run.py               # Script to run the Flask application
```

## Prerequisites
Python 3.7 or higher
Flask installed
Git installed

## Clone the repository
https://github.com/scdantu/pycomweb.git
cd pycomweb/pycomweb_backend

## Create Virtual environment
### For Mac/Linux
python3 -m venv venv
source venv/bin/activate

### For Windows
py -3 -m venv .venv

## Install dependencies
pip install -r requirements.txt

## Setup Environment variables
FLASK_APP=run.py
FLASK_ENV=development

## Run The App
### run app in debug mode 
flask run --debug

### run app without debug mode
flask run

App will run at http://127.0.0.1:5000


# Instructions to Setup PyComWeb Frontend
cd pycomweb_frontend 
Open terminal and type npm install


