def register_blueprints(app):
    from .proteins import proteins_bp
    from .scripts import scripts_bp
    from .coevolution_analysis import coevolution_bp
    
    app.register_blueprint(proteins_bp)
    app.register_blueprint(coevolution_bp)
    app.register_blueprint(scripts_bp)