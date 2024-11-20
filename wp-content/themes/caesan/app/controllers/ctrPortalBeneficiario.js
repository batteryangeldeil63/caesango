/* global app, webservice, token, inscricao, senha */

app.controller("ctrPortalBeneficiario", function($scope, $http) {
    $scope.webservice = webservice;
    $scope.webserviceBios = webserviceBios;

    $scope.environment = localStorage.getItem('environment');
    $scope.inscricao = inscricao;
    $scope.senha = senha;
    $scope.token = token;

    var data = new Date();
    var mes = String(data.getMonth() + 1).padStart(2, "0");
    var ano = data.getFullYear();
    $scope.refInicial = mes + "" + ano;
    $scope.refFinal = $scope.refInicial;

    $scope.buscarExtrato = function() {
        // const sRefI = $scope.dataI.split("/").join("");
        // const sRefF = $scope.dataF.split("/").join("");
        // if (sRefI.length !== 6 || sRefF.length !== 6) {
        //   return;
        // }
        const loader = document.querySelectorAll("#loading");
        $scope.mudarDisplay(loader, 1);
        const codCopia = "W8";
        const sCodAssociado = localStorage.getItem("inscricao");
        const body = {
            coddao: 270,
            conteudo: null,
            parametros: [codCopia, sCodAssociado, $scope.refInicial, $scope.refFinal],
            hash: null,
        };
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            headers: {
                "Content-Type": "application/json;charset=utf-8;",
            },
            data: JSON.stringify(body),
        }).then(
            function successCallback(response) {
                const {
                    conteudo
                } = response.data;
                if (!conteudo) {
                    $scope.mudarDisplay(loader, 0);
                    return;
                }
                $scope.extrato = response.data.conteudo;
                $scope.formatarUrl();
                $scope.mudarDisplay(loader, 0);
            },
            function errorCallback(response) {
                $scope.mudarDisplay(loader, 0);
                $("#alertafalha").modal();
            }
        );
    };

    $scope.mudarDisplay = function(lstElementos, state) {
        lstElementos.forEach((elemento) => {
            switch (state) {
                case 0:
                    elemento.style.display = "none";
                    break;
                case 1:
                    elemento.style.display = "unset";
                    break;
            }
        });
    };

    $scope.formatarUrl = function() {
        $scope.extrato = $scope.extrato.split(" ").join("&nbsp;");
        $scope.extrato = $scope.extrato.split("\n").join("<br>");
        var doc = document.getElementById("extrato");
        doc.innerHTML =
            '<p style="font-family: Courier New">' + $scope.extrato + "</p>";
    };
    $scope.buscarExtrato();

    $scope.alertaOpen = function() {
        $("#alerta").modal();
    };

    $scope.alertaOpen();

    $scope.alertaClose = function() {
        $("#alerta").modal('hide');
    };
});