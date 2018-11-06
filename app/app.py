from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route("/dashboard")
def dashboard():
    return render_template('dashboard.html')

@app.route("/chart2")
def chart2():
    return render_template('chart2.html')

@app.route("/chart3")
def chart3():
    return render_template('chart3.html')