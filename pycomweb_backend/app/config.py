import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'a_secret_key'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///site.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Define the base directory
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))

    # Upload folder configuration
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')

    # API base URL configuration
    BASE_URL = os.environ.get('BASE_URL') or 'http://localhost:5000'

    #Pycom API URL
    PYCOM_API_URL = os.environ.get('PYCOM_API_URL')
    if PYCOM_API_URL is None:
        raise ValueError("PYCOM_API_URL environment variable is not set")


# Ensure the uploads directory exists
if not os.path.exists(Config.UPLOAD_FOLDER):
    os.makedirs(Config.UPLOAD_FOLDER)