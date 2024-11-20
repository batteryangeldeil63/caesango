/* global app, lstAutorizacoesPendentes, token, lstGuiasAutorizadas, lstTipAcomodacaoSol, webservice*/

app.controller("ctrGuiasAutorizadasDev", function($scope, $timeout) {
    $scope.webservice = webservice;
    $scope.webserviceBios = webserviceBios;

    $scope.environment = localStorage.getItem('environment');
    $scope.numPerPage = 10;
    $scope.maxSize = 5;
    $scope.currentPageGuiasAutorizadas = 1;
    $scope.filteredLstGuiasAutorizadas = [];
    $scope.lstGuiasAutorizadas = lstGuiasAutorizadas;
    $scope.lstTipAcomodacaoSol = lstTipAcomodacaoSol;
    $scope.token = token;
    $scope.guia = null;

    $scope.makeLstAutorizacoesPendentes = function() {
        $scope.todosLstGuiasAutorizadas = $scope.lstGuiasAutorizadas;
    };

    $scope.makeLstAutorizacoesPendentes();

    $scope.numPages = function() {
        return Math.ceil($scope.todosLstGuiasAutorizadas.length / $scope.numPerPage);
    };

    $scope.$watch('currentPageGuiasAutorizadas + numPerPage', function() {
        var begin = (($scope.currentPageGuiasAutorizadas - 1) * $scope.numPerPage),
            end = begin + $scope.numPerPage;
        $scope.filteredLstGuiasAutorizadas = $scope.todosLstGuiasAutorizadas.slice(begin, end);
    });

    $scope.mostarDadosGuia = function(guia) {
        $scope.guia = guia;
        $scope.aux = 0;
        $("#mostarDadosGuia").modal();
    };

    $scope.eviarAuditMedica = function() {
        $scope.aux = 1;
        $scope.mensagem = "Guia enviada para autorização médica!";

        $timeout(function() {
            $("#mostarDadosGuia").modal('hide');
        }, 3000);
    };

    $scope.eviarAuditTecnica = function() {
        $scope.aux = 1;
        $scope.mensagem = "Guia enviada para autorização técnica!";

        $timeout(function() {
            $("#mostarDadosGuia").modal('hide');
        }, 3000);
    };

    $scope.sort_by = function(predicate) {
        $scope.predicate = predicate;
        $scope.reverse = !$scope.reverse;
    };

    $scope.mostarDadosGuia = function(guia) {
        for (var i = 0; i < $scope.lstGuiasAutorizadas.length; i++) {
            if ($scope.lstGuiasAutorizadas[i].sequencia == guia) {
                $scope.guia = i;
            }
        }
        $scope.aux = 0;
        $("#mostarDadosGuia").modal();
    };
});

app.filter('startFrom', function() {
    return function(input, start) {
        if (input) {
            start = +start; //parse to int
            return input.slice(start);
        }
        return [];
    };
});