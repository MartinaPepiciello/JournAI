// Main journaling area
const journal = document.querySelector('.journal')

// Lists to store user entries, buttons and generated prompts
let entryWrappers = []; 
let journalEntries = [];
let editBtns = [];
let saveBtns = [];
let prompts = [''];

// Backup of journal entry currently being edited
let entryBackup = '';

// Buttons to submit entry and reflect more or finish journaling
const submitReflectBtn = document.createElement('button');
submitReflectBtn.classList.add('spaced-btn');
submitReflectBtn.textContent = 'Submit & Reflect more';

const submitFinishBtn = document.createElement('button');
submitFinishBtn.classList.add('spaced-btn');
submitFinishBtn.textContent = 'Submit & Finish';

const submitBtnRow = document.createElement('div');
submitBtnRow.classList.add('btn-row');
submitBtnRow.appendChild(submitReflectBtn);
submitBtnRow.appendChild(submitFinishBtn);

// Function to add a new journal entry
function addJournalEntry(placeholder) {
    // Wrapper for text area, edit buttons and save buttons
    const wrapper = document.createElement('div');
    entryWrappers.push(wrapper);

    // Create text area and add it to array and journal container
    const textarea = document.createElement('textarea');
    textarea.classList.add('journal-entry');
    textarea.placeholder = placeholder;
    textarea.autofocus = true;
    textarea.setAttribute('oninput', 'autoGrow(this)');
    journalEntries.push(textarea);
    wrapper.appendChild(textarea);

    // Create button to edit entry (now hidden)
    const editBtnRow = document.createElement('div');
    editBtnRow.className = 'btn-row align-right hidden';
    const editBtn = document.createElement('button');
    editBtn.classList.add('small-btn');
    editBtn.textContent = 'Edit'
    editBtn.addEventListener('click', editEntry);
    editBtns.push(editBtnRow);
    editBtnRow.appendChild(editBtn)
    wrapper.appendChild(editBtnRow);

    // Create buttons to save changes to entry (now hidden)
    const saveBtnsRow = document.createElement('div');
    saveBtnsRow.className = 'btn-row hidden';
    let saveBtnsGroup = [document.createElement('button'), document.createElement('button'), document.createElement('button')];
    saveBtnsGroup[0].textContent = 'Save & Preserve below';
    saveBtnsGroup[0].addEventListener('click', editSavePreserve);
    saveBtnsGroup[1].textContent = 'Save & Remove below';
    saveBtnsGroup[1].addEventListener('click', editSaveRemove);
    saveBtnsGroup[2].textContent = 'Cancel';
    saveBtnsGroup[2].addEventListener('click', editCancel);
    saveBtnsGroup.forEach(function(btn) {
        btn.classList.add('spaced-btn');
        saveBtnsRow.appendChild(btn);
    })
    saveBtns.push(saveBtnsRow);
    wrapper.appendChild(saveBtnsRow);

    // Add wrapper and submit buttons to journal container
    journal.appendChild(wrapper);
    journal.appendChild(submitBtnRow);
}

// Function to make the entry text area grow as the user types more text
function autoGrow(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

// Actions when Submit & Reflect is clicked
submitReflectBtn.addEventListener('click', submitReflect);
function submitReflect(edit=false) {
    // Exit if an edit is in progress
    if (entryBackup !== '') {
        return;
    }

    // Remove submit buttons
    journal.removeChild(submitBtnRow);

    const currentIndex = journalEntries.length - 1;

    // Disable previous text area
    journalEntries[currentIndex].disabled = true;

    // Show edit button for previous text area
    editBtns[currentIndex].classList.remove('hidden');

    // Add div for the prompt with loading message
    let prompt = document.createElement('div');
    prompt.classList.add('prompt');
    prompt.innerHTML = 'Loading your prompt...';
    journal.appendChild(prompt);

    // Get prompt from huggingchat
    fetch('/get-prompt', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({lastEntry: journalEntries[currentIndex].value, entryNumber: (edit? -1 : journalEntries.length)})
    })
    .then(response => response.json())
    .then(data => {
        prompt.innerHTML = data.prompt;
        prompts.push(prompt);
        addJournalEntry('Continue journaling...')
    })
    .catch(error => console.error('Error:', error));

}

// Actions when Edit is clicked
function editEntry() {
    // Exit if an edit is in progress
    if (entryBackup !== '') {
        return;
    }

    const lastIndex = journalEntries.length - 1;
    const currentBtnRow = this.parentNode;
    const currentIndex = editBtns.indexOf(currentBtnRow);

    // Save contents of current text area
    entryBackup = journalEntries[currentIndex].value;
    
    // Enable current text area
    journalEntries[currentIndex].disabled = false;

    // Hide current edit button
    currentBtnRow.classList.add('hidden')

    // Disable all edit buttons
    editBtns.forEach(function(row) {
        btn = row.children[0];
        btn.disabled = true;
    })

    // Show save buttons
    saveBtns[currentIndex].classList.remove('hidden');

    // Disable last text area
    journalEntries[lastIndex].disabled = true;

    // Disable submit buttons
    submitReflectBtn.disabled = true;
    submitFinishBtn.disabled = true;
}

// Actions when Save & Preserve below is clicked
function editSavePreserve() {
    const lastIndex = journalEntries.length - 1;
    const currentBtnRow = this.parentNode;
    const currentIndex = saveBtns.indexOf(currentBtnRow);

    // Clear entry backup
    entryBackup = '';

    // Disable current text area
    journalEntries[currentIndex].disabled = true;

    // Show current edit button
    editBtns[currentIndex].classList.remove('hidden');

    // Enable all edit buttons
    editBtns.forEach(function(row) {
        btn = row.children[0];
        btn.disabled = false;
    })

    // Hide save buttons
    currentBtnRow.classList.add('hidden');

    // Enable last text area
    journalEntries[lastIndex].disabled = false;

    // Enable submit buttons
    submitReflectBtn.disabled = false;
    submitFinishBtn.disabled = false;
}

// Actions when Save & Remove below is clicked
function editSaveRemove() {
    const lastIndex = journalEntries.length - 1;
    const currentBtnRow = this.parentNode;
    const currentIndex = saveBtns.indexOf(currentBtnRow);

    // Clear entry backup
    entryBackup = '';

    // Remove all entries below the current one
    for (let i = currentIndex + 1; i < entryWrappers.length; i++) {
        journal.removeChild(entryWrappers[i]);
        journal.removeChild(prompts[i]);
    }
    entryWrappers = entryWrappers.slice(0, currentIndex + 1); 
    journalEntries = journalEntries.slice(0, currentIndex + 1);
    editBtns = editBtns.slice(0, currentIndex + 1);
    saveBtns = saveBtns.slice(0, currentIndex + 1);
    prompts = prompts.slice(0, currentIndex + 1);

    // Enable all edit buttons
    editBtns.forEach(function(row) {
        btn = row.children[0];
        btn.disabled = false;
    })

    // Hide save buttons
    currentBtnRow.classList.add('hidden');

    // Enable submit buttons
    submitReflectBtn.disabled = false;
    submitFinishBtn.disabled = false;

    // Trigger the same actions as when a new entry is submitted
    submitReflect(true);
}

// Actions when Cancel is clicked
function editCancel() {
    const lastIndex = journalEntries.length - 1;
    const currentBtnRow = this.parentNode;
    const currentIndex = saveBtns.indexOf(currentBtnRow);

    // Restore contents of current text area and clear backup
    journalEntries[currentIndex].value = entryBackup;
    entryBackup = '';

    // Disable current text area
    journalEntries[currentIndex].disabled = true;

    // Show current edit button
    editBtns[currentIndex].classList.remove('hidden');

    // Enable all edit buttons
    editBtns.forEach(function(row) {
        btn = row.children[0];
        btn.disabled = false;
    })

    // Hide save buttons
    currentBtnRow.classList.add('hidden');

    // Enable last text area
    journalEntries[lastIndex].disabled = false;

    // Enable submit buttons
    submitReflectBtn.disabled = false;
    submitFinishBtn.disabled = false;
}


addJournalEntry('Start journaling...');