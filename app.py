from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('layout.html')

@app.route('/get-prompt', methods=['GET'])
def get_prompt():
    return 'hello'

if __name__ == '__main__':
    app.run(debug=True)