from app import create_app

app = create_app()

if app == '__main__':
    app.run(debug = True)