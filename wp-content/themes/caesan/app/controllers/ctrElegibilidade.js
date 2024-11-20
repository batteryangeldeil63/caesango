/* global app, webservice, objVO0306 */

app.controller("Elegibilidade", function($scope, $http) {
    $scope.webservice = webservice;
    $scope.webserviceBios = webserviceBios;

    $scope.token = token;
    $scope.environment = localStorage.getItem('environment');
    $scope.cpfassociado;
    $scope.objVO0306 = null;
    $scope.alerta = {};
    $scope.environment = localStorage.getItem("environment");

    const validarInput = (tipoInput, conteudoInput) => {
        let inputValido = false;
        switch (tipoInput) {
            case "CPF":
                const cpfLimpo = conteudoInput.replaceAll(/[^\d]/g, ""); // Substitui todos os caracteres que não for numeros por vazio ""
                if (cpfLimpo.length === 11) inputValido = true;
                break;
        }
        return inputValido;
    };

    $scope.fecharModal = function(idModal) {
        $(`#${idModal}`).modal("hide");
    };

    $scope.buscacarencia = function() {
        const beneficiarioContainer = document.querySelectorAll(
            '[data-selector="beneficiario-container"]'
        );
        $scope.mudarDisplay(beneficiarioContainer, 0); // escondendo o container do beneficiario
        $scope.usuario = {}; // resetando o usuario
        $scope.cpfassociado = $scope.cpfassociado.replaceAll(/[^\d]/g, ""); // deixando apenas os numeros
        // validando cpf informado
        if (!validarInput("CPF", $scope.cpfassociado)) {
            $scope.alerta.titulo = "Campo CPF Inválido";
            $scope.alerta.acao = "Insira um CPF válido e tente novamente.";
            $scope.alerta.mensagem = "Exemplos:  12345678910 ou 123.456.789-10";
            $("#alertaErro").modal();
            return;
        }
        var hoje = new Date();
        var dia = hoje.getDate();
        var mes = hoje.getMonth() + 1;
        var ano = hoje.getFullYear();
        if (dia < 10) {
            dia = "0" + dia;
        }
        if (mes < 10) {
            mes = "0" + mes;
        }
        var dtatual = dia + "/" + mes + "/" + ano;
        var codusuario = $scope.objVO0306.codoperador;
        var bprestador = "N";
        if (codusuario == 0) {
            codusuario = $scope.objVO0306.codpessoa;
            bprestador = "S";
        }
        const body = {
            coddao: 551,
            parametros: ["W8", "", "", $scope.cpfassociado]
        }
        document.getElementById("loading").style.display = "block";
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(body),
        }).then(function successCallback(response) {
            document.getElementById('loading').style.display = "none";
            if (!response.data.conteudo.nombeneficiario) {
                $scope.usuario = null;
                $scope.mudarDisplay(beneficiarioContainer, 1);
                return; // Para execução se o usuario for null
            }
            $scope.usuario = response.data.conteudo;
            $scope.mudarDisplay(beneficiarioContainer, 1);
        }, function errorCallback(error) {
            document.getElementById("loading").style.display = "none";
        });
    }

    $scope.mudarDisplay = function(lstElementos, state) {
        lstElementos.forEach((elemento) => {
            if (state === 0) {
                elemento.style.display = "none";
            }
            if (state === 1) {
                elemento.style.display = "unset";
            }
        });
    };

    $scope.buscarUsuario = function() {
        const body = {
            "coddao": 517,
            "parametros": ["W8", $scope.token]
        }
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(body),
        }).then(
            function successCallback(response) {
                $scope.objVO0306 = response.data.conteudo;
            },
            function errorCallback(error) {
                console.log(error)
            }
        );
    }

    $scope.buscarUsuario();
});