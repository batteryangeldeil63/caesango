/* global app, teste, webservice */

app.controller("PostCtrl", function($scope) {
    $scope.webservice = webservice;
    $scope.webserviceBios = webserviceBios;

    $scope.environment = localStorage.getItem('environment');
    $scope.alertaOpen = function() {
        $("#alerta").modal();
    };

    $scope.alertaOpen();

    $scope.alertaClose = function() {
        $("#alerta").modal('hide');
    };

    var meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    $scope.formataData = function(data) {
        return data.substr(8, 2) + " de " + meses[parseInt(data.substr(5, 2)) - 1] + ", " + data.substr(0, 4);
    };
});