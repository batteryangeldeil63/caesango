/* global app, lstdeclaracoesIR, webservice */

app.controller("DeclaracaoIR", function($scope, $http) {
    $scope.webservice = webservice;
    $scope.webserviceBios = webserviceBios;

    $scope.environment = localStorage.getItem('environment');
    $scope.inscricao = localStorage.getItem('inscricao');
    $scope.lstdeclaracoesIR = [];
    $scope.anobase = '';

    $scope.buscaDeclaracoesIR = function() {
        const body = {
            coddao: 567,
            parametros: ["W8", $scope.inscricao]
        }
        document.getElementById("loading").style.display = "block";
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(body)
        }).then(
            function successCallback(response) {
                document.getElementById("loading").style.display = "none";
                $scope.lstdeclaracoesIR = response.data.conteudo;
            },
            function errorCallback(error) {
                document.getElementById("loading").style.display = "none";
            });
    }

    $scope.abrirLinkV3 = function(lstParametros) {
        if (!$scope.anobase) {
            return;
        }
        const parametros = ['8', '411', $scope.anobase, $scope.inscricao];
        window.open(`https://${$scope.webserviceBios}/service/V3/489/${parametros.join("_")}/${calcMD5("wd@4@1&1944"+parametros.join("")).toUpperCase()}`);
    }

    $scope.buscaDeclaracoesIR();
});