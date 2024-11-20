/* global app, fichaTecnica, webservice, token, paginaAtual, sequencia*/

app.controller("ctrAnaliseTecnica", function($scope, $http, $timeout) {
    $scope.webservice = webservice;
    $scope.webserviceBios = webserviceBios;
    $scope.environment = localStorage.getItem('environment')
    $scope.fichaTecnica = null;
    $scope.numPerPage = 10;
    $scope.maxSize = 5;
    $scope.token = token;
    $scope.currentPageUltimosProcedimentosAutorizados = 1;
    $scope.filteredLstUltimosProcedimentosAutorizados = [];
    $scope.lstUltimosProcedimentosAutorizados = [];
    $scope.codprocedimento = null;
    $scope.GuiasNegadas = false;
    $scope.guia;
    $scope.paginaAtual = paginaAtual;
    $scope.seqGuiaSelecionada = null;
    $scope.dtinicial = null;
    $scope.dtfinal = null;
    $scope.sequencia = sequencia;
    $scope.objVO0545 = {
        indicacao: null,
        opmes: null,
        observacao: null,
        qtddiariasautorizada: null,
        codacomautorizada: null,
        lstlaudos: null,
        lstprocedimentos: null,
        infotecnicas: null,
        visita: null,
    };

    $scope.buscarFichaTecnica = function() {
        var dtinicio = "";
        var dtfim = "";
        if ($scope.dtinicial != null) {
            dtinicio = $scope.formataData($scope.dtinicial);
        }
        if ($scope.dtfinal != null) {
            dtfim = $scope.formataData($scope.dtfinal);
        }
        const body = {
            coddao: 576,
            parametros: ["W8", $scope.sequencia, dtinicio, dtfim]
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
                $scope.fichaTecnica = response.data.conteudo;
                $scope.lstUltimosProcedimentosAutorizados = $scope.fichaTecnica.lstultimosprocedimentosautorizados;
                $scope.todosLstUltimosProcedimentosAutorizados = [];
                $scope.todosLstUltimosProcedimentosAutorizados = $scope.lstUltimosProcedimentosAutorizados;
                $scope.refresh();
            },
            function errorCallback(error) {
                document.getElementById("loading").style.display = "none";
            }
        );
    }

    $scope.buscarFichaTecnica();

    $scope.selecionarCampoGuia = function(seqGuiaSelecionada) {
        const body = {
            coddao: 562,
            parametros: ["W8", seqGuiaSelecionada]
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
                $scope.guia = response.data.conteudo[0];
                $scope.objVO0545.observacao = $scope.guia.observacao;
                $scope.objVO0545.infotecnicas = $scope.guia.infotecnicas;
                $("#selecionarCampoGuia").modal();
            },
            function errorCallback(error) {
                document.getElementById("loading").style.display = "none";
            }
        );
    }

    $scope.alterarGuia = function(validar) {
        if (validar) {
            const body = {
                coddao: 569,
                conteudo: $scope.objVO0545,
                parametros: ["W8", $scope.seqGuiaSelecionada, "N", "", $scope.token]
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
                    $scope.carregarMensagem(true);
                    $timeout(function() {
                        $scope.recarregarPagina();
                    }, 3000);
                },
                function errorCallback(error) {
                    document.getElementById("loading").style.display = "none";
                    $scope.carregarMensagem(false);
                    $timeout(function() {
                        $scope.recarregarPagina();
                    }, 3000);
                }
            );
        } else {
            $scope.aux = 0;
        }
    }

    $scope.recarregarPagina = function() {
        window.location.href =
            "http://www.caesan.com.br/" +
            $scope.paginaAtual +
            $scope.fichaTecnica.seqguiaanalise;
    };

    $scope.carregarMensagem = function(alterada) {
        $scope.aux = 1;
        if (alterada) {
            $scope.mensagem = "Guia alterada com sucesso!";
        } else {
            $scope.mensagem = "Não foi possível alterar a guia.";
        }
    };

    $scope.autenticarEnvio = function(valor) {
        $scope.acaoGuia = "Alterar a ";
        $scope.enviarPara = null;
        $scope.aux = 2;
    };

    $scope.MostrarGuiasNegadas = function() {
        if ($scope.GuiasNegadas) {
            $scope.GuiasNegadas = false;
        } else {
            $scope.GuiasNegadas = true;
        }
    };

    $scope.formataData = function(data) {
        if (data !== undefined && data !== null && data !== "") {
            var mes = data.getMonth() + 1;
            var dia = data.getDate();
            if (mes < 10) {
                mes = "0" + mes;
            }
            if (dia < 10) {
                dia = "0" + dia;
            }
            return dia + "/" + mes + "/" + data.getFullYear();
        } else {
            return data;
        }
    };

    $scope.FiltrarGuias = function() {
        $scope.todosLstUltimosProcedimentosAutorizados = [];
        if (
            $scope.codprocedimento == null ||
            $scope.codprocedimento == undefined ||
            $scope.codprocedimento == 0 ||
            $scope.codprocedimento == ""
        ) {
            $scope.todosLstUltimosProcedimentosAutorizados =
                $scope.lstUltimosProcedimentosAutorizados;
        } else {
            for (
                var i = 0, max = $scope.lstUltimosProcedimentosAutorizados.length; i < max; i++
            ) {
                if (
                    $scope.lstUltimosProcedimentosAutorizados[i].codprocedimento ==
                    $scope.codprocedimento
                ) {
                    $scope.todosLstUltimosProcedimentosAutorizados.push(
                        $scope.lstUltimosProcedimentosAutorizados[i]
                    );
                }
            }
        }
        $scope.refresh();
    };

    $scope.refresh = function() {
        var begin =
            ($scope.currentPageUltimosProcedimentosAutorizados - 1) *
            $scope.numPerPage;
        var end = begin + $scope.numPerPage;
        $scope.filteredLstUltimosProcedimentosAutorizados =
            $scope.todosLstUltimosProcedimentosAutorizados.slice(begin, end);
        $scope.totalItems = $scope.todosLstUltimosProcedimentosAutorizados.length;
    };

    $scope.makeLstUltimosProcedimentosAutorizados = function() {
        $scope.todosLstUltimosProcedimentosAutorizados =
            $scope.lstUltimosProcedimentosAutorizados;
    };

    $scope.makeLstUltimosProcedimentosAutorizados();

    $scope.numPages = function() {
        return Math.ceil(
            $scope.todosLstUltimosProcedimentosAutorizados.length / $scope.numPerPage
        );
    };

    $scope.$watch(
        "currentPageUltimosProcedimentosAutorizados + numPerPage",
        function() {
            var begin =
                ($scope.currentPageUltimosProcedimentosAutorizados - 1) *
                $scope.numPerPage,
                end = begin + $scope.numPerPage;
            $scope.filteredLstUltimosProcedimentosAutorizados =
                $scope.todosLstUltimosProcedimentosAutorizados.slice(begin, end);
        }
    );

    $scope.mostarDadosGuia = function(sequencia) {
        const body = {
            coddao: 568,
            parametros: ["W8", sequencia]
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
                $scope.GuiaAutorizada = response.data.conteudo[0];
                document.getElementById("loading").style.display = "none";
                $("#mostarDadosGuia").modal();
            },
            function errorCallback(error) {
                document.getElementById("loading").style.display = "none";
            }
        );
    }

    $scope.redirectPaginaVisualizarAnexos = function() {
        const guia = $scope.GuiaAutorizada;
        const sCodPrestador = guia.codprestador;
        const sNrGuia = guia.sequencia;
        const sSeqArqTiss = "";
        const sPrestadorSN = "N";

        window.open(
            `http://www.caesan.com.br/visualizar-anexos-guias/?` +
            `id1=${sCodPrestador}` +
            `&id2=${sNrGuia}` +
            `&id3=${sSeqArqTiss}` +
            `&id4=${sPrestadorSN}`
        );
    };
});