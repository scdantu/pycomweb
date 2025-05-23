import os

class Config:
    DEBUG = False
    TESTING = False
    API_PREFIX = 'pycomweb_api'
    # Define the base directory
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))

    # Upload folder configuration
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')

    # API base URL configuration
    BASE_URL = os.environ.get('BASE_URL') or 'http://localhost:5000'

    #Pycom API URL
    PYCOM_API_URL = os.environ.get('PYCOM_API_URL') or 'https://pycom.brunel.ac.uk/api/'
    if PYCOM_API_URL is None:
        raise ValueError("PYCOM_API_URL environment variable is not set")
    
class DevelopmentConfig(Config):
    DEBUG = True
    API_PREFIX = 'pycomweb_api'

class ProductionConfig(Config):
    API_PREFIX = 'pycomweb_api'

class StagingConfig(Config):
    TESTING = True
    API_PREFIX = 'pycomwebdev_api'


# Ensure the uploads directory exists
if not os.path.exists(Config.UPLOAD_FOLDER):
    os.makedirs(Config.UPLOAD_FOLDER)