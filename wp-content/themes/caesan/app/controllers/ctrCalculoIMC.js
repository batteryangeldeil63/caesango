/* global app, webservice */

app.controller("CalculoIMC", function($scope) {
    $scope.webservice = webservice;
    $scope.webserviceBios = webserviceBios;

    $scope.environment = localStorage.getItem('environment');

    $scope.calcularImc = function() {
        $scope.imc = $scope.peso / ($scope.altura * $scope.altura);
        if ($scope.imc < 18.5) {
            $scope.resultado = "Você está abaixo do peso. Procure uma orientação médica.";
        } else if ($scope.imc >= 18.5 && $scope.imc < 25) {
            $scope.resultado = "Parabéns, você está no seu peso ideal, continue cuidando de sua saúde.";
        } else if ($scope.imc >= 25 && $scope.imc < 30) {
            $scope.resultado = "Você está acima do peso. Procure uma orientação médica.";
        } else if ($scope.imc >= 30) {
            $scope.resultado = "Cuidado, você está com obesidade. Procure uma orientação médica.";
        }
    };

    $scope.lstTabelaImc = [{
        "resultados": "Menor que de 18,5",
        "situacao": "Você está abaixo do peso"
    }, {
        "resultados": "Maior que 18,5 e menor que 25",
        "situacao": "Você está no peso adequado"
    }, {
        "resultados": "Maior que 25 e menor que 30",
        "situacao": "Você está acima do peso"
    }, {
        "resultados": "Maior que de 30",
        "situacao": "Você está com obesidade"
    }];
});