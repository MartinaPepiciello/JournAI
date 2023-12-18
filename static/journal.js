// Main journaling area
const journal = document.querySelector('.journal');

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
submitReflectBtn.className = 'my-btn spaced';
submitReflectBtn.textContent = 'Submit & Reflect more';
submitReflectBtn.disabled = true;

const submitFinishBtn = document.createElement('button');
submitFinishBtn.className = 'my-btn accent spaced';
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
    textarea.setAttribute('oninput', 'growCheck(this)');
    journalEntries.push(textarea);
    wrapper.appendChild(textarea);

    // Create button to edit entry (now hidden and disabled)
    const editBtnRow = document.createElement('div');
    editBtnRow.className = 'btn-row align-right hidden';
    const editBtn = document.createElement('button');
    editBtn.className = 'my-btn accent small';
    editBtn.textContent = 'Edit'
    editBtn.disabled = true;
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
        btn.className = 'my-btn spaced';
        saveBtnsRow.appendChild(btn);
    })
    saveBtnsGroup[2].classList.add('accent')
    saveBtns.push(saveBtnsRow);
    wrapper.appendChild(saveBtnsRow);

    // Add wrapper and submit buttons to journal container
    journal.appendChild(wrapper);
    submitReflectBtn.disabled = true;
    journal.appendChild(submitBtnRow);
}


// Grow entry as the user types more text and check for empty entry
function growCheck(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';

    currentIndex = journalEntries.indexOf(textarea);
    if (textarea.value.trim() === '') {
        saveBtns[currentIndex].children[0].disabled = true;
        saveBtns[currentIndex].children[1].disabled = true;
        if (entryBackup === '') {
            submitReflectBtn.disabled = true;
        }
    } else {
        saveBtns[currentIndex].children[0].disabled = false;
        saveBtns[currentIndex].children[1].disabled = false;
        if (entryBackup === '') {
            submitReflectBtn.disabled = false;
        }
    }
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
        body: JSON.stringify({lastEntry: journalEntries[currentIndex].value, entryNumber: (edit ? -1 : journalEntries.length)})
    })
    .then(response => response.json())
    .then(data => {
        prompt.innerHTML = data.prompt;
        prompts.push(prompt);
        addJournalEntry('Continue journaling...')
        editBtns[currentIndex].children[0].disabled = false;
    })
    .catch(error => console.error('Error:', error));

}


// Actions when Edit is clicked
function editEntry() {
    // Exit if another edit is in progress
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


// Actions when Submit & Finish is clicked
const downloadModal = document.querySelector('#formatSelectorModal');
submitFinishBtn.addEventListener('click', () => downloadModal.classList.add('show'));


// Close buttons actions
const modals = Array.from(document.querySelectorAll('.modal'));
const closeModalBtns = Array.from(document.querySelectorAll('.close-modal, .close'));
closeModalBtns.forEach(btn => btn.addEventListener('click', closeModals));
function closeModals () {
    modals.forEach(m => m.classList.remove('show'))
}


// Download button actions
const allowedFormats = ['pdf', 'docx', 'txt'];
const downloadBtn = document.querySelector('#download');
const radioInputs = Array.from(document.getElementsByClassName('form-check-input'));
const journalTitleInput = document.querySelector('#journal-title');
downloadBtn.addEventListener('click', download);

function download() {
    // Get and validate file format
    let format = '';
    radioInputs.forEach(function (input) {
        if (input.checked) {
            format = input.value;
            return;
        }
    })
    if (!allowedFormats.includes(format)) {
        return;
    }

    // Prepare prompts and entries arrays
    const journalEntriesText = Array.from(journalEntries).map(entry => entry.value);
    const promptsText = Array.from(prompts).map(prompt => prompt.innerHTML);

    journalTitle = journalTitleInput.value.trim()

    // Request to process text
    fetch('/download', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({format: format, title: journalTitle, entries: journalEntriesText, prompts: promptsText})
    })
    .then(response => response.blob())
    .then(blob => {
        // Create a Blob object and generate a URL
        const fileURL = URL.createObjectURL(blob);
    
        // Create an anchor element to trigger the download
        const a = document.createElement('a');
        a.href = fileURL;
        a.download = (journalTitle ? journalTitle : 'journal') + '.' + format; // Set the filename
        a.click();
    
        // Clean up by revoking the object URL
        URL.revokeObjectURL(fileURL);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


// Download + New session button actions
const downloadRefreshBtn = document.querySelector('#download-refresh');
downloadRefreshBtn.addEventListener('click', function () {
    download();
    setTimeout(() => location.reload(), 2000);
})


// Make all links open in a new tab to avoid losing journaling sessions
const links = Array.from(document.querySelectorAll('a'));
links.forEach(link => link.setAttribute('target', '_blank'));



addJournalEntry('Start journaling...');