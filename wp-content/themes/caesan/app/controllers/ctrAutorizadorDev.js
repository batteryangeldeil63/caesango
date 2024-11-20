/* global app, lstTipAcomodacaoSol, lstCarSolicitacao, token, webservice, statusAtual, paginaAtual */

app.controller("ctrAutorizadorDev", function($scope, $http, $timeout) {
    $scope.webservice = webservice;
    $scope.webserviceBios = webserviceBios;

    $scope.environment = localStorage.getItem('environment');
    $scope.lstLaudos = [];
    $scope.carregando = false;
    $scope.isEnviando = false;
    $scope.isExcluindo = false;
    $scope.codprestador = localStorage.getItem("inscricao");
    $scope.laudosParaAnexar = {};
    $scope.candidatoExclusaoAnexo = null;
    $scope.numeroAnexoExcluir = null;
    $scope.exclusaoError = false;
    $scope.resultadoEnvioLaudos = [];
    $scope.lstcritica = [];

    $scope.diretriz = null;
    $scope.erro = {
        titulo: "",
        mensagem: ""
    }

    $scope.token = token;
    $scope.guia = null;
    $scope.statusAtual = 0;
    $scope.enviarPara = null;
    $scope.acaoGuia = null;
    $scope.nrguiaunimed = null;
    $scope.numPerPage = 10;
    $scope.maxSize = 5;
    $scope.currentPageAutorizador = 1;
    $scope.filteredLstAutorizador = [];

    $scope.lstStatus = {
        "0": "Status Inicial",
        "1": "Autorizado",
        "2": "Negado",
        "3": "Quantidade autorizada superior a 10 procedimentos",
        "4": "Auditoria Médica 1",
        "5": "Auditoria Técnica",
        "6": "Aguardando Laudos",
        "7": "Prestador de Origem",
        "8": "Reavaliação da Guia",
        "9": "Aguardando Visita",
        "10": "Aguardando Orçamento",
        "11": "Aguardando Psicologia",
        "12": "Aguardando Fisioterapia",
        "13": "Excluído",
        "14": "Aguardando Codificação",
        "15": "Aguardando Odontólogo",
        "17": "Auditoria Médica 2",
    }

    // Se mudar essa ordem bagunça todo o esquema de status
    // $scope.lstStatus = [
    //   "Status Inicial",
    //   "Autorizado",
    //   "Negado",
    //   "Quantidade autorizada superior a 10 procedimentos",
    //   "Auditoria Médica 1",
    //   "Auditoria Técnica",
    //   "Aguardando Laudos",
    //   "Prestador de Origem",
    //   "Reavaliação da Guia",
    //   "Aguardando Visita",
    //   "Aguardando Orçamento",
    //   "Aguardando Psicologia",
    //   "Aguardando Fisioterapia",
    //   "Excluído",
    //   "Aguardando Codificação",
    //   "Aguardando Odontólogo",
    //   "Auditoria Médica 2",
    // ];

    $scope.linhadotempodaguia = null;
    $scope.dtfinal = null;
    $scope.dtinicial = null;
    $scope.numeroGuiaSelecionada = null;

    $scope.mostrarQtddiasSolicitacao = function(Autorizador) {
        if (Autorizador.codstatus == "1" || Autorizador.codstatus == "2" || Autorizador.codstatus == "13") {
            return false;
        } else {
            return true;
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

    $scope.lstTipAcomodacaoSol = [];
    $scope.lstCarSolicitacao = [];

    $scope.buscaLstCarSolicitacao = function() {
        const body = {
            coddao: 572,
            parametros: ["W8", "2", "23"]
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
            $scope.lstCarSolicitacao = response.data.conteudo;
        }, function errorCallback(error) {
            document.getElementById("loading").style.display = "none";
        });
    }
    $scope.buscaLstCarSolicitacao();

    $scope.buscaLstTipAcomodacaoSol = function() {
        const body = {
            coddao: 572,
            parametros: ["W8", "2", "49"]
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
                $scope.lstTipAcomodacaoSol = response.data.conteudo;
                //Tipos de acomodaçao CAESAN
                $scope.lstTipAcomodacaoSol.unshift({
                    codigo: null,
                    codtabtiss: null,
                    sigla: null,
                    termo: "-----------",
                });
                $scope.lstTipAcomodacaoSol.unshift({
                    codigo: "2",
                    codtabtiss: null,
                    sigla: null,
                    termo: "Apartamento",
                });
                $scope.lstTipAcomodacaoSol.unshift({
                    codigo: "1",
                    codtabtiss: null,
                    sigla: null,
                    termo: "Enfermaria",
                });
                $scope.lstTipAcomodacaoSol.unshift({
                    codigo: null,
                    codtabtiss: null,
                    sigla: null,
                    termo: "-----------",
                });
            },
            function errorCallback(error) {
                document.getElementById("loading").style.display = "none";
            }
        );
    }
    $scope.buscaLstTipAcomodacaoSol();

    $scope.remove_day = function(dtatual) {
        var inicial = new Date(
            $scope.dtfinal.getFullYear(),
            $scope.dtfinal.getMonth(),
            $scope.dtfinal.getDate()
        );
        var milissegundos_por_dia = 1000 * 60 * 60 * 24;
        var data_final = new Date(inicial.getTime() - 1 * milissegundos_por_dia);
        return data_final;
    };

    //$scope.dtinicial = $scope.remove_day(dtatual);
    $scope.status;
    $scope.codbeneficiario = "";
    $scope.nombeneficiario = "";
    $scope.sequencia = "";

    $scope.lstMenuInferiorAutorizador = [];

    $scope.menu = [{
            codigo: 4,
            titulo: "Autorizador Médico 1"
        },
        {
            codigo: 17,
            titulo: "Autorizador Médico 2"
        },
        {
            codigo: 5,
            titulo: "Autorizador Técnico"
        },
        {
            codigo: 6,
            titulo: "Aguardando Laudos"
        },
        {
            codigo: 9,
            titulo: "Aguardando Visita"
        },
        {
            codigo: 10,
            titulo: "Aguardando Orçamento"
        },
        {
            codigo: 11,
            titulo: "Aguardando Psicologia"
        },
        {
            codigo: 12,
            titulo: "Aguardando Fisioterapia"
        },
        {
            codigo: 14,
            titulo: "Aguardando Codificação"
        },
        {
            codigo: 15,
            titulo: "Aguardando Odontólogo"
        },
        {
            codigo: 99,
            titulo: "Buscar Guias"
        }
    ];

    $scope.procTuss = [];

    $scope.lstTipoInternacao = [{
            codigo: "1",
            codtabtiss: 2,
            sigla: null,
            termo: "Clínica"
        },
        {
            codigo: "2",
            codtabtiss: 2,
            sigla: null,
            termo: "Cirúrgica"
        },
        {
            codigo: "3",
            codtabtiss: 2,
            sigla: null,
            termo: "Obstétrica"
        },
        {
            codigo: "4",
            codtabtiss: 2,
            sigla: null,
            termo: "Pediátrica"
        },
        {
            codigo: "5",
            codtabtiss: 2,
            sigla: null,
            termo: "Psiquiátrica"
        }
    ];

    $scope.tipoInternacao = function(cod) {
        var retorno;
        for (var i = 0; i < $scope.lstTipoInternacao.length; i++) {
            if ($scope.lstTipoInternacao[i].codigo == cod) {
                retorno = $scope.lstTipoInternacao[i].termo;
            }
        }
        return retorno;
    };

    $scope.objProcedimento = {
        altacomplexidade: null,
        autorizacao: null,
        autorizacaonoturna: null,
        codprocedimento: null,
        codtabela: null,
        codtabelaaut: null,
        cpfexecutante: null,
        descricao: null,
        diretrizutilizacao: null,
        dtautorizacao: null,
        dtrealizacao: null,
        extraexpediente: null,
        inseridomedauditor: null,
        libautomatica: null,
        libparasexo: null,
        medicoauditor: null,
        parametros: null,
        parecer: null,
        procbloqueado: null,
        procedautorizado: null,
        procexcludente: null,
        prorrogacao: null,
        qtdautorizada: null,
        qtdfaturada: null,
        qtdmaxautomatica: null,
        qtdsolicitada: null,
        rolans: null,
        seqautorizacao: null,
        tipoguia: null,
        ultimoprocautorizado: null,
        valor: null,
        vlrcusto: null,
        vlrmanual: null,
    };

    $scope.todosLstProcedimentosTuss = [];

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

    $scope.caraterSolicitacao = function(cod) {
        var carater;
        for (var i = 0; i < $scope.lstCarSolicitacao.length; i++) {
            if ($scope.lstCarSolicitacao[i].codigo == cod) {
                carater = $scope.lstCarSolicitacao[i].termo;
            }
        }
        return carater;
    };

    $scope.tipoAcomodacao = function(cod) {
        var acomodacao;
        for (var i = 0; i < $scope.lstTipAcomodacaoSol.length; i++) {
            if (cod != null) {
                if ($scope.lstTipAcomodacaoSol[i].codigo == cod) {
                    acomodacao = $scope.lstTipAcomodacaoSol[i].termo;
                }
            }
        }
        return acomodacao;
    };

    $scope.consultarProcedimentosTuss = function(cod) {
        if (cod !== null) {
            if ($scope.consultaTuss != null) {
                if ($scope.consultaTuss.codigo_interno != cod) {
                    for (i = 0; i < $scope.procTuss.length; i++) {
                        if ($scope.procTuss[i].codigo_interno == cod) {
                            $scope.consultaTuss = $scope.procTuss[i];
                            $scope.lstProcedimentosTuss = [];
                            refresh();
                        }
                    }
                }
            } else {
                for (i = 0; i < $scope.procTuss.length; i++) {
                    if ($scope.procTuss[i].codigo_interno == cod) {
                        $scope.consultaTuss = $scope.procTuss[i];
                    }
                }
            }
            $("#consultatuss").modal();
        }
    };

    $scope.excluirProcedimento = function(index) {
        $scope.objVO0545.lstprocedimentos.splice(index, 1);
    };

    $scope.lstbotoes = [{
            codigo: 1,
            titulo: "Autorizar",
            img: "autorizado.png"
        },
        {
            codigo: 2,
            titulo: "Negar",
            img: "negado.png"
        },
        {
            codigo: 6,
            titulo: "Enviar para: Aguardando Laudos",
            img: "Aguardando-Laudos_1.png"
        },
        {
            codigo: 10,
            titulo: "Enviar para: Aguardando Orçamento",
            img: "Aguardando-Orcamento.png"
        },
        {
            codigo: 9,
            titulo: "Enviar para: Aguardando Visita",
            img: "Aguardando-Visita.png"
        },
        {
            codigo: 4,
            titulo: "Enviar para: Autorizador Médico 1",
            img: "autorizador_medico1.png"
        },
        {
            codigo: 5,
            titulo: "Enviar para: Autorizador Técnico",
            img: "Autorizador-Tecnico.png"
        },
        {
            codigo: 11,
            titulo: "Enviar para: Autorizador Psicologia",
            img: "Autorizador-Psicologia.png"
        },
        {
            codigo: 12,
            titulo: "Enviar para: Autorizador Fisioterapia",
            img: "Autorizador-Fisioterapia.png"
        },
        {
            codigo: 14,
            titulo: "Enviar para: Aguardando Codificação",
            img: "Aguardando-Codificacao.png"
        },
        {
            codigo: 15,
            titulo: "Enviar para: Autorizador Odontólogo",
            img: "autorizador_odontologo.png"
        },
        {
            codigo: 17,
            titulo: "Enviar para: Autorizador Médico 2",
            img: "autorizador_medico2.png"
        }
    ];

    $scope.GuiaSelecionada = {
        codigo: null,
        titulo: null,
        img: null
    };

    console.log($scope.statusAtual);

    $scope.abrirGuias = function(item) {
        $scope.statusAtual = item.codigo;
        $scope.Titulo = item.titulo;
        $scope.GuiaSelecionada = item;
        $scope.lstMenuInferiorAutorizador = [];

        switch ($scope.statusAtual) {
            case 4:
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[0]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[1]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[2]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[3]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[4]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[11]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[6]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[7]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[8]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[9]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[10]);
                break;
            case 5:
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[0]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[1]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[2]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[3]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[6]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[4]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[5]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[11]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[7]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[8]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[9]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[10]);
                break;
            case 6:
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[0]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[1]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[3]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[4]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[5]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[11]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[6]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[7]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[8]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[9]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[10]);
                break;
            case 9:
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[0]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[1]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[3]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[4]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[5]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[11]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[6]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[7]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[8]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[9]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[10]);
                break;
            case 10:
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[5]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[11]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[6]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[7]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[8]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[9]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[10]);
                break;
            case 11:
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[0]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[1]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[3]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[4]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[5]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[11]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[6]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[8]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[9]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[10]);
                break;
            case 12:
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[0]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[1]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[2]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[3]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[4]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[5]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[11]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[6]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[7]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[9]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[10]);
                break;
            case 14:
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[0]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[1]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[2]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[3]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[4]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[5]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[11]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[6]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[7]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[9]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[10]);
                break;
            case 15:
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[0]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[1]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[2]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[3]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[4]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[5]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[11]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[6]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[7]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[9]);
                break;
            case 17:
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[0]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[1]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[2]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[3]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[4]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[5]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[6]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[7]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[8]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[9]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[10]);
                break;
            default:
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[0]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[1]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[2]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[3]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[4]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[5]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[11]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[6]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[7]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[8]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[9]);
                $scope.lstMenuInferiorAutorizador.push($scope.lstbotoes[10]);
        }
        if ($scope.statusAtual != 99 && $scope.statusAtual != 0) {
            $scope.dtfinal = null;
            $scope.dtinicial = null;
            $scope.sequencia = null;
            $scope.codbeneficiario = null;
            $scope.nombeneficiario = null;
            $scope.nrguiaunimed = null;
            $scope.BuscarGuias($scope.statusAtual);
        } else {
            $scope.lstAutorizador = [];
            $scope.listarGuias();
        }
    };

    $scope.adicionarProcedimento = function() {
        $scope.objProcedimento.qtdautorizada = $scope.objProcedimento.qtdsolicitada;
        $scope.objProcedimento.inseridomedauditor = true;
        $scope.objVO0545.lstprocedimentos.push($scope.objProcedimento);

        $scope.objProcedimento = {
            altacomplexidade: null,
            autorizacao: null,
            autorizacaonoturna: null,
            codprocedimento: null,
            codtabela: null,
            codtabelaaut: null,
            cpfexecutante: null,
            descricao: null,
            diretrizutilizacao: null,
            dtautorizacao: null,
            dtrealizacao: null,
            extraexpediente: null,
            inseridomedauditor: null,
            libautomatica: null,
            libparasexo: null,
            medicoauditor: null,
            parametros: null,
            parecer: null,
            procbloqueado: null,
            procedautorizado: null,
            procexcludente: null,
            prorrogacao: null,
            qtdautorizada: null,
            qtdfaturada: null,
            qtdmaxautomatica: null,
            qtdsolicitada: null,
            rolans: null,
            seqautorizacao: null,
            tipoguia: null,
            ultimoprocautorizado: null,
            valor: null,
            vlrcusto: null,
            vlrmanual: null,
        };
    };

    $(".modal").on({
        "show.bs.modal": function() {
            var idx = $(".modal:visible").length;
            $(this).css("z-index", 1040 + 10 * idx);
        },
        "shown.bs.modal": function() {
            var idx = $(".modal:visible").length - 1;
            $(".modal-backdrop")
                .not(".stacked")
                .css("z-index", 1039 + 10 * idx)
                .addClass("stacked");
        },
        "hidden.bs.modal": function() {
            if ($(".modal:visible").length > 0) {
                setTimeout(function() {
                    $(document.body).addClass("modal-open");
                }, 0);
            }
        },
    });

    $scope.totalItemsProcedimentosTuss = $scope.todosLstProcedimentosTuss.length;
    $scope.filteredLstProcedimentosTuss = [];
    $scope.currentPageProcedimentosTuss = 1;
    $scope.numPerPageProcedimentosTuss = 10;
    $scope.maxSizeProcedimentosTuss = 5;

    $scope.buscarProcedimentosTuss = function() {
        const body = {
            coddao: 526,
            parametros: ["W8", $scope.consultaTuss.codigo_interno, $scope.termo]
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
                $scope.todosLstProcedimentosTuss = response.data.conteudo;
                document.getElementById("tabelamodal").style.display = "block";
                $scope.refresh();
            },
            function errorCallback(erro) {
                // Adicionar mensagem de erro ao buscar procedimento
            }
        );
    }

    $scope.alerta = false;
    $scope.alertabloqueio = false;
    $scope.removerAlerta = function() {
        $scope.alerta = false;
        $scope.alertabloqueio = false;
    };

    $scope.buscarProcedimentoTussCodigo = function() {
        $scope.alerta = false;
        $scope.alertabloqueio = false;
        if ($scope.objProcedimento.codtabela && $scope.objProcedimento.codprocedimento && $scope.objProcedimento.codprocedimento.length >= 8) {
            const body = {
                coddao: 526,
                parametros: ["W8", $scope.objProcedimento.codtabela, $scope.objProcedimento.codprocedimento]
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
                        $scope.objProcedimento = response.data.conteudo[0];
                        if ($scope.objProcedimento.procbloqueado) {
                            $scope.alertabloqueio = true;
                        }
                    } else {
                        $scope.alerta = true;
                    }
                },
                function errorCallback(erro) {}
            );
        }
    }

    $scope.selecionarProcedimento = function(obj) {
        $scope.objProcedimento = obj;
    };

    $scope.refresh = function() {
        var begin =
            ($scope.currentPageProcedimentosTuss - 1) *
            $scope.numPerPageProcedimentosTuss;
        var end = begin + $scope.numPerPageProcedimentosTuss;
        $scope.filteredLstProcedimentosTuss =
            $scope.todosLstProcedimentosTuss.slice(begin, end);
        $scope.totalItemsProcedimentosTuss =
            $scope.todosLstProcedimentosTuss.length;
    };

    $scope.numPages = function() {
        return Math.ceil(
            $scope.todosLstProcedimentosTuss.length /
            $scope.numPerPageProcedimentosTuss
        );
    };

    $scope.$watch(
        "currentPageProcedimentosTuss + numPerPageProcedimentosTuss",
        function() {
            var begin =
                ($scope.currentPageProcedimentosTuss - 1) *
                $scope.numPerPageProcedimentosTuss,
                end = begin + $scope.numPerPageProcedimentosTuss;
            $scope.filteredLstProcedimentosTuss =
                $scope.todosLstProcedimentosTuss.slice(begin, end);
        }
    );

    $scope.setarAutomatico = function() {
        for (i = 0; i < $scope.objVO0545.lstprocedimentos.length; i++) {
            $scope.objVO0545.lstprocedimentos[i].qtdautorizada =
                $scope.objVO0545.lstprocedimentos[i].qtdsolicitada;
        }
        /* Desabilitado 03/06/2022 Iury
        if (
          $scope.GuiaAtual.codacomcontratada === "1" ||
          $scope.GuiaAtual.codacomcontratada === "3" ||
          $scope.GuiaAtual.codacomcontratada === "5"
        ) {
          $scope.objVO0545.codacomautorizada = "1";
        } else if (
          $scope.GuiaAtual.lstcarencia[0].dtinternacoes.indexOf("concluída") == -1
        ) {
          $scope.objVO0545.codacomautorizada = "1";
        } else {
          $scope.objVO0545.codacomautorizada = "2";
        }
        */

        // novo 03/06/2022 Iury
        if ($scope.GuiaAtual.codacomautorizada) {
            $scope.objVO0545.codacomautorizada = $scope.GuiaAtual.codacomautorizada;
        } else {
            $scope.objVO0545.codacomautorizada = $scope.GuiaAtual.codacomcontratada;
        }

        $scope.objVO0545.qtddiariasautorizada = $scope.GuiaAtual.qtddiarias;
    };

    $scope.negarAutomatico = function() {
        if ($scope.objVO0545.lstprocedimentos != null) {
            for (i = 0; i < $scope.objVO0545.lstprocedimentos.length; i++) {
                $scope.objVO0545.lstprocedimentos[i].qtdautorizada = null;
            }
        }
        $scope.objVO0545.codacomautorizada = null;
        $scope.objVO0545.qtddiariasautorizada = null;
        $scope.objVO0545.visita = null;
    };

    $scope.qtdProcedimentosSolicitados = 0;
    $scope.qtdProcedimentosAutorizados = 0;

    $scope.mostrarDadosGuia = function(sequencia) {
        $scope.qtdProcedimentosSolicitados = 0;
        $scope.qtdProcedimentosAutorizados = 0;
        $scope.GuiaAtual = null;
        document.getElementById("loading").style.display = "block";
        const body = {
            coddao: 562,
            parametros: ["W8", sequencia]
        }
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(body),
        }).then(function successCallback(response) {
            document.getElementById("loading").style.display = "none";
            document.getElementById("loading").style.display = "none";
            $scope.GuiaAtual = response.data.conteudo[0];
            $scope.objVO0545.observacao = $scope.GuiaAtual.observacao;
            $scope.objVO0545.infotecnicas = $scope.GuiaAtual.infotecnicas;
            $scope.objVO0545.lstlaudos = $scope.GuiaAtual.lstlaudos;
            $scope.objVO0545.lstprocedimentos = angular.copy($scope.GuiaAtual.lstprocedimentos);
            $scope.aux = 0;
            $scope.qtdProcedimentosSolicitados = 0;
            for (let index = 0; index < $scope.objVO0545.lstprocedimentos.length; index++) {
                if (!$scope.objVO0545.lstprocedimentos[index].inseridomedauditor) {
                    $scope.qtdProcedimentosSolicitados++;
                }
            }
            for (let index = 0; index < $scope.objVO0545.lstprocedimentos.length; index++) {
                if ($scope.objVO0545.lstprocedimentos[index].qtdautorizada !== 0.0) {
                    $scope.qtdProcedimentosAutorizados++;
                }
            }
            $scope.objVO0545.codacomautorizada = $scope.GuiaAtual.codacomautorizada.replace(" ", "");
            $scope.objVO0545.qtddiariasautorizada = $scope.GuiaAtual.qtddiariasautorizada;
            if ($scope.GuiaAtual.codstatusatual != 1 && $scope.GuiaAtual.codstatusatual != 2) {
                $scope.objVO0545.codacomautorizada = null;
                $scope.objVO0545.qtddiariasautorizada = null;
                for (i = 0; i < $scope.objVO0545.lstprocedimentos.length; i++) {
                    $scope.objVO0545.lstprocedimentos[i].qtdautorizada = null;
                }
            } else if ($scope.GuiaAtual.codstatusatual == 2) {
                $scope.objVO0545.qtddiariasautorizada = 0;
                for (i = 0; i < $scope.objVO0545.lstprocedimentos.length; i++) {
                    $scope.objVO0545.lstprocedimentos[i].qtdautorizada = 0;
                }
            }
            $("#mostrarDadosGuia").modal();
        }, function errorCallback(error) {
            document.getElementById("loading").style.display = "none";
        });
    }

    $scope.abrirCriticas = function(autorizador) {
        $scope.numeroGuiaSelecionada = autorizador.sequencia;
        $scope.lstcritica = JSON.parse(JSON.stringify(autorizador.lstcritica)); // Deep copy
        // Insere critica adicional de urgencia e emergencia
        if (autorizador.caratersolicitacao === '2' && autorizador.nomstatus !== 'Autorizado') {
            const texto = $scope.caraterSolicitacao(autorizador.caratersolicitacao)
            const critica = {
                carater: true,
                critica: texto,
            }
            $scope.lstcritica.push(critica);
        }
        document.getElementById("loading").style.display = "block";
        $("#modalCriticas").modal();
        document.getElementById("loading").style.display = "none";
    };

    $scope.openStatus = function(sequencia) {
        const body = {
            coddao: 520,
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
        }).then(function successCallback(response) {
            document.getElementById("loading").style.display = "none";
            $scope.linhadotempodaguia = response.data.conteudo;
            $("#modalStatus").modal();
        }, function errorCallback(error) {
            document.getElementById("loading").style.display = "none";
        });
    }

    $scope.ParOuImpar = function(numero) {
        if (numero & 1) {
            return false;
        } else {
            return true;
        }
    };

    $scope.selecionarCampoGuia = function(sequencia) {
        $scope.GuiaAtual = null;
        document.getElementById("loading").style.display = "block";
        const body = {
            coddao: 562,
            parametros: ["W8", sequencia]
        }
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(body),
        }).then(function successCallback(response) {
            document.getElementById("loading").style.display = "none";
            $scope.GuiaAtual = response.data.conteudo[0];
            $scope.objVO0545.observacao = $scope.GuiaAtual.observacao;
            $scope.objVO0545.infotecnicas = $scope.GuiaAtual.infotecnicas;
            $scope.objVO0545.lstlaudos = $scope.GuiaAtual.lstlaudos;
            $scope.objVO0545.lstprocedimentos = angular.copy($scope.GuiaAtual.lstprocedimentos);
            $scope.aux = 0;
            $scope.objVO0545.codacomautorizada = $scope.GuiaAtual.codacomautorizada;
            $scope.objVO0545.qtddiariasautorizada = $scope.GuiaAtual.qtddiariasautorizada;
            if ($scope.GuiaAtual.codstatusatual != 1 && $scope.GuiaAtual.codstatusatual != 2) {
                $scope.objVO0545.codacomautorizada = null;
                $scope.objVO0545.qtddiariasautorizada = null;
                for (i = 0; i < $scope.objVO0545.lstprocedimentos.length; i++) {
                    $scope.objVO0545.lstprocedimentos[i].qtdautorizada = null;
                }
            } else if ($scope.GuiaAtual.codstatusatual == 2) {
                $scope.objVO0545.qtddiariasautorizada = 0;
                for (i = 0; i < $scope.objVO0545.lstprocedimentos.length; i++) {
                    $scope.objVO0545.lstprocedimentos[i].qtdautorizada = 0;
                }
            }
            $scope.aux = 0;
            $("#selecionarCampoGuia").modal();
        }, function errorCallback(error) {
            document.getElementById("loading").style.display = "none";
        });
    }

    $scope.alterarGuia = function(validar) {
        if ($scope.enviarPara == 2) {
            $scope.negarAutomatico();
        }
        if ($scope.enviarPara === undefined) {
            $scope.negarAutomatico();
            $scope.enviarPara = "";
        }
        if (validar) {
            if ($scope.objVO0545.lstprocedimentos !== null) {
                for (i = 0; i < $scope.objVO0545.lstprocedimentos.length; i++) {
                    if ($scope.objVO0545.lstprocedimentos[i].qtdautorizada == undefined || $scope.objVO0545.lstprocedimentos[i].qtdautorizada == null || $scope.objVO0545.lstprocedimentos[i].qtdautorizada == "") {
                        $scope.objVO0545.lstprocedimentos[i].qtdautorizada = 0.0;
                    }
                }
            }
            const body = {
                coddao: 569,
                conteudo: $scope.objVO0545,
                parametros: ["W8", $scope.GuiaAtual.sequencia, "N", $scope.enviarPara, $scope.token]
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

    $scope.carregarMensagem = function(enviado) {
        $scope.aux = 1;
        if ($scope.enviarPara == null || $scope.enviarPara == "") {
            $scope.enviarPara = 0;
        }
        switch ($scope.enviarPara) {
            case 0:
                if (enviado) {
                    $scope.mensagem = "Guia enviada com sucesso!";
                } else {
                    $scope.mensagem = "Não foi possível enviar a guia.";
                }
                break;
            case 1:
                if (enviado) {
                    $scope.mensagem = "Guia autorizada com sucesso!";
                } else {
                    $scope.mensagem = "Não foi possível autorizador a guia.";
                }
                break;
            case 2:
                if (enviado) {
                    $scope.mensagem = "Guia negada com sucesso!";
                } else {
                    $scope.mensagem = "Não foi possível negar a guia.";
                }
                break;
            case 4:
                if (enviado) {
                    $scope.mensagem = "Guia enviada com sucesso!";
                } else {
                    $scope.mensagem = "Não foi possível enviar a guia.";
                }
                break;
            case 5:
                if (enviado) {
                    $scope.mensagem = "Guia enviada com sucesso!";
                } else {
                    $scope.mensagem = "Não foi possível enviar a guia.";
                }
                break;
            case 6:
                if (enviado) {
                    $scope.mensagem = "Guia enviada com sucesso!";
                } else {
                    $scope.mensagem = "Não foi possível enviar a guia.";
                }
                break;
            case 9:
                if (enviado) {
                    $scope.mensagem = "Guia enviada com sucesso!";
                } else {
                    $scope.mensagem = "Não foi possível enviar a guia.";
                }
                break;
            case 10:
                if (enviado) {
                    $scope.mensagem = "Guia enviada com sucesso!";
                } else {
                    $scope.mensagem = "Não foi possível enviar a guia.";
                }
                break;
            case 11:
                if (enviado) {
                    $scope.mensagem = "Guia enviada com sucesso!";
                } else {
                    $scope.mensagem = "Não foi possível enviar a guia.";
                }
                break;
            case 12:
                if (enviado) {
                    $scope.mensagem = "Guia enviada com sucesso!";
                } else {
                    $scope.mensagem = "Não foi possível enviar a guia.";
                }
            case 14:
                if (enviado) {
                    $scope.mensagem = "Guia enviada com sucesso!";
                } else {
                    $scope.mensagem = "Não foi possível enviar a guia.";
                }
                break;
        }
    };

    $scope.recarregarPagina = function() {
        $("#mostrarDadosGuia").modal("hide");
        $("#selecionarCampoGuia").modal("hide");
        $scope.abrirGuias($scope.GuiaSelecionada);
        //window.location.href = "http://localhost/" + $scope.paginaAtual;
    };

    $scope.autenticarEnvio = function(valor) {
        switch (valor) {
            case 0:
                $scope.acaoGuia = "Devolver ao encaminhamento de guias pendentes a ";
                break;
            case 1:
                $scope.acaoGuia = "Autorizar a ";
                break;
            case 2:
                $scope.acaoGuia = "Negar a ";
                break;
            case 4:
                $scope.acaoGuia = "Encaminhar para o autorizador médico 1 a ";
                break;
            case 17:
                $scope.acaoGuia = "Encaminhar para o autorizador médico 2 a ";
                break;
            case 5:
                $scope.acaoGuia = "Encaminhar para o autorizador técnico a ";
                break;
            case 6:
                $scope.acaoGuia = "Aguardar laudos da ";
                break;
            case 9:
                $scope.acaoGuia = "Aguardar visita da ";
                break;
            case 10:
                $scope.acaoGuia = "Aguardar orçamento da ";
                break;
            case 11:
                $scope.acaoGuia = "Encaminhar para o autorizador psicologia a ";
                break;
            case 12:
                $scope.acaoGuia = "Encaminhar para o autorizador fisioterapia a ";
                break;
            case 14:
                $scope.acaoGuia = "Encaminhar para Aguardar Codificação a ";
                break;
            case undefined:
                $scope.acaoGuia = "Alterar a ";
        }
        $scope.enviarPara = valor;
        $scope.aux = 2;
    };

    $scope.sort_by = function(predicate) {
        $scope.predicate = predicate;
        $scope.reverse = !$scope.reverse;
    };

    $scope.print = function(titulo, printContents) {
        printContents = printContents.split(" ").join("&nbsp;");
        printContents = printContents.split("\n").join("<br>");
        let popupWin;
        popupWin = window.open("", "_blank", "top=0,left=0,height=100%,width=auto");
        popupWin.document.open();
        popupWin.document.write(`
          <html>
            <head>
              <title>${titulo}</title>
            </head>
            <body onload="window.print();window.close()">
            <p style="font-family: Courier New; font-size: 8.5px"></any>
            ${printContents}
            </body>
          </html>`);
        popupWin.document.close();
    };

    $scope.RelatorioAutorizacoes = function() {
        if ($scope.codbeneficiario == null) {
            $scope.codbeneficiario = "";
        }
        if ($scope.nombeneficiario == null) {
            $scope.nombeneficiario = "";
        }
        if ($scope.dtinicial == null) {
            $scope.dtinicial = "";
        }
        if ($scope.dtfinal == null) {
            $scope.dtfinal = "";
        }
        if ($scope.nrguiaunimed == null) {
            $scope.nrguiaunimed = "";
        }

        document.getElementById("loading").style.display = "block";
        const body = {
            coddao: 546,
            parametros: [
                "W8",
                $scope.codbeneficiario,
                $scope.nombeneficiario,
                $scope.formataData($scope.dtinicial),
                $scope.formataData($scope.dtfinal),
                $scope.nrguiaunimed
            ]
        }
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            headers: {
                "Content-Type": "application/json;charset=utf-8;",
            },
            data: JSON.stringify(body),
        }).then(
            function successCallback(response) {
                document.getElementById("loading").style.display = "none";
                $scope.print("Relatório de Autorizações", response.data.conteudo);
            },
            function errorCallback(error) {
                document.getElementById("loading").style.display = "none";
            }
        );
    }

    $scope.BuscarGuias = function(status) {
        if (status == null) {
            status = "";
        }
        if ($scope.dtfinal == null) {
            $scope.dtfinal = "";
        }
        if ($scope.dtinicial == null) {
            $scope.dtinicial = "";
        }
        if ($scope.sequencia == null) {
            $scope.sequencia = "";
        }
        if ($scope.codbeneficiario == null) {
            $scope.codbeneficiario = "";
        }
        if ($scope.nombeneficiario == null) {
            $scope.nombeneficiario = "";
        }
        if ($scope.nrguiaunimed == null) {
            $scope.nrguiaunimed = "";
        }
        if ($scope.sequencia != "" || $scope.nrguiaunimed != "") {
            status = "";
        }

        document.getElementById("loading").style.display = "block";
        const body = {
            coddao: 403,
            parametros: [
                "W8",
                $scope.sequencia,
                status,
                $scope.codbeneficiario,
                $scope.nombeneficiario,
                $scope.formataData($scope.dtinicial),
                $scope.formataData($scope.dtfinal),
                $scope.nrguiaunimed
            ]
        }
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            headers: {
                "Content-Type": "application/json;charset=utf-8;",
            },
            data: JSON.stringify(body),
        }).then(
            function successCallback(response) {
                document.getElementById("loading").style.display = "none";
                $scope.lstAutorizador = response.data.conteudo;
                $scope.listarGuias();
            },
            function errorCallback(error) {
                document.getElementById("loading").style.display = "none";
            }
        );
    }

    $scope.listarGuias = function() {
        $scope.numPerPage = 10;
        $scope.maxSize = 5;
        $scope.currentPageAutorizador = 1;
        $scope.filteredLstAutorizador = [];

        $scope.makeLstAutorizador = function() {
            $scope.todosLstAutorizador = $scope.lstAutorizador;
        };

        $scope.makeLstAutorizador();
        $scope.numPages = function() {
            return Math.ceil($scope.todosLstAutorizador.length / $scope.numPerPage);
        };

        $scope.$watch("currentPageAutorizador + numPerPage", function() {
            var begin = ($scope.currentPageAutorizador - 1) * $scope.numPerPage,
                end = begin + $scope.numPerPage;
            $scope.filteredLstAutorizador = $scope.todosLstAutorizador.slice(
                begin,
                end
            );
        });
    };


    $scope.consultarPacoteprocedimentos = function(Procedimento) {
        const body = {
            coddao: 543,
            parametros: ["W8", $scope.codprestador, Procedimento.codtabela, Procedimento.codprocedimento]
        }
        document.getElementById("loading").style.display = "block";
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            data: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }).then(function successCallback(response) {
            $scope.pacoteprocedimentos = response.data.conteudo;
            document.getElementById("loading").style.display = "none";
            $("#pacoteprocedimentos").modal();
        }, function errorCallback(response) {
            document.getElementById("loading").style.display = "none";
        });
    }

    $scope.buscarLstTabelaProcedimentos = function() {
        var strObjVO0628 = JSON.stringify({
            coddao: 408,
            parametros: ["W8"],
        });
        $http({
                method: "POST",
                url: "https://" + $scope.webserviceBios + "/service/V1",
                headers: {
                    "Content-Type": "application/json;charset=utf-8;",
                },
                data: strObjVO0628,
            })
            .success(function(data) {
                $scope.procTuss = data.conteudo;
            })
            .error(function(error) {
                console.log(error);
            });
    };
    $scope.buscarLstTabelaProcedimentos();

    $scope.redirectPaginaVisualizarAnexos = function() {
        const guia = $scope.GuiaAtual;
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

    $scope.buscaDiretriz = function(GuiaAtual, Procedimento) {
        $scope.diretriz = null;
        const sCodEmpresa = "W8";
        const sCodTabela = Procedimento.codtabela;
        const sCodProcedimento = Procedimento.codprocedimento;
        const sDtConsulta = GuiaAtual.dtpedido;
        const body = {
            coddao: 460,
            conteudo: null,
            parametros: [sCodEmpresa, sCodTabela, sCodProcedimento, sDtConsulta],
            hash: null
        };
        document.getElementById("loading").style.display = "block";
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            headers: {
                "Content-Type": "application/json;charset=utf-8;",
            },
            data: JSON.stringify(body),
        }).then(
            function successCallback(response) {
                if (response.data.conteudo) {
                    const observacao = response.data.conteudo.replaceAll("\r\n", "<br>").replaceAll("\n", "<br><br>")
                    $scope.diretriz = {
                        procedimento: sCodProcedimento,
                    }
                    document.getElementById("diretriz-paragraph").innerHTML = observacao;
                    document.getElementById("loading").style.display = "none";
                    $("#modalDiretriz").modal();
                } else {
                    erro.titulo = "Aviso"
                    erro.mensagem = "Web service retornou vazio!"
                    document.getElementById("loading").style.display = "none";
                    $("#modalErro").modal();
                }
            },
            function errorCallback(response) {
                erro.titulo = "Aviso"
                document.getElementById("loading").style.display = "none";
                erro.mensagem = "Web service retornou vazio!"
                $("#modalErro").modal();
            }
        );
    }

});