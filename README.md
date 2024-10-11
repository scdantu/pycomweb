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
- Python 3.8 or higher
- Git
- PIP packages including flask for backend
    - Listed in pycomweb_backend/requirements.txt
- NPM packages for frontend including React 18
    - Listed in pycomweb_frontend/package.json

### Clone the repository
```
git clone git@github.com:scdantu/pycomweb.git
```

## Setting up Backend 
```
cd pycomweb/pycomweb_backend
```

### Create Virtual environment
#### For Mac/Linux
```
python3 -m venv ../pycomweb
source ../pycomweb/bin/activate
```

#### For Windows
```
py -3 -m venv .venv
```

## Install dependencies
```
pip3 install -r requirements.txt
```
> Note: If you do not want to run the requirements installer, you can manually install the pycom package by running:  
> _pip3 install git+https://github.com/scdantu/pycom_
>
> **Do not install** the pycom package at https://pypi.org/project/pycom/


## Setup Environment variables
```
export FLASK_APP=run.py
export FLASK_ENV=development
```
## Run The App
### run app in debug mode 
```
flask run --debug
```
### run app without debug mode
```
flask run
```

App will run at http://127.0.0.1:5000


## Setup PyComWeb Frontend

```
cd pycomweb_frontend 
npm install
```

To start the website
```
npm run dev
```
