/* global google, app, webservice */

app.controller("Contato", function($scope, $http) {
    $scope.webservice = webservice;
    $scope.webserviceBios = webserviceBios;

    $scope.environment = localStorage.getItem('environment');
    $scope.objVO0398 = {
        "assunto": null,
        "codcopia": null,
        "codsite": null,
        "email": null,
        "empresa": null,
        "mensagem": null,
        "nome": null,
        "origem": null,
        "telefone": null
    };

    $scope.lstAssuntos = [{
            "assunto": "Reclamação"
        },
        {
            "assunto": "Sugestão"
        },
        {
            "assunto": "Informação"
        },
        {
            "assunto": "Elogio"
        },
        {
            "assunto": "Denúncia"
        }
    ];

    $scope.gravarContato = function() {
        $scope.objVO0398.codcopia = 8;
        $scope.objVO0398.origem = document.getElementById('codorigem').value;
        const body = {
            coddao: 302,
            conteudo: $scope.objVO0398,
            parametros: ["W8"]
        }
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            data: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }).then(function successCallback(response) {
            $scope.alerta(response.data.conteudo);
        }, function errorCallback(response) {
            $scope.alerta(0);
        });
    };

    $scope.newsletter = "";

    $scope.gravarNewsLetter = function() {
        const body = {
            coddao: 316,
            parametros: ["W8", $scope.newsletter]
        }
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            data: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }).then(function successCallback(response) {
            $("#alertaNewsLetterS").modal();
            $scope.newsletter = "";
        }, function errorCallback(response) {
            $scope.newsletter = "";
        });
    };

    $scope.alerta = function(cod) {
        if (cod > 0) {
            $scope.alerta.mensagem = 'Contato enviado com sucesso!';
            $scope.alerta.complemento = null;
            $scope.alerta.titulo = 'Sucesso';
        } else {
            $scope.alerta.mensagem = "Não foi possível efetuar a consulta.";
            $scope.alerta.complemento = "Tente novamente mais tarde!";
            $scope.alerta.titulo = "Erro";
        }
        $("#alerta").modal();
    };
});