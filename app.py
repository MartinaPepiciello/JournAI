from flask import Flask, render_template, request, jsonify, send_file
from hugchat import hugchat
from hugchat.login import Login
from write_files import write_docx, write_pdf, write_txt

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
Please keep the tone simple and friendly, and it is important that you keep your response to no more than 60 words. Here is my new entry: '''
# For any editing an entry
prompt_edit = '''I just modified a previous journal entry I wrote. Please, let's start fresh from there. 
I will now give you the modified entry, and I would like you to respond with a question or prompt that helps me reflect more deeply on what I just wrote. 
Please keep the tone simple and friendly, and it is important that you keep your response to no more than 60 words. Here is my edited entry: '''


# Default route
@app.route('/')
def index():
    return render_template('index.html')


# About route
@app.route('/about')
def about():
    return render_template('about.html')


# Route to interact with huggingchat
@app.route('/get-prompt', methods=['GET', 'POST'])
def get_prompt():
    if request.json.get('entryNumber') == '1':
        input = prompt_start + request.json.get('lastEntry')
    elif request.json.get('entryNumber') == '-1':
        input = prompt_edit + request.json.get('lastEntry')
    else: 
        input = prompt_later + request.json.get('lastEntry')
    output = chatbot.chat(input)
    return jsonify({'prompt': output['text']})


@app.route('/download', methods=['GET', 'POST'])
def download():
    format = request.json.get('format')
    title = request.json.get('title')
    entries = request.json.get('entries', [])
    prompts = request.json.get('prompts', [])
    download_name = (title if title else 'journal') + '.' + format

    if format == 'pdf':
        return send_file(write_pdf(title, entries, prompts), as_attachment=True, mimetype='application/pdf', download_name=download_name)
    elif format == 'docx':
        return send_file(write_docx(title, entries, prompts), as_attachment=True, download_name=download_name)
    elif format == 'txt':
        return send_file(write_txt(title, entries, prompts), as_attachment=True, mimetype='text/plain', download_name=download_name)
    
    return None


if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0')