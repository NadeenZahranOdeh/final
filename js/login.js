
document.addEventListener('DOMContentLoaded', () => {
    const togglePassword = document.querySelector('#togglePassword');
    const passwordInput = document.querySelector('#passwordInput');

    togglePassword.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // تغيير شكل الأيقونة (اختياري إذا كان لديك صورتين مختلفتين)
        this.style.opacity = type === 'text' ? '1' : '0.7';
    });

});