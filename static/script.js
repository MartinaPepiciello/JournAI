const journal = document.querySelector('.journal')

let journalEntries = [];

function addJournalEntry(placeholder) {
    let textarea = document.createElement('textarea');
    textarea.classList.add('journal-entry');
    textarea.placeholder = placeholder;
    textarea.setAttribute('oninput', 'autoGrow(this)');

    journal.appendChild(textarea);
}

function autoGrow(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

addJournalEntry('Start journaling...')