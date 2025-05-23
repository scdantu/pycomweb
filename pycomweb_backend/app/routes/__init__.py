def register_blueprints(app):
    from .proteins import proteins_bp
    from .scripts import scripts_bp
    from .coevolution_analysis import coevolution_bp

    api_prefix  =  app.config.get('API_PREFIX', 'pycomweb_api')
    
    app.register_blueprint(proteins_bp, url_prefix=f"/{api_prefix}")
    app.register_blueprint(coevolution_bp, url_prefix=f"/{api_prefix}")
    app.register_blueprint(scripts_bp, url_prefix=f"/{api_prefix}")