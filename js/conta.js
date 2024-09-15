function loadContas() {
    $.ajax({
        url: 'http://localhost:3000/api/contas',
        method: 'GET',
        success: function(data) {
            const contasTableBody = $('#contasTableBody');
            contasTableBody.empty(); // Limpa a tabela antes de adicionar novos dados
            data.forEach(conta => {

                const valorFormatado = (typeof conta.valor === 'number' && !isNaN(conta.valor))
                ? conta.valor.toFixed(2)
                : '0.00';

                const mesRefFormatado = conta.mesRef.toString().slice(-2);

                const row = `
                    <tr>
                        <td>${conta.fornecimento}</td>
                        <td>${conta.rgi}</td>
                        <td>${conta.hidrometro}</td>
                        <td>${mesRefFormatado}</td>
                        <td>${conta.consumoM3}</td>
                        <td>${valorFormatado}</td>
                        <td>${new Date(conta.dtVencimento).toLocaleDateString()}</td>
                        <td>${new Date(conta.dtProximaLeitura).toLocaleDateString()}</td>
                        <td>${conta.nmLoja}</td>
                        <td>${conta.cnpj}</td>
                        <td>${conta.regional}</td>
                    </tr>
                `;
                contasTableBody.append(row);
            });
        },
        error: function(error) {
            console.error('Erro ao carregar contas:', error);
            alert('Erro ao carregar as contas.');
        }
    });
}

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
            $('#modalConta').modal('hide');
            loadContas();
        },
        error: function(error) {
            console.error('Erro ao cadastrar conta:', error);
            alert('Erro ao cadastrar a conta.');
        }
    });
}
