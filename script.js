// Inicializando o Flatpickr no campo de data
document.addEventListener("DOMContentLoaded", function() {
    flatpickr("#date-of-birth", {
        dateFormat: "d/m/Y",  // Formato de data dd/mm/aaaa
        maxDate: "today",  // Define a data máxima como hoje
        altInput: true,
        altFormat: "d/m/Y",  // Formato visível
        locale: "pt",        // Definindo o idioma como português
        onChange: function(selectedDates, dateStr, instance) {
            // Atualiza o campo oculto com o valor formatado corretamente
            document.getElementById('DateOfBirth__c').value = dateStr;
        }
    });
});


// Função para consultar o endereço via API do ViaCEP
function buscarCEP(cep) {
    // Remove qualquer caractere que não seja número
    cep = cep.replace(/\D/g, '');

    console.log("CEP buscado: " + cep);  // Log para verificar o CEP inserido

    // Verifica se o CEP tem o formato correto de 8 dígitos
    if (cep.length === 8) {
        // URL da API ViaCEP
        const url = `https://viacep.com.br/ws/${cep}/json/`;

        console.log("URL da API: " + url);  // Log para verificar a URL de consulta

        // Fazendo a requisição para a API ViaCEP
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log("Dados retornados da API: ", data);  // Log para verificar os dados retornados

                if (data.erro) {
                    alert("CEP não encontrado. Por favor, verifique e tente novamente.");
                    return;
                }

                // Preenche os campos do formulário com os dados retornados pela API ViaCEP
                document.getElementById('Street').value = data.logradouro || '';
                document.getElementById('City').value = data.localidade || '';
                document.getElementById('State').value = data.uf || '';
                document.getElementById('Country').value = "Brazil";  // Fixo como Brasil

                console.log("Endereço preenchido com sucesso!");  // Log para confirmar o preenchimento
            })
            .catch(error => {
                alert("Erro ao consultar o CEP. Tente novamente mais tarde.");
                console.error("Erro na consulta do CEP:", error);
            });
    } else {
        console.log("CEP incompleto ou inválido.");  // Log para verificar se o CEP está correto
    }
}

// Validação e formatação de telefone
function validarTelefone(mobile) {
    // Remove todos os espaços, hífens e parênteses
    let telefone = mobile.value.replace(/\D/g, '');

    // Verifica se o número tem o formato brasileiro de 11 dígitos (DDD + número)
    const regexBrasileiro = /^[1-9]{2}[9]{1}[0-9]{8}$/; // Exemplo: 11987654321
    const regexComCodigo = /^\+55[1-9]{2}[9]{1}[0-9]{8}$/; // Exemplo: +5511987654321

    if (regexComCodigo.test(telefone)) {
        // O número já está no formato correto com o código do país +55
        return true;
    } else if (regexBrasileiro.test(telefone)) {
        // O número está no formato brasileiro (sem +55), então adicionamos o código do país
        mobile.value = `+55${telefone}`;
        return true;
    } else {
        // O número está incorreto
        return false;
    }
}

/* // Função para formatar a data antes do envio
function beforeSubmit() {
    let datePicker = document.getElementById('date-of-birth');
    var hiddenDate = document.getElementById('DateOfBirth__c');
    
    if (datePicker.value) {
        // Converte a data no formato ISO (AAAA-MM-DD) para DD/MM/AAAA
        let dateValue = new Date(datePicker.value);
        let formattedDate = `${String(dateValue.getDate()).padStart(2, '0')}/${String(dateValue.getMonth() + 1).padStart(2, '0')}/${dateValue.getFullYear()}`;
        hiddenDate.value = formattedDate;
    }
    //let formattedDate = new Date(datePicker.value).toLocaleDateString('pt-BR');
    //hiddenDate.value = formattedDate; 
} */

// Função para capturar o parâmetro da URL
function getParameterByName(name) {
    const url = window.location.href; // Pega a URL completa da página atual
    const namePattern = name.replace(/[\[\]]/g, '\\$&'); // Trata o nome do parâmetro para garantir que caracteres especiais sejam escapados corretamente
    const regex = new RegExp('[?&]' + namePattern + '(=([^&#]*)|&|#|$)'); // Cria uma expressão regular para encontrar o parâmetro na URL
    const results = regex.exec(url); // Executa a expressão regular na URL para tentar encontrar o parâmetro
    if (!results) return null; // Se não encontrar o parâmetro, retorna 'null'
    if (!results[2]) return ''; // Se o parâmetro for encontrado, mas não tem valor, retorna uma string vazia
    return decodeURIComponent(results[2].replace(/\+/g, ' ')); // Decodifica o valor do parâmetro (caso tenha caracteres especiais ou espaços) e o retorna
}

// Evento de entrada de dados no campo CEP para buscar o endereço automaticamente
document.getElementById('postal_code').addEventListener('input', function() {
    const cep = this.value;  // Captura o valor digitado no campo de CEP
    buscarCEP(cep);  // Chama a função para buscar o endereço
});

// Evento de submissão do formulário para validar o telefone
document.getElementById('leadForm').addEventListener('submit', function (e) {
    const mobileField = document.getElementById('phone');

    // Se a validação falhar, exibe um alerta e impede o envio do formulário
    if (!validarTelefone(mobileField)) {
        e.preventDefault();
        alert('Por favor, insira um número de telefone válido no formato DDD + número. Exemplo: 11 98765-4321 ou +55 11 98765-4321.');
    }

    //beforeSubmit();
});

// Definir o valor do campo oculto com o parâmetro da URL "lead_source"
document.getElementById('lead_source').value = getParameterByName('lead_source');
