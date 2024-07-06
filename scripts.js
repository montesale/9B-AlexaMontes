document.addEventListener('DOMContentLoaded', function() {
    const loginCard = document.getElementById('login-card');
    const registerCard = document.getElementById('register-card');
    const forgotPasswordCard = document.getElementById('forgot-password-card');
    const changePasswordCard = document.getElementById('change-password-card');

    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const registerLink = document.getElementById('register-link');
    const backToLoginLink = document.querySelectorAll('#back-to-login-link, #back-to-login-link-from-forgot');

    const MIN_PASSWORD_LENGTH = 8;

    function validateEmail(email) {
        return email.includes('@');
    }

    function validatePassword(password) {
        return password.length >= MIN_PASSWORD_LENGTH;
    }

    function addInvalidFeedback(element, message) {
        element.classList.add('is-invalid');
        element.nextElementSibling.textContent = message;
    }

    function removeInvalidFeedback(element) {
        element.classList.remove('is-invalid');
        element.nextElementSibling.textContent = '';
    }

    // Mostrar formulario de registro
    registerLink.addEventListener('click', function() {
        loginCard.classList.add('d-none');
        registerCard.classList.remove('d-none');
        forgotPasswordCard.classList.add('d-none');
        changePasswordCard.classList.add('d-none');
    });

    // Mostrar formulario de recuperación de contraseña
    forgotPasswordLink.addEventListener('click', function() {
        loginCard.classList.add('d-none');
        registerCard.classList.add('d-none');
        forgotPasswordCard.classList.remove('d-none');
        changePasswordCard.classList.add('d-none');
    });

    // Volver al formulario de inicio de sesión
    backToLoginLink.forEach(link => {
        link.addEventListener('click', function() {
            loginCard.classList.remove('d-none');
            registerCard.classList.add('d-none');
            forgotPasswordCard.classList.add('d-none');
            changePasswordCard.classList.add('d-none');
        });
    });

    // Validación en tiempo real para el formulario de inicio de sesión
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('input', function(event) {
        const target = event.target;
        removeInvalidFeedback(target);

        if (target.id === 'login-email' && !validateEmail(target.value)) {
            addInvalidFeedback(target, 'El correo electrónico debe contener un @.');
        }
        
        if (target.id === 'login-password' && !validatePassword(target.value)) {
            addInvalidFeedback(target, `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
        }
    });

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        if (!loginForm.checkValidity()) {
            event.stopPropagation();
            Array.from(loginForm.elements).forEach(element => {
                if (!element.checkValidity()) {
                    element.classList.add('is-invalid');
                }
            });
        } else {
            const storedPassword = localStorage.getItem(email);
            if (storedPassword === password) {
                document.getElementById('login-message').textContent = 'Inicio de sesión exitoso.';
                document.getElementById('login-message').classList.add('text-success');
                loginCard.classList.add('animate-welcome');
                setTimeout(() => {
                loginCard.innerHTML = `
                    <h3 class="text-center">¡Bienvenido!</h3>
                    <img src="Bienvenida.png" alt="Imagen de bienvenida" class="img-fluid">
                 `;

                }, 1000);
            } else {
                document.getElementById('login-message').textContent = 'Correo electrónico o contraseña incorrectos.';
                document.getElementById('login-message').classList.add('text-danger');
            }
        }
        loginForm.classList.add('was-validated');
    });

    // Validación en tiempo real para el formulario de registro
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('input', function(event) {
        const target = event.target;
        removeInvalidFeedback(target);

        if (target.id === 'register-email' && !validateEmail(target.value)) {
            addInvalidFeedback(target, 'El correo electrónico debe contener un @.');
        }

        if (target.id === 'register-password' && !validatePassword(target.value)) {
            addInvalidFeedback(target, `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
        }

        if (target.id === 'register-confirm-password') {
            const password = document.getElementById('register-password').value;
            const confirmPassword = target.value;
            if (password !== confirmPassword) {
                addInvalidFeedback(target, 'Las contraseñas no coinciden.');
            } else {
                removeInvalidFeedback(target);
            }
        }
    });

    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;

        if (!registerForm.checkValidity() || password !== confirmPassword) {
            event.stopPropagation();
            Array.from(registerForm.elements).forEach(element => {
                if (!element.checkValidity()) {
                    element.classList.add('is-invalid');
                }
            });
        } else {
            const email = document.getElementById('register-email').value;
            localStorage.setItem(email, password);
            document.getElementById('register-message').textContent = 'Registro exitoso.';
            document.getElementById('register-message').classList.add('text-success');
            registerCard.classList.add('animate-register');
        }
        registerForm.classList.add('was-validated');
    });

    // Validación en tiempo real para el formulario de recuperación de contraseña
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    forgotPasswordForm.addEventListener('input', function(event) {
        const target = event.target;
        removeInvalidFeedback(target);

        if (target.id === 'forgot-password-email' && !validateEmail(target.value)) {
            addInvalidFeedback(target, 'El correo electrónico debe contener un @.');
        }
    });

    forgotPasswordForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('forgot-password-email').value;
        if (!forgotPasswordForm.checkValidity()) {
            event.stopPropagation();
            Array.from(forgotPasswordForm.elements).forEach(element => {
                if (!element.checkValidity()) {
                    element.classList.add('is-invalid');
                }
            });
        } else {
            if (localStorage.getItem(email)) {
                document.getElementById('forgot-password-message').innerHTML = `
                    Se ha enviado un enlace de recuperación a tu correo electrónico.<br>
                    <a href="#" id="change-password-link">Cambiar Contraseña</a>
                `;
                document.getElementById('forgot-password-message').classList.add('text-success');
                
                document.getElementById('change-password-link').addEventListener('click', function() {
                    forgotPasswordCard.classList.add('d-none');
                    changePasswordCard.classList.remove('d-none');
                });
            } else {
                document.getElementById('forgot-password-message').textContent = 'Correo electrónico no registrado.';
                document.getElementById('forgot-password-message').classList.add('text-danger');
            }
        }
        forgotPasswordForm.classList.add('was-validated');
    });

    // Validación en tiempo real para el formulario de cambio de contraseña
    const changePasswordForm = document.getElementById('change-password-form');
    changePasswordForm.addEventListener('input', function(event) {
        const target = event.target;
        removeInvalidFeedback(target);

        if (target.id === 'confirm-new-password') {
            const newPassword = document.getElementById('new-password').value;
            const confirmNewPassword = target.value;
            if (newPassword !== confirmNewPassword) {
                addInvalidFeedback(target, 'Las contraseñas no coinciden.');
            } else {
                removeInvalidFeedback(target);
            }
        }

        if (target.id === 'new-password' && !validatePassword(target.value)) {
            addInvalidFeedback(target, `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
        }
    });

    changePasswordForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const newPassword = document.getElementById('new-password').value;
        const confirmNewPassword = document.getElementById('confirm-new-password').value;
        const email = document.getElementById('forgot-password-email').value;
        if (!changePasswordForm.checkValidity() || newPassword !== confirmNewPassword) {
            event.stopPropagation();
            Array.from(changePasswordForm.elements).forEach(element => {
                if (!element.checkValidity()) {
                    element.classList.add('is-invalid');
                }
            });
        } else {
            localStorage.setItem(email, newPassword);
            document.getElementById('change-password-message').textContent = 'Contraseña cambiada exitosamente.';
            document.getElementById('change-password-message').classList.add('text-success');
            setTimeout(function() {
                changePasswordCard.classList.add('d-none');
                loginCard.classList.remove('d-none');
            }, 2000); // Redirigir al inicio de sesión después de 2 segundos
        }
        changePasswordForm.classList.add('was-validated');
    });
});
