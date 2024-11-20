/* global app, webservice, calcMD5 */

app.controller("ctrTeste", function($scope, $http) {
    $scope.webservice = webservice;
    $scope.webserviceBios = webserviceBios;
    $scope.environment = localStorage.getItem('environment');
    $scope.objLogin = {
        user: null,
        password: null
    };

    $scope.logar = function() {
        const body = {
            coddao: 16,
            parametros: ["W8", $scope.objLogin.user + "@caesan", calcMD5($scope.objLogin.password).toUpperCase(), "8", ""]
        }
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            headers: {
                "Content-Type": "application/json;charset=utf-8;",
            },
            data: JSON.stringify(body),
        }).success(function(response) {
            console.log(response)
        }).error(function(error) {
            console.log("error", error);
        });
    }

    // $scope.isCarregando = false;
    // $scope.isExcluindo = false;
    // const queryString = window.location.search;
    // const urlParams = new URLSearchParams(queryString);
    // $scope.sCodPrestador = urlParams.get("id1");
    // $scope.sNrGuia = urlParams.get("id2");
    // $scope.sSeqArquivo = urlParams.get("id3");
    // $scope.sPrestadorSN = urlParams.get("id4");
    // $scope.lstAnexos = [];
    // $scope.codOrigem = "";
    // $scope.candidatoExclusaoAnexo = null;
    // $scope.numeroAnexoExcluir = null;
    // $scope.exclusaoError = false;
    // $scope.resultadoEnvioAnexos = [];
    // $scope.arquivoFaturamento = [];
    // $scope.arquivosParaAnexar = [];
    // $scope.nomeOrigem = {
    //   1: "Faturamento",
    //   2: "Laudo",
    //   3: "Parecer Interno"
    // };

    // $scope.buscarLstAnexos = function() {
    //   const codcopia = "W8";
    //   const body = {
    //     coddao: 413,
    //     conteudo: null,
    //     parametros: [
    //       codcopia,
    //       $scope.sCodPrestador,
    //       $scope.sSeqArquivo,
    //       $scope.sNrGuia,
    //       $scope.sPrestadorSN,
    //     ],
    //     hash: null,
    //   };
    //   body.hash = calcMD5("wd@4@1&1944" + body.parametros.join("")).toString();
    //   $scope.isCarregando = true;
    //   $http({
    //     method: "POST",
    //     url: "https://" + $scope.webserviceBios + "/service/V1",
    //     headers: {
    //       "Content-Type": "application/json;charset=utf-8;",
    //     },
    //     data: JSON.stringify(body),
    //   }).success(function (response) {
    //     $scope.lstAnexos = response.conteudo;
    //     console.log($scope.lstAnexos);
    //     $scope.nrGuiaResultadoBusca = $scope.lstAnexos.nrguia;
    //     $scope.isCarregando = false;
    //     $scope.mudarDisplay(mainContainer, 1);
    //     $scope.mudarDisplay(pageLoader, 0);
    //   }).error(function (error) {
    //     $scope.isCarregando = false;
    //     $scope.mudarDisplay(mainContainer, 1);
    //     $scope.mudarDisplay(pageLoader, 0);
    //     console.log("error", error);
    //   });
    // };

    // $scope.excluirAnexo = function() {
    //   if (nrGuia === $scope.nrGuiaResultadoBusca) {
    //     console.log("Os números da guia são iguais!");
    //   } else {
    //     console.log("Os números da guia são diferentes.");
    //   }
    // };
});