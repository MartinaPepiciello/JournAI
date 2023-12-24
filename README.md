# JournAI - an AI-assisted journaling tool

#### Video Demo: https://youtu.be/vimItStOqB0/

#### Link: https://journai.pythonanywhere.com/

## Introduction
JournAI is a journaling tool with an integrated AI assistant that helps users reflect more deeply about their thoughts and feelings. 

It is a web application built using Python for the backend, and HTML, CSS and Javascript for the frontend. In Python, Flask is used to define routes for the app, to connect with the Huggingface API and to write files the user can download. Javascripts handles users' interactions with the app and dynamically updates the page with the responses from the Huggingface API.

## User interface description
When users access the main page of the app, they are presented with a text box where they can start journaling about anything they want, as they normally would with any other medium.

When they have finished their entry, they can click the "Submit & Reflect more" button. This will call on the Huggingchat API to analyze the entry that was just submitted and provide a prompt or question that will help the user dive deeper into the topic they have just written about. The prompt might ask the user about their reasoning or motivations behind a decision, their feelings about an event, the goals they hope to achieve, etc.

A loading message appears while the prompt is being generated, then the propmt appears, followed by a new text box where the user can journal further following the prompt's directions (or about anything else they want). Once again, they can click on "Submit & Reflect more" to get another prompt for further reflection.

When an entry is submitted, the corresponding text box becomes disabled to avoid confusion between entries. At any point, the user can edit a submitted entry by clicking the "Edit" button below the text box: this will enable the text box and disable the last one the user was previously working on. After finishing editing, the user can choose to "Save & Preserve below" if they want to keep all the prompts that were generated and entries they wrote after the current text box. This option should be chosen for correcting typos or making minor changes. If major changes were made to the entry, the user can choose to "Save & Remove below", which will discard all the prompts that were generated and entries that were written after the current text box, generating a new prompt for the edited entry. Alternatively, if the user wants to cancel the edit they made, they can click on "Cancel": this will restore the entry at its state before "Edit" was clicked.

When the user is satisfied with their journaling, they can click on "Submit & Finish". This will trigger a popup modal where they can download their journaling session in either PDF, DOCX or TXT format. If they wish, they can also choose to add a title to their session, which will appear at the top of the document and as the file name. They can also choose to start a new journaling session right after downloading.

In the navigation bar, there is a link to an About page, which contains a summary of the features of the app, and a link to start a new entry. When the user is on the main journaling page, these links will open in a new tab if they have entered any text, to avoid losing their progress on the current page.

## Program files description
### app.py
This is the main Python file where the Flask app and its routes are defined.

First, we log in to the Huggingchat interface (and save some cookies if necessary), then we start a conversation with the Huggingchat chatbot.

Then, the app's routes are defined.
- For the main route, we simply render index.html. It will be dynamically updated via Javascript.
- About is a static page, so we simply render about.html.
- The *get-prompt* route is used to call the Huggingchat API and get the prompt from it. First, we extract from the Json request that was sent from Javascript the user's last entry, as well as if it was the first entry, an edit to a previous entry, or another normal entry. Depending on this, the chatbot receives a few slightly differentiated introductory lines that ask it for a prompt to help the user reflect, followed by the user's entry. Finally, the chatbot's response is sent back to Javascript in Json format.
- The *download* route is used to generate downloadable files for the user, containing their entries and the AI-generated prompts. First, we extract from the Json that was sent from Javascript the file format, file title, journal entries and prompts. Then, according to which format was selected, one of the helper functions *write_pdf*, *write_docx* and *write_txt* (defined in *write_files.py*) is called. These return a BytesIO object that stores the file, which is then sent back to Javascript.

### write_files.py
In this helper file we define three functions that create pfd, docx and txt files from the user's entries and prompts.

For the pdf format, we use the Reportlab library. We first create a canvas and define paragraph styles for the title, prompts and entries. Then, we write the file paragraph by paragraph using the *add_pdf_paragraphs* function (a new paragraph is created in journal entries whenever the user added a new line). For this library, we need to manually check if there is enough space in the current page to write a new paragraph, and then update the x and y coordinates of the cursor so that paragraphs appear one below the other.

For the docx format, we use the Python-docx library. We use a similar approach for writing the file paragraph by paragraph with the *add_docx_paragraphs* function, although in this case we don't need to check for the space on the page.

The txt format is the easiest: here, we just concatenate the title, entries and prompts while adding some spacing.

### templates/layout.html
This is the web app's HTML template, which includes the navigation bar and the page's white body on a gradient background. There are three custom blocks: one for the body's content, one for popup modals and one for scripts.

### templates/index.html
This file contains the custom blocks for the app's main page. The main body block is empty because it will be filled using Javascript. The modals block contains the modal that allows users to download their files. Finally, the script modal contains a link to the *journal.js* file.

### templates/about.html
This files contains the custom blocks for the About page. The main block contains the text that summarizes the app's usage and features. There are no scripts or modals for this page, so the remaining two custom blocks are empty.

### static/journal.js
This file contains the script that is used to dynamically update the app's main page when the user interacts with it.

After creating a few variables to store the objects that will appear on the page, the first function that we define is the one to add a new text area where the user can type their entry. The text area automatically grows as the user types more lines. Along with the text area, we also add the corresponding buttons to edit it, save the edits and preserve below, save the edits and discard below, and cancel the edits. These buttons, however, are hidden when the text area is added. Finally, the buttons for submitting are added. The Submit & Reflect more button is disabled if the text area is empty.

Next, we define the behavior when Submit & Reflect more is clicked. First, we hide the submit buttons, disable the previous text area, show the edit button (although it is momentarily disabled) and show a loading message while the prompt is being generated. Then, we send a fetch request to the *get-prompt* route using the post method, sending the latest entry and whether it was the first, an edit or a regular entry. After we get a response from Python, we replace the loading message with the AI-generated prompt and enable the edit button.

We then define the behavior when any edit button is clicked. First, we save the current contents of the text area in question in a backup variable; whether or not this variable is empty is also used in other parts of the code to check if an edit is in progress. We also enable the text area in question while disabling the last one the user was working on, to avoid confusion. We then show the save or cancel buttons for this entry and disable all other edit buttons, as well as the submit buttons.

When Save & preserve below is clicked, we undo all that was done when edit was clicked, and we clear the variable that held the backup for the entry's contents.

When Save & remove below is clicked, after clearing the backup variable, we remove all prompts and entries below the current entry. Then we hide the save buttons while enabling the submit buttons and the remaining edit buttons. Finally, we call the same function for submitting and reflecting more, which will generate a new prompt based on the edited entry.

When Cancel is clicked, we just restore the entry's original contents using the backup variable and undo all the actions that were taken when Edit was clicked.

Next, we define the behavior for submitting the final entry and downloading the file. When Submit & Finish is clicked, a modal appears prompting the user to select a download format and, optionally, type a title for their journaling session. When Download is clicked, all entries and prompts are retrieved and sent to the backend through a fetch request. Then, when the response is received, the download is initiated. If the user chooses to download and start a new entry, the page is refreshed 2 seconds after the button was clicked. If, on the other hand, the user closes the modal, they will be able to continue journaling as before.

Finally, to avoid the loss of content if the user clicks on any link on the page, we make all the links open in a new tab if any text has been typed in a text area.

The last line in the file initializes a new journaling session by making the first text area appear.

### static/styles.css
This file just contains the CSS code to style all the app.