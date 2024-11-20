/* global app, token, webservice */

app.controller("ExtratoUtilizacoes", function($scope, $http) {
    $scope.webservice = webservice;
    $scope.webserviceBios = webserviceBios;

    $scope.environment = localStorage.getItem('environment');
    $scope.token = token;

    $scope.buscarExtrato = function() {
        const sRefI = $scope.dataI.split("/").join("");
        const sRefF = $scope.dataF.split("/").join("");
        if (sRefI.length !== 6 || sRefF.length !== 6) {
            return;
        }
        // Bloqueio
        // if (Number(sRefI) > 62023 || Number(sRefF) > 62023){ 
        //   return;
        // }
        const extratoVazioContainer = document.querySelectorAll(
            '[data-selector="extrato-vazio-container"]'
        );
        const extratoContainer = document.querySelectorAll(
            '[data-selector="extrato-container"]'
        );
        const imprimirBtn = document.querySelectorAll(
            '[data-selector="imprimir-button"]'
        );
        const loader = document.querySelectorAll("#loading");
        $scope.mudarDisplay(loader, 1);
        $scope.mudarDisplay(imprimirBtn, 0);
        $scope.mudarDisplay(extratoVazioContainer, 0);
        $scope.mudarDisplay(extratoContainer, 0);
        const codCopia = "W8";
        const sCodAssociado = localStorage.getItem("inscricao");
        const body = {
            coddao: 270,
            conteudo: null,
            parametros: [codCopia, sCodAssociado, sRefI, sRefF],
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
                    $scope.mudarDisplay(extratoVazioContainer, 1);
                    return;
                }
                $scope.extrato = response.data.conteudo;
                $scope.formatarUrl();
                $scope.mudarDisplay(loader, 0);
                $scope.mudarDisplay(imprimirBtn, 1);
                $scope.mudarDisplay(extratoContainer, 1);
            },
            function errorCallback(response) {
                $scope.mudarDisplay(loader, 0);
                $("#alertafalha").modal();
            }
        );
    };

    $scope.formatarUrl = function() {
        $scope.extrato = $scope.extrato.split(" ").join("&nbsp;");
        $scope.extrato = $scope.extrato.split("\n").join("<br>");
        var doc = document.getElementById("extrato");
        var doc2 = document.getElementById("extrato2");
        doc.innerHTML =
            '<p style="font-family: Courier New">' + $scope.extrato + "</p>";
        doc2.innerHTML =
            '<p style="font-family: Courier New">' + $scope.extrato + "</p>";
    };
    $scope.imprimir = function() {
        window.print();
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
});