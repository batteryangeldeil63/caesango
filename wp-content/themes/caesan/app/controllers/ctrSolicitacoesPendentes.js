/* global app, service, lstSolicitacoesPendentes, token, webservice */

app.controller("SolicitacoesPendentes", function($scope, $http) {
    $scope.webservice = webservice;
    $scope.webserviceBios = webserviceBios;

    $scope.environment = localStorage.getItem('environment');
    $scope.codprestador = localStorage.getItem("inscricao");
    $scope.token = token;
    $scope.guia = null;
    $scope.numPerPage = 10;
    $scope.maxSize = 5;
    $scope.resultadoEnvioLaudos = [];

    $scope.isCarregando = false;
    $scope.isEnviando = false;
    $scope.laudosParaAnexar = {};

    $scope.currentPageSolicitacoesPendentes = 1;
    $scope.filteredLstSolicitacoesPendentes = [];
    $scope.lstSolicitacoesPendentes = [];
    $scope.todosLstSolicitacoesPendentes = [];

    $scope.buscaAutorizacoesPendentes = function() {
        document.getElementById("loading").style.display = "block";
        const body = {
            coddao: 544,
            parametros: ["W8", $scope.codprestador]
        }
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            data: JSON.stringify(body),
        }).then(
            function successCallback(response) {
                if (response.data.conteudo.length > 0) {
                    $scope.lstSolicitacoesPendentes = response.data.conteudo[0]
                    $scope.todosLstSolicitacoesPendentes = JSON.parse(JSON.stringify($scope.lstSolicitacoesPendentes));
                    const begin = ($scope.currentPageSolicitacoesPendentes - 1) * $scope.numPerPage;
                    const end = begin + $scope.numPerPage;
                    $scope.filteredLstSolicitacoesPendentes = $scope.todosLstSolicitacoesPendentes.slice(begin, end);
                }
                document.getElementById("loading").style.display = "none";
            },
            function errorCallback(erro) {
                document.getElementById("loading").style.display = "none";
            }
        );
    }
    $scope.buscaAutorizacoesPendentes();

    $scope.numPages = function() {
        return Math.ceil(
            $scope.todosLstSolicitacoesPendentes.length / $scope.numPerPage
        );
    };

    $scope.$watch("currentPageSolicitacoesPendentes + numPerPage", function() {
        const begin = ($scope.currentPageSolicitacoesPendentes - 1) * $scope.numPerPage;
        const end = begin + $scope.numPerPage;
        $scope.filteredLstSolicitacoesPendentes = $scope.todosLstSolicitacoesPendentes.slice(begin, end);
    });

    // $scope.currentPageAnexoGuiasPendentes = 1;
    // $scope.filteredLstAnexoGuiasPendentes = [];
    // $scope.lstAnexoGuiasPendentes = lstSolicitacoesPendentes[1];

    // $scope.makeLstAnexoGuiasPendentes = function () {
    //   $scope.todosLstAnexoGuiasPendentes = $scope.lstAnexoGuiasPendentes;
    // };

    // $scope.makeLstAnexoGuiasPendentes();

    // $scope.numPages = function () {
    //   return Math.ceil(
    //     $scope.todosLstAnexoGuiasPendentes.length / $scope.numPerPage
    //   );
    // };

    // $scope.$watch("currentPageAnexoGuiasPendentes + numPerPage", function () {
    //   var begin = ($scope.currentPageAnexoGuiasPendentes - 1) * $scope.numPerPage,
    //     end = begin + $scope.numPerPage;
    //   $scope.filteredLstAnexoGuiasPendentes =
    //     $scope.todosLstAnexoGuiasPendentes.slice(begin, end);
    // });

    $scope.objVO0481 = {
        atendimentorn: null,
        caraterinternacao: null,
        caratersolicitacao: null,
        cboprofissional: null,
        cid: null,
        codassociado: null,
        codindacidente: null,
        codprocedimento: null,
        codtabtiss: null,
        codtipacomodacao: null,
        codtipconsulta: null,
        codusuario: null,
        dtpedido: null,
        dtprovproc: null,
        dtsugeridainternacao: null,
        indicacao: null,
        inscricao: null,
        lstarquivos: [],
        nomecontratado: null,
        nommedico: null,
        nrguiaunimed: null,
        opmes: null,
        prevusoopme: null,
        prevusoquimioterapico: null,
        procedimentos: [],
        prorrogacao: null,
        qtddiarias: null,
        regimeinternacao: null,
        secretsolic: null,
        seqguiaprincipal: null,
        sequencia: null,
        tipocodigo: null,
        tipoexame: null,
        tipoguia: null,
        tipoinscricao: null,
        tipointernacao: null,
        ufconselhoprof: null,
        vlropmes: null,
    };

    $scope.EnviarLaudos = function(sequencia) {
        var i;
        for (i = 0; i < $scope.lstSolicitacoesPendentes.length; i++) {
            if ($scope.lstSolicitacoesPendentes[i].sequencia == sequencia) {
                $scope.guia = i;
            }
        }
        $scope.objVO0481.sequencia =
            $scope.lstSolicitacoesPendentes[$scope.guia].sequencia;
        $("#enviarLaudos").modal();
    };

    $scope.anexarGuias = function(nrguia) {
        if ($scope.objVO0481.lstarquivos.length === 0) return;
        $scope.isEnviando = true;
        const bodies = $scope.objVO0481.lstarquivos.map((laudo) => {
            const codempresa = "W8";
            const sArqBase64 = laudo.base64;
            const sNomArquivo = laudo.filename;
            const sCodPrestador = $scope.codprestador;
            const sSeqArqTISS = "";
            const sNrGuia = nrguia;
            const sCodOrigem = "2";
            const sExcluirSimNao = "N";
            const body = {
                coddao: 412,
                conteudo: null,
                hash: null,
                parametros: [
                    codempresa,
                    sArqBase64,
                    sNomArquivo,
                    sCodPrestador,
                    sSeqArqTISS,
                    sNrGuia,
                    sCodOrigem,
                    sExcluirSimNao,
                ],
            };
            return body;
        });
        $scope.isEnviando = true;
        bodies.forEach((body, index) => {
            $http({
                method: "POST",
                url: "https://" + $scope.webserviceBios + "/service/V1",
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify(body),
            }).then(
                function successCallback(response) {
                    let mensagem = "";
                    if (
                        response.data.conteudo ===
                        "Já existe arquivo anexado para esse ARQUIVO/GUIA."
                    ) {
                        mensagem = "Já existe arquivo anexado com esse nome";
                    } else if (response.data.conteudo === "Falha ao gravar o arquivo.") {
                        mensagem = "Falha ao enviar o anexo";
                    } else {
                        mensagem = "Arquivo anexado com sucesso";
                    }
                    $scope.resultadoEnvioLaudos.push({
                        nomearquivo: body.parametros[2],
                        mensagem: mensagem,
                    });
                    if (index === bodies.length - 1) {
                        $("#enviarLaudos").modal("hide");
                        $("#alerta2").modal();
                        $scope.isEnviando = false;
                    }
                },
                function errorCallback(response) {
                    $scope.resultadoEnvioLaudos.push({
                        nomearquivo: body.parametros[2],
                        mensagem: "Falha ao enviar o anexo",
                    });
                    if (index === bodies.length - 1) {
                        $("#enviarLaudos").modal("hide");
                        $("#alerta2").modal();
                        $scope.isEnviando = false;
                    }
                }
            );
        });
    };


    $scope.alerta = function(cod) {
        if (cod > 0) {
            $scope.alerta.mensagem = "Laudos enviados com sucesso!";
            $scope.alerta.complemento = null;
            $scope.alerta.titulo = "Sucesso";
            $scope.limparForm();
        } else {
            $scope.alerta.mensagem = "Não foi possível enviar os laudos.";
            $scope.alerta.complemento = "Tente novamente mais tarde!";
            $scope.alerta.titulo = "Erro";
        }
        $("#alerta").modal();
    };

    $scope.limparInput = function() {
        $scope.laudosParaAnexar = {};
    };

    $scope.prepararEnvioAnexos = function() {
        $("#confirmar-envio-anexos").modal();
    };

    $scope.removerArquivo = function(arqRemover) {
        $scope.laudosParaAnexar.fileguia = $scope.laudosParaAnexar.fileguia.filter(
            (arquivo) => arquivo.filename != arqRemover.filename
        );
    };

    $scope.limparInput = function() {
        $scope.objVO0481.lstarquivos = [];
        $scope.resultadoEnvioLaudos = [];
    };

    $scope.fecharResultadoEnvio = function() {
        $scope.resultadoEnvioLaudos = [];
        $("#enviarLaudos").modal("hide");
        $("#alerta2").modal("hide");
        $scope.limparInput();
        window.location.reload();
    };
});