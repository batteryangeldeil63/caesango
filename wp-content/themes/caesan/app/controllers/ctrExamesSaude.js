/* global app, lstExamesSaude, webservice */

app.controller("examesSaude", function($scope, $http) {
    $scope.webservice = webservice;
    $scope.webserviceBios = webserviceBios;

    $scope.environment = localStorage.getItem('environment');
    $scope.inscricao = localStorage.getItem('inscricao');
    $scope.numPerPage = 10;
    $scope.maxSize = 5;

    $scope.currentPageExamesSaude = 1;
    $scope.filteredLstExamesSaude = [];
    $scope.lstExamesSaude = [];

    $scope.buscaExameSaude = function() {
        const body = {
            coddao: 566,
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
                $scope.lstExamesSaude = response.data.conteudo;
                const begin = (($scope.currentPageExamesSaude - 1) * $scope.numPerPage);
                const end = begin + $scope.numPerPage;
                $scope.filteredLstExamesSaude = $scope.lstExamesSaude.slice(begin, end);
            },
            function errorCallback(error) {
                document.getElementById("loading").style.display = "none";
            });
    }
    $scope.buscaExameSaude();

    $scope.numPages = function() {
        return Math.ceil($scope.lstExamesSaude.length / $scope.numPerPage);
    };

    $scope.$watch('currentPageExamesSaude + numPerPage', function() {
        const begin = (($scope.currentPageExamesSaude - 1) * $scope.numPerPage);
        const end = begin + $scope.numPerPage;
        $scope.filteredLstExamesSaude = $scope.lstExamesSaude.slice(begin, end);
    });
});