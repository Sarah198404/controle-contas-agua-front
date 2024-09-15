$(document).ready(function() {
    console.log("Scripts e jQuery carregados corretamente!");

    loadContas();
    loadLojas();

    
    $('#formLoja').on('submit', handleLojaSubmit);
    $('#formConta').on('submit', handleContaSubmit);
});
