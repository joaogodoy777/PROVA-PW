document.addEventListener('DOMContentLoaded', () => {
    
    const logoLink = document.getElementById('logoLink');
    const cadastroLink = document.getElementById('cadastroLink');
    const listaLink = document.getElementById('listaLink');

    
    const welcomeSection = document.getElementById('welcomeSection');
    const cadastrarVoluntarioBtn = document.getElementById('cadastrarVoluntarioBtn');
    const verListaBtn = document.getElementById('verListaBtn');

    
    const registerSection = document.getElementById('registerSection');
    const backToMenuFromRegisterBtn = document.getElementById('backToMenuFromRegisterBtn');
    const registerForm = document.getElementById('registerForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const cepInput = document.getElementById('cep');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const cepError = document.getElementById('cepError');
    const registerSuccessMessage = document.getElementById('registerSuccessMessage');

   
    const listSection = document.getElementById('listSection');
    const backToMenuFromListBtn = document.getElementById('backToMenuFromListBtn');
    const volunteersCardsContainer = document.getElementById('volunteersCardsContainer'); 
    const noVolunteersMessage = document.getElementById('noVolunteersMessage');

   

    function showWelcomeSection() {
        console.log("Mostrando seção de boas-vindas.");
        welcomeSection.style.display = 'block';
        registerSection.style.display = 'none';
        listSection.style.display = 'none';
    }

    function showRegisterForm() {
        console.log("Mostrando formulário de cadastro.");
        welcomeSection.style.display = 'none';
        registerSection.style.display = 'block';
        listSection.style.display = 'none';
        
        nameError.textContent = '';
        emailError.textContent = '';
        cepError.textContent = '';
        registerSuccessMessage.textContent = '';
        registerForm.reset(); 
    }

    function showListSection() {
        console.log("Mostrando seção de lista de voluntários.");
        welcomeSection.style.display = 'none';
        registerSection.style.display = 'none';
        listSection.style.display = 'block';
        loadVolunteersCards(); 
    }

   

    if (logoLink) logoLink.addEventListener('click', showWelcomeSection);
    if (cadastroLink) cadastroLink.addEventListener('click', showRegisterForm);
    if (listaLink) listaLink.addEventListener('click', showListSection);

    if (cadastrarVoluntarioBtn) cadastrarVoluntarioBtn.addEventListener('click', showRegisterForm);
    if (verListaBtn) verListaBtn.addEventListener('click', showListSection);

    if (backToMenuFromRegisterBtn) backToMenuFromRegisterBtn.addEventListener('click', showWelcomeSection);
    if (backToMenuFromListBtn) backToMenuFromListBtn.addEventListener('click', showWelcomeSection);

    

    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            console.log("Formulário de cadastro submetido.");

            let isValid = true;

            nameError.textContent = '';
            emailError.textContent = '';
            cepError.textContent = '';
            registerSuccessMessage.textContent = '';

            const nameValue = nameInput.value.trim();
            const emailValue = emailInput.value.trim();
            let cepValue = cepInput.value.trim().replace(/\D/g, '');

            let address = {}; 
           
            if (nameValue === '') {
                nameError.textContent = 'O nome é obrigatório.';
                isValid = false;
            } else if (nameValue.length < 3) {
                nameError.textContent = 'O nome deve ter pelo menos 3 caracteres.';
                isValid = false;
            }

           
            if (emailValue === '') {
                emailError.textContent = 'O email é obrigatório.';
                isValid = false;
            } else if (!validateEmail(emailValue)) {
                emailError.textContent = 'Por favor, insira um email válido.';
                isValid = false;
            }

          
            if (cepValue === '') {
                cepError.textContent = 'O CEP é obrigatório.';
                isValid = false;
            } else if (cepValue.length !== 8) {
                cepError.textContent = 'O CEP deve conter 8 dígitos.';
                isValid = false;
            } else {
                try {
                    console.log(`Consultando CEP: ${cepValue}`);
                    const response = await fetch(`https://viacep.com.br/ws/${cepValue}/json/`);
                    const data = await response.json();
                    console.log("Resposta da ViaCEP:", data);

                    if (data.erro) {
                        cepError.textContent = 'CEP inválido. Por favor, verifique.';
                        isValid = false;
                    } else {
                        address = {
                            logradouro: data.logradouro,
                            bairro: data.bairro,
                            localidade: data.localidade, 
                            uf: data.uf 
                        };
                        console.log("Endereço obtido:", address);
                    }
                } catch (error) {
                    console.error('Erro ao consultar CEP:', error);
                    cepError.textContent = 'Erro ao validar CEP. Tente novamente.';
                    isValid = false;
                }
            }

            if (isValid) {
                let users = JSON.parse(localStorage.getItem('users')) || [];
                console.log("Usuários existentes no localStorage antes do novo cadastro:", users);

                
                const userExists = users.some(user => user.email === emailValue);

                if (userExists) {
                    registerSuccessMessage.textContent = 'Este email já está cadastrado.';
                    console.log("Email já cadastrado.");
                } else {
                    const newUser = { 
                        name: nameValue, 
                        email: emailValue, 
                        cep: cepValue,
                        address: address, 
                        photoUrl: generateRandomAvatar(nameValue) 
                    };
                    users.push(newUser);
                    localStorage.setItem('users', JSON.stringify(users));
                    console.log("Novo usuário cadastrado e salvo:", newUser);
                    console.log("LocalStorage após o cadastro:", localStorage.getItem('users'));

                    registerSuccessMessage.textContent = 'Cadastro realizado com sucesso!';
                    registerForm.reset();
                    
                    setTimeout(() => {
                        showWelcomeSection();
                    }, 2000);
                }
            } else {
                console.log("Validação do formulário falhou.");
            }
        });
    }

   

    function loadVolunteersCards() {
        console.log("Carregando cards de voluntários...");
        volunteersCardsContainer.innerHTML = ''; 
        const users = JSON.parse(localStorage.getItem('users')) || [];
        console.log("Usuários recuperados do localStorage:", users);

        if (users.length === 0) {
            console.log("Nenhum voluntário cadastrado.");
            noVolunteersMessage.style.display = 'block'; 
            volunteersCardsContainer.style.display = 'none'; 
        } else {
            console.log(`${users.length} voluntário(s) encontrado(s).`);
            noVolunteersMessage.style.display = 'none'; 
            volunteersCardsContainer.style.display = 'grid'; 

            users.forEach(user => {
                const card = document.createElement('div');
                card.classList.add('volunteer-card');
                card.dataset.email = user.email; 

                
                const photo = document.createElement('img');
                photo.src = user.photoUrl; 
                photo.alt = `Foto de ${user.name}`;
                photo.classList.add('volunteer-photo'); 
                const name = document.createElement('h3');
                name.textContent = user.name;

                const email = document.createElement('p');
                email.textContent = `Email: ${user.email}`;

                const address = document.createElement('p');
                
                const fullAddress = user.address && user.address.logradouro
                    ? `${user.address.logradouro}, ${user.address.bairro} - ${user.address.localidade}/${user.address.uf} - ${formatCep(user.cep)}`
                    : `CEP: ${formatCep(user.cep)} (Endereço completo não disponível)`; 
                address.textContent = `Endereço: ${fullAddress}`;
                address.classList.add('volunteer-address');

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Excluir';
                deleteButton.classList.add('delete-button');
                deleteButton.addEventListener('click', () => {
                    deleteVolunteer(user.email);
                });

                card.appendChild(photo); 
                card.appendChild(name);
                card.appendChild(email);
                card.appendChild(address);
                card.appendChild(deleteButton);

                volunteersCardsContainer.appendChild(card);
                console.log(`Card para ${user.name} criado com foto e botão de exclusão.`);
            });
        }
    }

    /**
     * Função para excluir um voluntário do localStorage e recarregar a lista.
     * @param {string} emailToDelete - O email do voluntário a ser excluído.
     */
    function deleteVolunteer(emailToDelete) {
        console.log(`Tentando excluir voluntário com email: ${emailToDelete}`);
        let users = JSON.parse(localStorage.getItem('users')) || [];
        
        
        const updatedUsers = users.filter(user => user.email !== emailToDelete);

        if (updatedUsers.length < users.length) {
            
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            console.log(`Voluntário com email ${emailToDelete} excluído com sucesso.`);
            loadVolunteersCards(); 
        } else {
            console.log(`Voluntário com email ${emailToDelete} não encontrado.`);
        }
    }

   

    /**
     * Valida o formato de um email.
     * @param {string} email - O email a ser validado.
     * @returns {boolean} - True se o email for válido, false caso contrário.
     */
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    
    function formatCep(cep) {
        if (cep && cep.length === 8) {
            return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
        }
        return cep;
    }

    
     
    function generateRandomAvatar(seed) {
        const safeSeed = encodeURIComponent(seed || 'voluntario'); 
        return `https://api.dicebear.com/8.x/avataaars/svg?seed=${safeSeed}`;
    }

    
    showWelcomeSection();
});