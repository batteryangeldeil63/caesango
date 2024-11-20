/* global app, webservice */

app.controller("GerarHashMensagem", function($scope, $http) {
    $scope.webservice = webservice;
    $scope.webserviceBios = webserviceBios;

    $scope.environment = localStorage.getItem('environment');

    $scope.setMensagem = async function() {
        var sib = document.getElementById('sib').checked;
        const file = document.getElementById('mensagemtiss').files[0];
        const sXML = await file.text();
        const body = {
            coddao: 574,
            parametros: ["W8", sXML, sib ? "1" : "0"]
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
            $scope.HashXml = response.data.conteudo;
            document.getElementById("loading").style.display = "none";
        }, function errorCallback(error) {
            console.log(error)
            document.getElementById("loading").style.display = "none";
        });
    }
});