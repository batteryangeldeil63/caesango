/* global app, service, lstSolicitacoesAutorizadas, token, webservice */

app.controller("SolicitacoesAutorizadas", function($scope, $http) {
    $scope.webservice = webservice;
    $scope.webserviceBios = webserviceBios;

    $scope.environment = localStorage.getItem('environment');
    $scope.numPerPage = 10;
    $scope.maxSize = 5;
    $scope.currentPageSolicitacoesAutorizadas = 1;
    $scope.filteredLstSolicitacoesAutorizadas = [];
    $scope.lstSolicitacoesAutorizadas = [];
    $scope.token = token;
    $scope.codprestador = localStorage.getItem('inscricao');
    $scope.objVO0411;

    $scope.buscaSolicitacoesAutorizadas = function() {
        const body = {
            coddao: 560,
            parametros: ["W8", $scope.codprestador]
        }
        document.getElementById("loading").style.display = "block";
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(body)
        }).then(function successCallback(response) {
            document.getElementById("loading").style.display = "none";
            if (response.data.conteudo.length > 0) {
                $scope.lstSolicitacoesAutorizadas = response.data.conteudo[0];
                const begin = (($scope.currentPageSolicitacoesAutorizadas - 1) * $scope.numPerPage)
                const end = begin + $scope.numPerPage;
                $scope.filteredLstSolicitacoesAutorizadas = $scope.lstSolicitacoesAutorizadas.slice(begin, end);
            }
        }, function errorCallback(error) {
            document.getElementById("loading").style.display = "none";
        });
    }

    $scope.buscaSolicitacoesAutorizadas();

    $scope.cnpj = function(v) {
        v = v.replace(/\D/g, "");
        v = v.replace(/^(\d{2})(\d)/, "$1.$2");
        v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
        v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
        v = v.replace(/(\d{4})(\d)/, "$1-$2");
        return v;
    };

    $scope.imprimir = function() {
        window.print();
    };

    $scope.numPages = function() {
        return Math.ceil($scope.lstSolicitacoesAutorizadas.length / $scope.numPerPage);
    };

    $scope.$watch('currentPageSolicitacoesAutorizadas + numPerPage', function() {
        const begin = (($scope.currentPageSolicitacoesAutorizadas - 1) * $scope.numPerPage)
        const end = begin + $scope.numPerPage;
        $scope.filteredLstSolicitacoesAutorizadas = $scope.lstSolicitacoesAutorizadas.slice(begin, end);
    });

    // $scope.currentPageAnexoGuiasAutorizadas = 1;
    // $scope.filteredLstAnexoGuiasAutorizadas = [];
    // $scope.lstAnexoGuiasAutorizadas = lstSolicitacoesAutorizadas[1];

    // $scope.makeLstAnexoGuiasAutorizadas = function() {
    //   $scope.todosLstAnexoGuiasAutorizadas = $scope.lstAnexoGuiasAutorizadas;
    // };

    // $scope.makeLstAnexoGuiasAutorizadas();

    // $scope.numPages = function() {
    //   return Math.ceil($scope.todosLstAnexoGuiasAutorizadas.length / $scope.numPerPage);
    // };

    // $scope.$watch('currentPageAnexoGuiasAutorizadas + numPerPage', function() {
    //   var begin = (($scope.currentPageAnexoGuiasAutorizadas - 1) * $scope.numPerPage), end = begin + $scope.numPerPage;
    //   $scope.filteredLstAnexoGuiasAutorizadas = $scope.todosLstAnexoGuiasAutorizadas.slice(begin, end);
    // });



    // FUNÇÃO APARENTEMENTE SEM INUTILIZAVEL, DE ACORDO COM A VIEW, O PARAMETRO RECEBIDO EM SEQUENCIA ESTA SENDO UM LINK
    $scope.impSolicitacaoConsulta = function(sequencia) {
        const body = {
            coddao: 488,
            parametros: ["W8", sequencia, $scope.codprestador]
        }
        document.getElementById("loading").style.display = "block";
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(body)
        }).then(function successCallback(response) {
            document.getElementById('loading').style.display = "none";
            $scope.objVO0411 = response.data.conteudo;
            $('#impressaoSolGuiaExame').modal('show');
        }, function errorCallback(error) {
            document.getElementById("loading").style.display = "none";
        });
    }
});