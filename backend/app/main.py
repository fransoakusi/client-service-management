from app import create_app

app = create_app()


@app.route("/")
def home():
    return "<h1>Welcome to the Client Service Management System</h1><p>This is the backend server.</p>"

if __name__ == '__main__':
    app.run(debug=True, port=5001)

 
 