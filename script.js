document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');
    const successMessage = document.getElementById('successMessage');

    
   

   
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault(); 

            let isValid = true; 

            
            usernameError.textContent = '';
            passwordError.textContent = '';
            successMessage.textContent = '';

            const usernameValue = usernameInput.value.trim();
            const passwordValue = passwordInput.value.trim();

            
            if (usernameValue === '') {
                usernameError.textContent = 'O usuário é obrigatório.';
                isValid = false;
            }

            
            if (passwordValue === '') {
                passwordError.textContent = 'A senha é obrigatória.';
                isValid = false;
            }

           
            if (isValid) {
                const correctUsername = 'prova'; 
                if (usernameValue === correctUsername && passwordValue === correctPassword) {
                    successMessage.textContent = 'Login realizado com sucesso! Redirecionando...';
                    usernameInput.value = ''; 
                    passwordInput.value = '';

                   
                    setTimeout(() => {
                        window.location.href = 'menu.html'; 
                    }, 1500); 
                } else {
                    successMessage.textContent = 'Usuário ou senha inválidos. Tente novamente.';
                }
            }
        });
    }
});