document.getElementById('forgotPasswordForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    alert("Reset link has been sent to your email!");
    
    // توجيه المستخدم لصفحة تسجيل الدخول بعد الإرسال مثلاً
     window.location.href = "login.html";
});