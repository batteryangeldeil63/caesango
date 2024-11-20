/* global app, webservice, lstBeneficiarios, token */

app.controller("ExclusaoBeneficiario", function($scope, $http) {
    $scope.webservice = webservice;
    $scope.webserviceBios = webserviceBios;

    $scope.environment = localStorage.getItem('environment');
    $scope.lstVO0478 = [];
    $scope.token = token;

    $scope.buscaBeneficiarios = function() {
        let body = {
            coddao: 517,
            parametros: ["W8", $scope.token]
        }
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            data: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(function successCallback(response) {
            if (response.data.conteudo) {
                body = {
                    coddao: 553,
                    parametros: ["W8", response.data.conteudo.codpessoa]
                }
                $http({
                    method: "POST",
                    url: "https://" + $scope.webserviceBios + "/service/V1",
                    data: JSON.stringify(body),
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    }
                }).then(function successCallback(response) {
                    $scope.lstVO0478 = response.data.conteudo
                }, function errorCallback(erro) {});
            }
        }, function errorCallback(erro) {});
    }

    $scope.buscaBeneficiarios();

    for (var item in $scope.lstVO0478) {
        $scope.lstVO0478[item].selected = false;
    };

    $scope.imprimir = function() {
        window.print();
    };

    $scope.excluirBeneficiarios = function() {
        const lstBeneficiariosExclusao = $scope.lstVO0478.filter((beneficiario) => beneficiario.selected).map((beneficiario) => {
            beneficiario.$$hashKey = undefined;
            beneficiario.selected = undefined;
            return beneficiario;
        });
        if (lstBeneficiariosExclusao.length > 0 && $scope.aceitetermo) {
            const body = {
                coddao: 554,
                parametros: ["W8", $scope.token, JSON.stringify(lstBeneficiariosExclusao)]
            }
            $http({
                method: "POST",
                url: "https://" + $scope.webserviceBios + "/service/V1",
                data: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).then(function successCallback(response) {
                $scope.protocolo = response.data.conteudo;
                document.getElementById("recibo").style.display = "block";
            }, function errorCallback(response) {
                document.getElementById("recibo").style.display = "none";
                $("#alertafalha").modal();
            });
        }
    }
});