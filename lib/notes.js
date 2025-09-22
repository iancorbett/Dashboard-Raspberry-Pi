import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data'); //process.cwd() = “current working directory”, DATA_DIR = a folder called data inside there.
const FILE = path.join(DATA_DIR, 'notes.json'); //FILE = data/notes.json inside that folder.

function ensure() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true }); //check if /data exists, if not, create it
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, JSON.stringify({ notes: [] }, null, 2)); //check if notes.json exists, if not then write a new file
}

function read() {
    ensure(); //ensure function runs to ensure files exist
    return JSON.parse(fs.readFileSync(FILE, 'utf8'));
  }

  function write(obj) {
    fs.writeFileSync(FILE, JSON.stringify(obj, null, 2));
  }

  export function listNotes() {
    return read().notes;
  }

  export function addNote(text) {
    const db = read(); // loads notes.json into memory
    const note = { id: Date.now().toString(36), text, created_at: new Date().toISOString() };
    db.notes.unshift(note); unshift(note) //adds it to the front of the list (so newest shows first)
    write(db); //saves back to disk
    return note;
  }
  export function deleteNote(id) {
    const db = read();// loads notes.json into memory
    const before = db.notes.length; //find amount of notes
    db.notes = db.notes.filter(n => n.id !== id); //makes a new array that excludes the note with the matching id
    write(db); //saves back to disk
    return db.notes.length < before;
  }