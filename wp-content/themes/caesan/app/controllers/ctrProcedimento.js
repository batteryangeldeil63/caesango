/* global app, service, lstSolicitacoesPendentes, token, tabela, lstProcedimentos, webservice */

app.controller("Procedimento", function($scope, $http) {
    $scope.webservice = webservice;
    $scope.webserviceBios = webserviceBios;
    $scope.environment = localStorage.getItem('environment');
    $scope.token = token;
    $scope.lstProcedimentos = null;
    $scope.retorno = [{
        codprocedimento: "40309037",
        procedimento: "Células, contagem total e específica",
        cobplano: "S",
        coparticipacao: "S",
        rolans: "S",
        vlrcaesan: null,
        vlrunimed: "R$ 1,62",
    }];

    $scope.buscarProcedimentos = function() {
        const body = {
            coddao: 541,
            parametros: ["W8", $scope.codTabela, $scope.busca]
        }
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            data: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }).then(function successCallback(response) {
            $scope.todos = response.data.conteudo;
            refresh();
        }, function errorCallback(response) {});
    }

    function refresh() {
        var begin = ($scope.currentPage - 1) * $scope.numPerPage;
        var end = begin + $scope.numPerPage;
        $scope.filteredTodos = $scope.todos.slice(begin, end);
        $scope.totalItems = $scope.todos.length;
    }

    if ($scope.todos) {
        $scope.totalItems = $scope.todos.length;
    }

    $scope.filteredTodos = [];
    $scope.currentPage = 1;
    $scope.numPerPage = 10;
    $scope.maxSize = 5;

    $scope.numPages = function() {
        return Math.ceil($scope.todos.length / $scope.numPerPage);
    }

    $scope.$watch("currentPage + numPerPage", function() {
        var begin = ($scope.currentPage - 1) * $scope.numPerPage,
            end = begin + $scope.numPerPage;
        $scope.filteredTodos = $scope.todos.slice(begin, end);
    })

    $scope.buscarNomeProcedimento = function(cod) {
        $scope.nome = "";
        for (var i = 0; i < $scope.lstProcedimentos.length; i++) {
            if ($scope.lstProcedimentos[i].codigo_interno == cod) {
                $scope.nome = $scope.lstProcedimentos[i].descricao;
            }
        }
        return $scope.nome;
    }

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
                $scope.lstProcedimentos = data.conteudo;
            })
            .error(function(error) {
                console.log(error);
            });
    }
    $scope.buscarLstTabelaProcedimentos();
});