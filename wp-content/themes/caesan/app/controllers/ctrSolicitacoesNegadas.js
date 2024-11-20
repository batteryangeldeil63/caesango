/* global app, service, lstSolicitacoesNegadas, token, webservice */

app.controller("SolicitacoesNegadas", function($scope, $http) {
    $scope.webservice = webservice;
    $scope.webserviceBios = webserviceBios;

    $scope.environment = localStorage.getItem('environment');
    $scope.codprestador = localStorage.getItem('inscricao');
    $scope.numPerPage = 5;
    $scope.maxSize = 5;

    $scope.currentPageSolicitacoesNegadas = 1;
    $scope.filteredLstSolicitacoesNegadas = [];
    $scope.lstSolicitacoesNegadas = [];

    $scope.token = token;

    $scope.numPages = function() {
        return Math.ceil(
            $scope.lstSolicitacoesNegadas.length / $scope.numPerPage
        );
    };

    $scope.buscaAutorizacoesNaoAutorizadas = function() {
        const body = {
            coddao: 561,
            parametros: ["W8", $scope.codprestador]
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
                if (response.data.conteudo.length > 0) {
                    $scope.lstSolicitacoesNegadas = response.data.conteudo[0];
                    const begin = ($scope.currentPageSolicitacoesNegadas - 1) * $scope.numPerPage;
                    const end = begin + $scope.numPerPage;
                    $scope.filteredLstSolicitacoesNegadas = $scope.lstSolicitacoesNegadas.slice(begin, end);
                }
            },
            function errorCallback(error) {
                document.getElementById("loading").style.display = "none";
            }
        );
    }

    $scope.buscaAutorizacoesNaoAutorizadas();
    $scope.$watch("currentPageSolicitacoesNegadas + numPerPage", function() {
        const begin = ($scope.currentPageSolicitacoesNegadas - 1) * $scope.numPerPage;
        const end = begin + $scope.numPerPage;
        $scope.filteredLstSolicitacoesNegadas = $scope.lstSolicitacoesNegadas.slice(begin, end);
    });

    /*
    $scope.currentPageAnexoGuiasNegadas = 1;
    $scope.filteredLstAnexoGuiasNegadas = [];
    $scope.lstAnexoGuiasNegadas = lstSolicitacoesNegadas[1];

    $scope.makeLstAnexoGuiasNegadas = function () {
      $scope.todosLstAnexoGuiasNegadas = $scope.lstAnexoGuiasNegadas;
    };

    $scope.makeLstAnexoGuiasNegadas();

    $scope.numPages = function () {
      return Math.ceil(
        $scope.todosLstAnexoGuiasNegadas.length / $scope.numPerPage
      );
    };

    $scope.$watch("currentPageAnexoGuiasNegadas + numPerPage", function () {
      var begin = ($scope.currentPageAnexoGuiasNegadas - 1) * $scope.numPerPage,
        end = begin + $scope.numPerPage;
      $scope.filteredLstAnexoGuiasNegadas =
        $scope.todosLstAnexoGuiasNegadas.slice(begin, end);
    });
    */
});