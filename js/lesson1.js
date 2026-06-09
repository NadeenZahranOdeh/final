/* Notifications */

document
.querySelector(".notification-wrapper")
.addEventListener("click", () => {

    alert("You have 3 new notifications");

});

/* Next Lesson */

document
.getElementById("nextLessonBtn")
.addEventListener("click", () => {

    window.location.href =
    "lesson2.html";

});