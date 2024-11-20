/* global app, endereco, token, webservice */

app.controller("AlterarEndereco", function($scope, $http) {
    $scope.webservice = webservice;
    $scope.webserviceBios = webserviceBios;
    $scope.environment = localStorage.getItem('environment')
    $scope.objEndereco = {
        alterar: null,
        bairro: null,
        cep: null,
        cidade: null,
        codbairro: null,
        codcidade: null,
        codpessoa: null,
        complemento: null,
        descricao: null,
        latitude: null,
        logradouro: null,
        longitude: null,
        numero: null,
        sequencia: null,
        tipoendereco: null,
        uf: null
    };
    $scope.token = token;

    $scope.buscaEndereco = function() {
        const usuario = localStorage.getItem('inscricao');
        const senha = localStorage.getItem('senha');
        const body = {
            coddao: 514,
            parametros: ["W8", usuario, senha]
        }
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            data: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(function successCallback(response) {
            if (response.data.conteudo.length > 0) {
                $scope.objEndereco = response.data.conteudo[0].lstenderecopessoa[0];
                console.log($scope.objEndereco)
            }
        }, function errorCallback(erro) {
            console.log(erro)
        });
    }
    $scope.buscaEndereco();

    $scope.getBuscaCep = function() {
        document.getElementById('loading').style.display = "block";
        $http({
            method: 'GET',
            url: 'https://viacep.com.br/ws/' + $scope.objEndereco.cep + '/json/'
        }).then(function successCallback(response) {
            $scope.objEndereco.logradouro = response.data.logradouro;
            $scope.objEndereco.bairro = response.data.bairro;
            $scope.objEndereco.localidade = response.data.localidade;
            $scope.objEndereco.uf = response.data.uf;
            $scope.objEndereco.ibge = null;
            $scope.objEndereco.complemento = null;
            document.getElementById('loading').style.display = "none";
        }, function errorCallback(response) {
            $scope.lstVO0478 = [];
            document.getElementById('loading').style.display = "none";
            $("#alertafalha").modal();
        });
    };

    // $scope.changeAddress = function() {
    //   const body = {
    //     coddao: 285,
    //     parametros: ["W8"],
    //     // conteudo: 
    //   }
    // }

    $scope.cadEndereco = function() {
        const body = {
            coddao: 285,
            conteudo: $scope.objEndereco,
            parametros: ["W8"]
        }
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            data: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(function successCallback(response) {
            if (response.data.conteudo) {
                $("#alertaSuccess").modal();
                $("#myModal").modal('toggle');
            } else {
                $("#alertaEndereco").modal();
            }
        }, function errorCallback(response) {
            $("#alertaFalha").modal();
        });
    };

    $scope.alerta = {
        "acao": null,
        "codigo": null,
        "icone": null,
        "link": null,
        "mensagem": null,
        "tipo": null,
        "titulo": null,
        "urllink": null
    };

    alertas = function(cod) {
        if (cod != "0") {
            $scope.alerta.codigo = cod;
            $scope.alerta.mensagem = 'Endereço alterado com sucesso!';
            $scope.alerta.titulo = 'Sucesso';
        } else {
            $scope.alerta.codigo = cod;
            $scope.alerta.mensagem = 'Não foi possível alterar o endereço!';
            $scope.alerta.titulo = 'Erro';
            $scope.alerta.acao = 'Tente novamente mais tarde. Caso o erro persista, entre em ';
            $scope.alerta.link = 'contato.';
            $scope.alerta.urllink = 'contato';
        }
        $("#alertaEndereco").modal();
    };
});