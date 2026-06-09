let notes = [];

function toggleNotesDropdown(event) {
    event.preventDefault(); // يمنع الانتقال
    let dropdown = document.getElementById("notesDropdown");
    dropdown.classList.toggle("hidden");
}

function addNote() {
    let input = document.getElementById("noteInput");
    let text = input.value;

    if (text.trim() === "") return;

    notes.push(text);
    input.value = "";

    renderNotes();
}

function renderNotes() {
    let list = document.getElementById("notesList");
    list.innerHTML = "";

    notes.forEach(note => {
        let div = document.createElement("div");
        div.className = "note-item";
        div.textContent = note;
        list.appendChild(div);
    });
}
const feedbackBtn = document.getElementById("feedbackBtn");

const feedbackDropdown =
document.getElementById("feedbackDropdown");

const overlay =
document.getElementById("overlay");

const cancelBtn =
document.getElementById("cancelBtn");

/* OPEN DROPDOWN */

feedbackBtn.addEventListener("click", () => {

    feedbackDropdown.classList.add("active");

    overlay.classList.add("active");
});

/* CLOSE DROPDOWN */

cancelBtn.addEventListener("click", () => {

    feedbackDropdown.classList.remove("active");

    overlay.classList.remove("active");
});

/* CLOSE WHEN CLICKING OUTSIDE */

overlay.addEventListener("click", () => {

    feedbackDropdown.classList.remove("active");

    overlay.classList.remove("active");
});

/* THANK YOU POPUP */

const sendFeedbackBtn =
document.getElementById("sendFeedbackBtn");

const thankyouPopup =
document.getElementById("thankyouPopup");

const backHomeBtn =
document.getElementById("backHomeBtn");

sendFeedbackBtn.addEventListener("click", function(){

    /* hide feedback */

    feedbackDropdown.classList.remove("active");

    /* show thank popup */

    thankyouPopup.classList.add("active");

});

/* CLOSE EVERYTHING */

backHomeBtn.addEventListener("click", function(){

    thankyouPopup.classList.remove("active");

    overlay.classList.remove("active");

});