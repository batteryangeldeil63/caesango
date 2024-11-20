/* global app, lstCarSolicitacao, lstTipoInternacao, lstTipoAtendimento, lstTipoConsulta, lstIndicAcidente, lstCodCbo, lstConPrestSol, lstUfConselho, lstTipAcomodacaoSol, lstCarInternacao, lstRegimeInternacao, lstProfissionais, token, secretario, webservice, objVO0306 */

app.controller("ctrDesenvolvimento", function($scope, $http) {
    $scope.webservice = webservice;
    $scope.webserviceBios = webserviceBios;
    $scope.wsbios = webserviceBios;
    $scope.environment = localStorage.getItem('environment');
    $scope.token = token;
});