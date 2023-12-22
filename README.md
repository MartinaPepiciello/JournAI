# JournAI - an AI-assisted journaling tool

#### Video Demo:  <URL HERE>

#### Link: https://journai.pythonanywhere.com/

## Introduction
JournAI is a journaling tool with an integrated AI assistant that helps users reflect more deeply about their thoughts and feelings. 

It is a web application built using Python, HTML, CSS and Javascript. In Python, Flask is used to define routes for the app, to connect with the Huggingface API and to write files the user can download. Javascripts handles users' interactions with the app and dynamically updates the page with the responses from the Huggingface API.

## User interface description
When users access the main page of the app, they are presented with a text box where they can start journaling about anything they want, as they normally would with any other medium.

When they have finished their entry, they can click the "Submit & Reflect more" button. This will call on the Huggingchat API to analyze the entry that was just submitted and provide a prompt or question that will help the user dive deeper into the topic they have just written about. The prompt might ask the user about their reasoning or motivations behind a certain decision, their feelings about an event, the goals they hope to achieve, etc.

A loading message appears while the prompt is being generated, then the propmt appears, followed by a new text box where the user can journal further following the prompt's directions (or about anything else they want). Once again, they can click on "Submit & Reflect more" to get another prompt for further reflection.

When an entry is submitted, the corresponding text box becomes disabled to avoid confusion between entries. At any point, the user can edit a submitted entry by clicking the "Edit" button below the text box: this will enable the text box and disable the last one the user was previously working on. After finishing editing, the user can choose to "Save & Preserve below" if they want to keep all the prompts that were generated and entries they wrote after the current text box. This option should be chosen for correcting typos or making minor changes. If major changes were made to the entry, the user can choose to "Save & Remove below", which will discard all the prompts that were generated and entries that were written after the current text box, generating a new prompt for the edited entry. Alternatively, if the user wants to cancel the edit they made, they can click on "Cancel": this will restore the entry at its state before "Edit" was clicked.

When the user is satisfied with their journaling, they can click on "Submit & Finish". This will trigger a popup modal where they can download their journaling session in either PDF, DOCX or TXT format. If they wish, they can also choose to add a title to their session, which will appear at the top of the document and as the file name. They can also choose to start a new journaling session right after downloading.

In the navigation bar, there is a link to an About page, which contains a summary of the features of the app, and a link to start a new entry. When the user is on the main journaling page, these links will open in a new tab to avoid losing the progress on the current page.
