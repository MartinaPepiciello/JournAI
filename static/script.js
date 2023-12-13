// Main journaling area
const journal = document.querySelector('.journal')

// Lists to store user entries and generated prompts
let journalEntries = [];
let prompts = [];

// Buttons to submit entry and reflect more or finish journaling
let submitReflectBtn = document.createElement('button');
submitReflectBtn.classList.add('reflect-btn');
submitReflectBtn.textContent = 'Submit & Reflect more';

let submitFinishBtn = document.createElement('button');
submitFinishBtn.classList.add('reflect-btn');
submitFinishBtn.textContent = 'Submit & Finish';

let btnRow = document.createElement('div');
btnRow.classList.add('row');
let btnContainers = [document.createElement('div'), document.createElement('div')];
btnContainers.forEach(function (container) {
    container.className = 'col-sm-6 d-flex justify-content-center';
    btnRow.appendChild(container);
})
btnContainers[0].appendChild(submitReflectBtn);
btnContainers[1].appendChild(submitFinishBtn);


// Function to add a new journal entry
function addJournalEntry(placeholder) {
    let textarea = document.createElement('textarea');
    textarea.classList.add('journal-entry');
    textarea.placeholder = placeholder;
    textarea.autofocus = true;
    textarea.setAttribute('oninput', 'autoGrow(this)');
    journalEntries.push(textarea);

    journal.appendChild(textarea);
    journal.appendChild(btnRow);
}

// Function to make the entry text area grow as the user types more text
function autoGrow(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

// Actions when Submit & Reflect is clicked
submitReflectBtn.addEventListener('click', submitReflect);
function submitReflect() {
    journal.removeChild(btnRow);

    journalEntries[journalEntries.length - 1].disabled = true;

    let prompt = document.createElement('div');
    prompt.classList.add('prompt');
    prompt.innerHTML = 'This is a test';
    prompts.push(prompt);

    journal.appendChild(prompt);

    addJournalEntry('Continue journaling...')
}


addJournalEntry('Start journaling...');