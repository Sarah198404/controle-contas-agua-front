function loadLojas() {
    $.ajax({
        url: 'http://localhost:3000/api/lojas',
        method: 'GET',
        success: function(data) {
            const lojaSelect = $('#lojaSelect');
            lojaSelect.empty();
            data.forEach(loja => {
                lojaSelect.append(new Option(loja.nmLoja, loja.id));
            });
        },
        error: function(error) {
            console.error('Erro ao carregar lojas:', error);
            alert('Erro ao carregar as lojas.');
        }
    });
}

function handleLojaSubmit(event) {
    event.preventDefault();

    const lojaData = {
        nmLoja: $('#nmLoja').val(),
        cnpj: $('#cnpj').val(),
        regional: $('#regional').val()
    };

    $.ajax({
        url: 'http://localhost:3000/api/lojas',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(lojaData),
        success: function() {
            alert('Loja cadastrada com sucesso!');
            $('#modalLoja').modal('hide');
            loadLojas();
        },
        error: function(error) {
            console.error('Erro ao cadastrar loja:', error);
            alert('Erro ao cadastrar a loja.');
        }
    });
}
