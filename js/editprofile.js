function showSection(section){
    // اخفاء جميع الاقسام
    document.querySelectorAll('.content-section')
    .forEach(sec=>{
        sec.classList.remove('active-section');
    });

    // حذف active من جميع الازرار
    document.querySelectorAll('.menu-btn')
    .forEach(btn=>{
        btn.classList.remove('active');
    });

    // اظهار القسم المطلوب
    if(section === 'personal'){
        document
        .getElementById('personalSection')
        .classList.add('active-section');
        document
        .querySelectorAll('.menu-btn')[0]
        .classList.add('active');
    }

    if(section === 'security'){
        document
        .getElementById('securitySection')
        .classList.add('active-section');
        document
        .querySelectorAll('.menu-btn')[1]
        .classList.add('active');
    }
}
const imageInput =
document.getElementById("imageInput");
document
.querySelector(".edit-avatar")
.addEventListener("click",()=>{
    imageInput.click();
});

imageInput.addEventListener("change",(e)=>{
    const file=e.target.files[0];
    if(file){
        const reader=new FileReader();
        reader.onload=function(){
            document
            .getElementById("profileImage")
            .src=reader.result;
            document
            .getElementById("navbarUserImage")
            .src=reader.result;
        }
        reader.readAsDataURL(file);
    }
});

function logoutUser(){
    const confirmLogout =
    confirm(
      "Are you sure you want to log out?"
    );
    if(confirmLogout){
        window.location.href =
        "login.html";
    }
}
document
.querySelector(".remove-avatar")
.addEventListener("click",function(){
    const confirmDelete =
    confirm("Remove profile picture?");
    if(confirmDelete){
        document
        .getElementById("profileImage")
        .src = "image/User profile.svg";
     document
     .getElementById("navbarUserImage")
     .src = "image/User profile.svg";
    }

});

const reflections=[
"Indeed, Allah is with the patient.",
"My Lord, increase me in knowledge.",
"And rely upon Allah.",
"Indeed, prayer prohibits immorality.",
"So remember Me; I will remember you."
];

const randomReflection =
reflections[
Math.floor(
Math.random()*reflections.length
)];

document
.querySelector(".quote-card p")
.innerText=randomReflection;