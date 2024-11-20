/* global app, lstDoadoresSangue, webservice */

app.controller("doadoresSangue", function($scope, $http) {
    $scope.webservice = webservice;
    $scope.webserviceBios = webserviceBios;

    $scope.environment = localStorage.getItem('environment');

    $scope.numPerPage = 10;
    $scope.maxSize = 5;
    $scope.currentPageDoadoresSangue = 1;
    $scope.filteredLstDoadoresSangue = [];
    $scope.lstDoadoresSangue = [];

    $scope.buscaDoadoresDeSangue = function() {
        const body = {
            coddao: 564,
            parametros: ["W8"]
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
                $scope.lstDoadoresSangue = response.data.conteudo;
                const begin = (($scope.currentPageDoadoresSangue - 1) * $scope.numPerPage);
                const end = begin + $scope.numPerPage;
                $scope.filteredLstDoadoresSangue = $scope.lstDoadoresSangue.slice(begin, end);
            },
            function errorCallback(error) {
                document.getElementById("loading").style.display = "none";
            });
    }

    $scope.buscaDoadoresDeSangue();

    $scope.numPages = function() {
        return Math.ceil($scope.lstDoadoresSangue.length / $scope.numPerPage);
    };

    $scope.$watch('currentPageDoadoresSangue + numPerPage', function() {
        const begin = (($scope.currentPageDoadoresSangue - 1) * $scope.numPerPage);
        const end = begin + $scope.numPerPage;
        $scope.filteredLstDoadoresSangue = $scope.lstDoadoresSangue.slice(begin, end);
    });
});