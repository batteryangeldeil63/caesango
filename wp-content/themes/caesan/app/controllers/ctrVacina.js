/* global app, webservice, token, objVO0306 */

app.controller("Vacina", function($scope, $http) {
    $scope.webserviceBios = webserviceBios;
    $scope.environment = localStorage.getItem('environment');
    $scope.token = token;
    $scope.codPessoa = null;
    $scope.lstVO0478 = [];
    var dtAtual = new Date();
    var meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    $scope.data = dtAtual.getDate() + " de " + meses[dtAtual.getMonth()] + " de " + dtAtual.getFullYear();
    $scope.loading = true;
    $scope.dependentesSelecionados = [];
    $scope.showRecibo = false;
    $scope.loadingBtn = false;

    $scope.searchDependents = function() {
        $scope.loading = true;
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
                console.log(response.data.conteudo)
                $scope.codPessoa = response.data.conteudo.codpessoa;
                body = {
                    coddao: 553,
                    parametros: ["W8", $scope.codPessoa]
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
                    console.log($scope.codPessoa);
                    console.log($scope.lstVO0478);
                    $scope.lstVO0478.forEach(function(dependente) {
                        if (!dependente.coddependente) {
                            dependente.selected = true;
                        }
                    });
                    $scope.loading = false;
                }, function errorCallback(erro) {});
            }
        }, function errorCallback(erro) {});
    }
    $scope.searchDependents();

    $scope.request = function() {
        $scope.loadingBtn = true;
        $scope.dependentesSelecionados = $scope.lstVO0478.filter(dependente => dependente.selected);
        const lstDependents = $scope.lstVO0478.filter((dependente) => dependente.selected).map((dependente) => {
            dependente.$$hashKey = undefined;
            dependente.selected = undefined;
            return dependente;
        })
        if (lstDependents.length > 0 && $scope.aceitetermo) {
            $scope.aceitetermo = false;
            const body = {
                coddao: 555,
                parametros: ["W8", String($scope.codPessoa), JSON.stringify(lstDependents)]
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
                $scope.showRecibo = true;
                $scope.loadingBtn = false;
            }, function errorCallback(response) {
                console.log("Não deu certo.")
            })
        }
    }

    $scope.printRecibo = function() {
        var originalContents = document.body.innerHTML;
        var printContents = document.getElementsByClassName('imprimir')[0].innerHTML;
        var printWrapper = document.createElement('div');
        printWrapper.innerHTML = printContents;
        var printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.body.appendChild(printWrapper);
            printWindow.print();
            printWindow.onafterprint = function() {
                printWindow.close();
            };
        } else {
            alert('Não foi possível abrir a janela de impressão. Verifique se as configurações do navegador permitem pop-ups.');
        }
        document.body.innerHTML = originalContents;
    }
});