/* global app, lstBoletosEmitidos, webservice */

app.controller("BoletosEmitidos", function($scope, $http) {
    $scope.webservice = webservice;
    $scope.webserviceBios = webserviceBios;

    $scope.environment = localStorage.getItem('environment');
    $scope.inscricao = localStorage.getItem('inscricao');

    $scope.lstBoletosEmitidos = [];
    $scope.buscaBoletosEmitidos = function() {
        const body = {
            coddao: 565,
            parametros: ["W8", $scope.inscricao]
        }
        document.getElementById("loading").style.display = "block";
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(body),
        }).then(
            function successCallback(response) {
                document.getElementById("loading").style.display = "none";
                $scope.lstBoletosEmitidos = response.data.conteudo;
            },
            function errorCallback(error) {
                document.getElementById("loading").style.display = "none";
            }
        );
    }
    $scope.buscaBoletosEmitidos();
});