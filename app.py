from flask import Flask, render_template, request, jsonify
from hugchat import hugchat
from hugchat.login import Login

# Start app
app = Flask(__name__)

# Log in to huggingface, grant authorization to huggingchat, try to find cookies and write them if needed
sign = Login('wiyksrsnouprasiqkl@cazlv.com', 'HugMe123!')
cookie_path_dir = "./cookies_snapshot"
try:
    cookies = sign.loadCookiesFromDir(cookie_path_dir)
except:
    cookies = sign.login()
    sign.saveCookiesToDir(cookie_path_dir)

# Create chatbot and start conversation
chatbot = hugchat.ChatBot(cookies=cookies.get_dict())
id = chatbot.new_conversation()
chatbot.change_conversation(id)

# Prompts for huggingchat
# For the first entry
prompt_start = '''I would like you to act as a professional therapist and help me journal more effectively. 
I will now give you the journal I'm writing, and I would like you to respond with a question or prompt that helps me reflect more deeply on what I just wrote. 
Please keep the tone simple and friendly, and keep your response to no more than 60 words long. Here is my journal: '''
# For any subsequent entry
prompt_later = '''I just added a new journal entry based on your previous prompt. 
Once again, I would like you to respond with a question or prompt that helps me reflect more deeply on what I just wrote. 
Please keep the tone simple and friendly, and it is importan that you keep your response to no more than 60 words. Here is my new entry: '''


# Default route
@app.route('/')
def home():
    return render_template('layout.html')

# Route to interact with huggingchat
@app.route('/get-prompt', methods=['GET', 'POST'])
def get_prompt():
    if request.json.get('entryNumber'):
        input = prompt_start + request.json.get('lastEntry')
    else: 
        input = prompt_later + request.json.get('lastEntry')
    output = chatbot.chat(input)
    # print('output.text', output["text"], type(output.text), type(output["text"]))
    return jsonify({'prompt': output['text']})

if __name__ == '__main__':
    app.run(debug=True)