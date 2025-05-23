import os
from flask import Flask
from .config import Config, ProductionConfig, StagingConfig, DevelopmentConfig
from .routes import register_blueprints
from flask_cors import CORS

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    CORS(app)

    #load default configuration from config class
    app.config.from_object(Config)

    # load environment-specific configurations
    env = os.getenv('FLASK_ENV', 'development')

    print(env)

    if env == 'production':
        app.config.from_object(config.ProductionConfig)
    elif env == 'staging':
        app.config.from_object(config.StagingConfig)
    else:  # Default to development
        app.config.from_object(config.DevelopmentConfig)


    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # Register blueprints
    register_blueprints(app)

    # Define the show_config route
    @app.route('/config')
    def show_config():
        # Access the app's config safely
        return {key: str(value) for key, value in app.config.items()}

    return app