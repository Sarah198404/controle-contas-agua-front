// carrega lista conta
function loadContas() {
    $.ajax({
        url: 'http://localhost:3000/api/contas',
        method: 'GET',
        success: function(data) {
            console.log("Dados recebidos da API:", data);
            const contasTableBody = $('#contasTableBody');
            contasTableBody.empty();
            data.forEach(conta => {
                const valorFormatado = formatarExibicaoValor(conta.valor);
                const mesRefFormatado = conta.mesRef.toString().slice(-2);
                
                let rowClass = '';
                if (conta.consumoM3 > 35) {
                    rowClass = 'table-danger';
                } else if (conta.consumoM3 > 25) {
                    rowClass = 'table-warning';
                }
                const row = `
                    <tr class="${rowClass}">
                        <td>${conta.fornecimento}</td>
                        <td>${conta.rgi}</td>
                        <td>${conta.hidrometro}</td>
                        <td>${mesRefFormatado}</td>
                        <td>${conta.consumoM3}</td>
                        <td>${valorFormatado}</td>
                        <td>${new Date(conta.dtVencimento).toLocaleDateString()}</td>
                        <td>${new Date(conta.dtProximaLeitura).toLocaleDateString()}</td>
                        <td>
                            <button class="btn btn-link p-0 loja-btn" data-loja-cnpj="${conta.cnpj}" data-bs-toggle="modal" data-bs-target="#resumoModal">
                                ${conta.nmLoja}
                            </button>
                        </td>
                        <td>${conta.cnpj}</td>
                        <td>${conta.regional}</td>
                    </tr>
                `;
                contasTableBody.append(row);
            });

            $('.loja-btn').on('click', function () {
                const lojaCnpj = $(this).data('loja-cnpj');
                const lojaNome = $(this).text();
                mostraResumo(lojaCnpj, lojaNome);
            });

            $('#sortDateBtn').on('click', sortContasByReadingDate);
            $('#sortVencimentoBtn').on('click', sortContasByDueDate);
        },
        error: function(error) {
            console.error('Erro ao carregar contas:', error);
            alert('Erro ao carregar as contas.');
        }
    });
}

// Validação do form loja
(function () {
    'use strict';

    window.addEventListener('load', function () {
        const form = document.getElementById('formLoja');
        const submitButton = form.querySelector('button[type="submit"]');
        const fields = form.querySelectorAll('input');
        submitButton.disabled = true;

        
        function validateField(field) {
            if (!field.checkValidity()) {
                field.classList.add('is-invalid');
            } else {
                field.classList.remove('is-invalid');
                field.classList.add('is-valid');
            }
        }

        function validateForm() {
            if (form.checkValidity()) {
                submitButton.disabled = false;
            } else {
                submitButton.disabled = true;
            }
        }

        fields.forEach(field => {
            field.addEventListener('blur', function () {
                validateField(field);
                validateForm();             });
        });

        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }

            form.classList.add('was-validated');
        }, false);
    }, false);
})();

// Validação do form conta
(function () {
    'use strict';

    window.addEventListener('load', function () {
        const form = document.getElementById('formConta');
        const submitButton = form.querySelector('button[type="submit"]');
        const fields = form.querySelectorAll('input');
        submitButton.disabled = true;

        function validateField(field) {
            if (!field.checkValidity()) {
                field.classList.add('is-invalid'); 
            } else {
                field.classList.remove('is-invalid');
                field.classList.add('is-valid'); 
            }
        }
       
        function validateForm() {
            if (form.checkValidity()) {
                submitButton.disabled = false; 
            } else {
                submitButton.disabled = true; 
            }
        }

        fields.forEach(field => {
            field.addEventListener('blur', function () {
                validateField(field);
                validateForm(); 
            });
        });

        form.addEventListener('submit', function (event) {
            
            if (!form.checkValidity()) {
                event.preventDefault(); 
                event.stopPropagation();
            }

            form.classList.add('was-validated');
        }, false);
    }, false);
})();

function handleContaSubmit(event) {
    event.preventDefault();
    const contaData = {
        loja_id: $('#lojaSelect').val(),
        fornecimento: $('#fornecimento').val(),
        rgi: $('#rgi').val(),
        hidrometro: $('#hidrometro').val(),
        mesRef: $('#mesRef').val(),
        consumoM3: $('#consumoM3').val(),
        valor: parseFloat($('#valor').val()),
        dtVencimento: $('#dtVencimento').val(),
        dtProximaLeitura: $('#dtProximaLeitura').val()
    };

    $.ajax({
        url: 'http://localhost:3000/api/contas',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(contaData),
        success: function() {
            alert('Conta cadastrada com sucesso!');
            const form = document.getElementById('formConta');
            form.reset();
            form.classList.remove('was-validated');

            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;

            const fields = form.querySelectorAll('input');
            fields.forEach(field => {
                field.classList.remove('is-valid');
                field.classList.remove('is-invalid');
            });
            $('#modalConta').modal('hide');
            
            loadContas();
        },
        error: function(error) {
            console.error('Erro ao cadastrar conta:', error);
            alert('Erro ao cadastrar a conta.');
        }
    });
}

// formatação ao campo de valor
function formatarValor(valor) {
    valor = valor.replace(/\D/g, "");
    valor = (valor / 100).toFixed(2) + "";
    valor = valor.replace(".", ",");
    valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return valor;
}


const valorInput = document.getElementById('valor');
valorInput.addEventListener('input', function () {
    let valorFormatado = formatarValor(this.value);
    this.value = valorFormatado;
});

document.getElementById('formConta').addEventListener('submit', function (event) {
    const valorInput = document.getElementById('valor');
    valorInput.value = limparFormato(valorInput.value);    
});

function limparFormato(valor) {
    valor = valor.replace(/\./g, "");
    valor = valor.replace(",", ".");
    return parseFloat(valor); 
}

function formatarExibicaoValor(valor) {
    let numero = parseFloat(valor);
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
// 


// ordenacoes
let ascendingVencimento = true; 
let ascendingLeitura = true;    


function sortContasByDueDate() {
    const contasTableBody = $('#contasTableBody');
    const rows = contasTableBody.find('tr').get(); 

    rows.sort((a, b) => {
        const dateA = parseDate($(a).find('td:nth-child(7)').text());
        const dateB = parseDate($(b).find('td:nth-child(7)').text());

        if (ascendingVencimento) {
            return dateA - dateB; // Ordenação ascendente
        } else {
            return dateB - dateA; // Ordenação descendente
        }
    });

    ascendingVencimento = !ascendingVencimento;
    
    $.each(rows, function(index, row) {
        contasTableBody.append(row); 
    });
}


function sortContasByReadingDate() {
    const contasTableBody = $('#contasTableBody');
    const rows = contasTableBody.find('tr').get(); 

    rows.sort((a, b) => {
        const dateA = parseDate($(a).find('td:nth-child(8)').text()); 
        const dateB = parseDate($(b).find('td:nth-child(8)').text());
        
        if (ascendingLeitura) {
            return dateA - dateB; // Ordenação ascendente
        } else {
            return dateB - dateA; // Ordenação descendente
        }
    });

    ascendingLeitura = !ascendingLeitura;

    $.each(rows, function(index, row) {
        contasTableBody.append(row); 
    });
}

function parseDate(dateString) {
    const parts = dateString.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day); 
}
// 

// resumo anual
function mostraResumo(lojaCnpj, lojaNome) {
    console.log("lojaCnpj " + lojaCnpj)
    const rows = $('#contasTableBody tr').toArray();
    let totalConsumo = 0;
    let totalValor = 0;

    console.log("Loja clicada:", lojaCnpj, lojaNome);

    rows.forEach(row => {
        const cells = $(row).find('td');
        const currentLojaCnpj = $(row).find('.loja-btn').data('loja-cnpj');

        console.log("CNPJ da linha:", currentLojaCnpj);

        if (currentLojaCnpj === lojaCnpj) {
            console.log("Linha correspondente encontrada!");

            const consumo = parseInt(cells.eq(4).text()) || 0; 
            const valorTexto = cells.eq(5).text();
            const valor = parseFloat(valorTexto.replace('R$', '').replace('.', '').replace(',', '.')) || 0;

            console.log("Consumo:", consumo, "Valor:", valor);

            totalConsumo += consumo;
            totalValor += valor;
        }
    });

    console.log("Consumo total:", totalConsumo, "Valor total:", totalValor);

    $('#resumoModalLabel').text(`Resumo da Loja: ${lojaNome}`);
    $('#consumoTotal').text(`${totalConsumo} m³`);
    $('#valorTotal').text(`R$ ${totalValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
}

