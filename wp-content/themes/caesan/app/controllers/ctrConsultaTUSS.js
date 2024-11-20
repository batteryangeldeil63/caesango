/* global app, service, lstSolicitacoesPendentes, token, tabela, webservice */

app.controller("ConsultaTUSS", function($scope, $http) {
    $scope.webservice = webservice;
    $scope.webserviceBios = webserviceBios;

    $scope.environment = localStorage.getItem('environment');
    $scope.token = token;
    $scope.procTuss = [];

    $scope.todos = [];

    $scope.sCodTabela = "";
    $scope.sProcedimento = "";

    $scope.buscarProcedimentosTuss = function() {
        const sCodEmpresa = "W8";
        const sCodDAO = "466";
        const body = {
            coddao: sCodDAO,
            conteudo: null,
            parametros: [sCodEmpresa, $scope.sCodTabela, $scope.sProcedimento],
            hash: null
        }
        document.getElementById("loading").style.display = "block";
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            headers: {
                "Content-Type": "application/json;charset=utf-8;",
            },
            data: JSON.stringify(body),
        }).success(function(data) {
            document.getElementById("loading").style.display = "none";
            $scope.todos = data.conteudo;
            refresh();
        }).error(function(error) {
            document.getElementById("loading").style.display = "none";
        });
    }

    function refresh() {
        var begin = ($scope.currentPage - 1) * $scope.numPerPage;
        var end = begin + $scope.numPerPage;
        $scope.filteredTodos = $scope.todos.slice(begin, end);
        $scope.totalItems = $scope.todos.length;
    }

    $scope.totalItems = $scope.todos.length;
    $scope.filteredTodos = [];
    $scope.currentPage = 1;
    $scope.numPerPage = 10;
    $scope.maxSize = 5;

    $scope.numPages = function() {
        return Math.ceil($scope.todos.length / $scope.numPerPage);
    };

    $scope.$watch("currentPage + numPerPage", function() {
        var begin = ($scope.currentPage - 1) * $scope.numPerPage,
            end = begin + $scope.numPerPage;
        $scope.filteredTodos = $scope.todos.slice(begin, end);
    });

    $scope.buscarLstTabelaProcedimentos = function() {
        var strObjVO0628 = JSON.stringify({
            coddao: 408,
            parametros: ["W8"],
        });
        $http({
                method: "POST",
                url: "https://" + $scope.webserviceBios + "/service/V1",
                headers: {
                    "Content-Type": "application/json;charset=utf-8;",
                },
                data: strObjVO0628,
            })
            .success(function(data) {
                $scope.procTuss = data.conteudo;
            })
            .error(function(error) {
                console.log(error);
            });
    };
    $scope.buscarLstTabelaProcedimentos();
});