function popup() {
    console.log("Popup function triggered");
    const popupNewNote = document.createElement("div");
    popupNewNote.innerHTML = `
        <div id="popupNewNote">
            <h2>Take Note</h2>
            <textarea id="note-body" placeholder="Write your thoughts..."></textarea>
            <div id="btn-newnote">
                <button id="btn-create" onclick="createNote()">Create</button>
                <button id="btn-close" onclick="closeNote()">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(popupNewNote);
}

function closeNote() {
    const popupNewNote = document.getElementById("popupNewNote");
    if (popupNewNote) {
        popupNewNote.remove();
    }
}

function createNote() {
    const popupNewNote = document.getElementById("popupNewNote");
    const noteBody = document.getElementById("note-body").value;
    
    if (noteBody.trim() !== "") {
        const note = { id: new Date().getTime(), text: noteBody };

        let writtenNotes = JSON.parse(localStorage.getItem("notes") || "[]");
        writtenNotes.unshift(note);  // 🛠 Add new notes at the beginning

        localStorage.setItem("notes", JSON.stringify(writtenNotes));

        document.getElementById("note-body").value = "";
        popupNewNote.remove();
        displayNotes();
    }
}


function displayNotes() {
    const notesList = document.getElementById("notes-list");
    notesList.innerHTML = "";

    const notes = JSON.parse(localStorage.getItem("notes")) || [];

    notes.forEach((note) => {
        const listItem = document.createElement("div");
        listItem.classList.add("notes-item");

        let formattedText = note.text
            .replace(/^### (.*$)/gm, "<h3>$1</h3>")  // ### Heading 3
            .replace(/^## (.*$)/gm, "<h2>$1</h2>")   // ## Heading 2
            .replace(/^# (.*$)/gm, "<h1>$1</h1>")    // # Heading 1
            .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")  // **Bold**
            .replace(/\*(.*?)\*/g, "<i>$1</i>")      // *Italic*
            .replace(/\n/g, "<br>");                 // New lines

        listItem.innerHTML = `
            <span>${formattedText}</span>
            <div id="btn-container">
                <button id="btn-edit" onclick="editNote(${note.id})"><i class="fa fa-pen"></i></button>
                <button id="btn-delete" onclick="deleteNote(${note.id})"><i class="fa fa-trash"></i></button>
            </div>
        `;
        notesList.appendChild(listItem);
    });
}


function editNote(noteId) {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const noteEdit = notes.find((note) => note.id == noteId);
    const noteText = noteEdit ? noteEdit.text : "";
    const popupEdit = document.createElement("div");

    popupEdit.innerHTML = `
        <div id="popupEdit" data-note-id="${noteId}">
            <h1>Edit Note</h1>
            <textarea id="note-body">${noteText}</textarea>
            <div id="btn-container">
                <button id="btn-create" onclick="updateNote()">Done</button>
                <button id="btn-close" onclick="closeEdit()">Close</button>
            </div>
        </div>
    `;

    document.body.appendChild(popupEdit);
}

function closeEdit() {
    const editNote = document.getElementById("popupEdit");
    if (editNote) {
        editNote.remove();
    }
}

function updateNote() {
    const noteBody = document.getElementById("note-body").value.trim();
    const editNote = document.getElementById("popupEdit");

    if (noteBody !== "") {
        const noteId = editNote.getAttribute("data-note-id");
        let notes = JSON.parse(localStorage.getItem("notes")) || [];

        const updatedNotes = notes.map((note) => {
            if (note.id == noteId) {
                return { id: note.id, text: noteBody };
            }
            return note;
        });

        localStorage.setItem("notes", JSON.stringify(updatedNotes));
        editNote.remove();
        displayNotes();
    }
}

function deleteNote(noteId) {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes = notes.filter((note) => note.id != noteId);

    localStorage.setItem("notes", JSON.stringify(notes));
    displayNotes();
}

displayNotes();
