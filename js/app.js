let notes = [];
let editingNoteId = null;

function saveNotes() {
  localStorage.setItem('quickNotes', JSON.stringify(notes));
}

function loadNotes() {
  const savedNotes = localStorage.getItem('quickNotes');
  return savedNotes ? JSON.parse(savedNotes) : [];
}

function deleteNote(noteId) {
  notes = notes.filter(note => note.id !== noteId);
  saveNotes();
  renderNotes();
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-theme');
  document.getElementById('themeToggleBtn').textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function applyStoredTheme() {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
    document.getElementById('themeToggleBtn').textContent = '☀️';
  }
}

function openNoteDialog(noteId = null) {
  const titleInput = document.getElementById('noteTitle');
  const contentInput = document.getElementById('noteContent');
  
  if (noteId) {
  	editingNoteId = noteId;
  	document.getElementById('dialogTitle').textContent = 'Edit Note';
    const noteToEdit = notes.find(note => note.id === noteId);
    titleInput.value = noteToEdit.title;
    contentInput.value = noteToEdit.content;
  } else {
  	editingNoteId = null;
    document.getElementById('dialogTitle').textContent = 'Add New Note';
    titleInput.value = '';
    contentInput.value = '';
  }

  document.getElementById('noteDialog').showModal();
  titleInput.focus();
}

function closeNoteDialog() {
  document.getElementById('noteDialog').close();
}

function saveNote(event) {
  event.preventDefault();

  const title = document.getElementById('noteTitle').value.trim();
  const content = document.getElementById('noteContent').value.trim();
  
  if (editingNoteId) {
    const note = notes.find(note => note.id === editingNoteId);
    note.title = title;
    note.content = content;
  } else {
    notes.unshift({
      id: Date.now().toString(),
      title: title,
      content: content
    });
  }

  closeNoteDialog();
  saveNotes()
  renderNotes();
}

function renderNotes() {
  const notesContainer = document.getElementById('notesContainer');

  if (notes.length === 0) {
    notesContainer.innerHTML = `
      <div class="empty-state">
        <h2>No notes yet</h2>
        <p>Create your first note to get started!</p>
      </div>
    `;
    return;
  }

  notesContainer.innerHTML = notes.map(note =>
  `
  	<div class="note-card">
      <h3 class="note-title">${note.title}</h3>
      <p class="note-content">${note.content}</p>
      <div class="note-actions">
        <button class="edit-btn" onclick="openNoteDialog('${note.id}')" title="Edit Note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
        </button>
        <button class="delete-btn" onclick="deleteNote('${note.id}')" title="Delete Note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.88c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>
          </svg>
        </button>
      </div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('noteDialog').addEventListener('click', function (event) {
    if (event.target === this) {
      closeNoteDialog();
    }
  });
  
  applyStoredTheme();
  notes = loadNotes();
  renderNotes();

  document.getElementById('noteForm').addEventListener('submit', saveNote);
});