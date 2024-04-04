from hugchat import hugchat
from hugchat.login import Login

# Log in to huggingface and grant authorization to huggingchat
sign = Login('wiyksrsnouprasiqkl@cazlv.com', 'HugMe123!')
cookie_path_dir = "./cookies_snapshot"

# OLD COOKIE LOADING
# try:
#     cookies = sign.loadCookiesFromDir(cookie_path_dir) # This will detect if the JSON file exists, return cookies if it does and raise an Exception if it's not.
# except:
#     cookies = sign.login()
#     sign.saveCookiesToDir(cookie_path_dir)

# NEW COOKIE LOADING
cookies = sign.login(save_cookies=True)


# Create a ChatBot
chatbot = hugchat.ChatBot(cookies=cookies.get_dict())  # or cookie_path="usercookies/<email>.json"

'''# non stream response
query_result = chatbot.query("What is the surface area of the usa?")
print(query_result) # or query_result.text or query_result["text"]'''





# New a conversation (ignore error)
id = chatbot.new_conversation()
chatbot.change_conversation(id)

# Intro message
print('[[ Welcome to ChatPAL. Let\'s talk! ]]')
print('\'q\' or \'quit\' to exit')
print('\'c\' or \'change\' to change conversation')
print('\'n\' or \'new\' to start a new conversation')

while True:
	user_input = input('> ')
	if user_input.lower() == '':
		pass
	elif user_input.lower() in ['q', 'quit']:
		break
	elif user_input.lower() in ['c', 'change']:
		print('Choose a conversation to switch to:')
		print(chatbot.get_conversation_list())
	elif user_input.lower() in ['n', 'new']:
		print('Clean slate!')
		id = chatbot.new_conversation()
		chatbot.change_conversation(id)
	else:
		print(chatbot.chat(user_input))