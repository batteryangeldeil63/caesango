/* global app, lstTipoAtendimento, lstTipoConsulta, lstProfissionais, token, lstConPrestSol, lstUfConselho, lstCodCbo, secretario, webservice, objVO0306 */

app.controller("ctrConsultaMedica", function($scope, $http) {
    $scope.webservice = webservice;
    $scope.webserviceBios = webserviceBios;
    $scope.environment = localStorage.getItem('environment')
    $scope.codprestador = localStorage.getItem("inscricao");
    $scope.usuario = null;
    $scope.objVO0406 = null;
    $scope.lstTipoConsulta = [];
    $scope.procedimentoSelecionado = "";
    $scope.token = token;
    $scope.objVO0306 = null;
    $scope.bGravandoGuia = false;
    $scope.paginaAtualProfissionais = 1;
    $scope.buscaProfissional = "";
    $scope.lstProfissionais = null;
    // $scope.lstTipoAtendimento = [];
    // $scope.lstConPrestSol = [];
    // $scope.lstUfConselho = [];
    // $scope.lstCodCbo = [];

    // Paginação Profissionais
    $scope.lstProfissionaisFiltrada = [];
    $scope.paginacaoProfissionais = {
        paginaAtual: 1,
        itensPorPagina: 10,
        maxSize: 5
    }

    $scope.recemnato = [{
            codigo: "N",
            termo: "Não"
        },
        {
            codigo: "S",
            termo: "Sim"
        },
    ];

    $scope.VO0406 = {
        codcbo: null,
        codconselho: null,
        codespecialidade: null,
        codprestador: null,
        codprofissional: null,
        cpf: null,
        dtexclusao: null,
        dtinclusao: null,
        dtnascimento: null,
        email: null,
        nomconselho: null,
        nome: null,
        nomespecialidade: null,
        nrconselho: null,
        sexo: null,
        sigla: null,
        uf: null,
    };
    $scope.objVO0406 = angular.copy($scope.VO0406);

    // $scope.InserirProfissional = function () {
    //   const sCodEmpresa = "W8";
    //   const sCodPrestador = $scope.codprestador;
    //   const sProfissional = $scope.objVO0406
    //   const body = {
    //     coddao: 464,
    //     conteudo: sProfissional,
    //     parametros: [sCodEmpresa,sCodPrestador],
    //     hash: null
    //   };
    //   document.getElementById("loading").style.display = "block";
    //   $http({
    //     method: "POST",
    //     url: "https://" + $scope.webserviceBios + "/service/V1",
    //     headers: {
    //       "Content-Type": "application/json;charset=utf-8;",
    //     },
    //     data: JSON.stringify(body),
    //   }).success(function (data) {
    //     document.getElementById("loading").style.display = "none";
    //     if(data.conteudo){
    //       $scope.buscaProfissionais();
    //       $scope.alerta.mensagem = "Profissional gravado com sucesso, a partir de agora ele será aparecerá na lista de profissionais.";
    //       $scope.alerta.titulo = "Sucesso";
    //       $("#alerta").modal();
    //     }else{
    //       $scope.alerta.mensagem = "Falha ao vincular profissional ao prestador";
    //       $scope.alerta.titulo = "Erro";
    //       $("#alerta").modal();
    //     }
    //   }).error(function (error) {
    //     document.getElementById("loading").style.display = "none";        
    //     $scope.alerta.mensagem = "Falha na conexão, tente novamente mais tarde!";
    //     $scope.alerta.titulo = "Erro";
    //     $("#alerta").modal();
    //   });
    // }

    $scope.VO0481 = {
        atendimentorn: null,
        caraterinternacao: null,
        caratersolicitacao: null,
        cboprofissional: null,
        cid: null,
        codassociado: null,
        codindacidente: "9",
        codprocedimento: null,
        codtabtiss: "2",
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
        nrguiaunimed: "",
        opmes: null,
        prevusoopme: null,
        prevusoquimioterapic: null,
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
        tipoguia: "2",
        tipoinscricao: null,
        tipointernacao: null,
        ufconselhoprof: null,
        vlropmes: null,
    };
    $scope.objVO0481 = angular.copy($scope.VO0481);
    $scope.objVO0481.secretsolic = "";

    $scope.buscaListTab = function(coddao, codTabela, codTabTiss) {
        const body = {
            coddao,
            parametros: [
                "W8",
                codTabela ? codTabela : codTabTiss,
                codTabTiss
            ]
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
                switch (codTabTiss) {
                    // case 2:
                    //   $scope.lstUfConselho = response.data.conteudo;
                    //   break;
                    // case 24:
                    //   $scope.lstCodCbo = response.data.conteudo;
                    //   break;
                    // case 26:
                    //   $scope.lstConPrestSol = response.data.conteudo;
                    //   break;
                    // case 50:
                    //   $scope.lstTipoAtendimento = response.data.conteudo;
                    //   break;
                    case 52:
                        $scope.lstTipoConsulta = response.data.conteudo;
                        break;
                }
            },
            function errorCallback(error) {
                document.getElementById("loading").style.display = "none";
            }
        );
    }

    $scope.buscaListTab(572, 2, 52); // lstTipoConsulta
    // $scope.buscaListTab(572, 2, 24); // lstCodCbo
    // $scope.buscaListTab(572, 2, 26); // lstConPrestSol
    // $scope.buscaListTab(572, 2, 50); // lstTipoAtendimento
    // $scope.buscaListTab(573, "", 2); // lstUfConselho

    $scope.limparForm = function() {
        $scope.objVO0481 = angular.copy($scope.VO0481);
        $scope.objVO0481.secretsolic = "";
        $scope.usuario = null;
        $scope.buscaProfissional = "";
        $scope.lstProfissionais = null;
        $scope.lstProfissionaisFiltrada = [];
        $scope.paginacaoProfissionais = {
            paginaAtual: 1,
            itensPorPagina: 10,
            maxSize: 5
        }
    };

    $scope.buscacarencia = function(codassociado) {
        if (!codassociado) {
            return;
        }
        var hoje = new Date();
        var dia = hoje.getDate();
        var mes = hoje.getMonth() + 1;
        var ano = hoje.getFullYear();
        if (dia < 10) {
            dia = "0" + dia;
        }
        if (mes < 10) {
            mes = "0" + mes;
        }
        const dtatual = dia + "/" + mes + "/" + ano;
        const body = {
            coddao: 551,
            parametros: ["W8", "", "", codassociado, dtatual]
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
                $scope.usuario = response.data.conteudo;
            },
            function errorCallback(error) {}
        );
    }

    $scope.validarcarencia = function(dtAtual) {
        dtExclusao = new Date($scope.usuario.dtexclusao.substring(6, 10) + "/" + $scope.usuario.dtexclusao.substring(3, 5) + "/" + $scope.usuario.dtexclusao.substring(0, 2));
        if (dtAtual >= dtExclusao) {
            $scope.usuario.valido = false;
            $scope.alertaCarencia();
        } else {
            $scope.usuario.valido = true;
        }
    };

    $scope.alertaCarencia = function() {
        $scope.alerta.mensagem = "Beneficiário não autorizado.";
        $scope.alerta.titulo = "Erro";
        $("#alerta").modal();
    };

    $scope.objVO0411;

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

    $scope.objVO0482 = {
        codprocedimento: null,
        codtabela: null,
        prorrogacao: null,
        qtdsolicitada: null,
        procbloqueado: null,
    };

    $scope.procTuss = [];

    $scope.consultarProcedimentosTuss = function() {
        if ($scope.objVO0482.codtabela !== null) {
            if ($scope.consultaTuss != null) {
                if ($scope.consultaTuss.codigo_interno != $scope.objVO0482.codtabela) {
                    for (i = 0; i < $scope.procTuss.length; i++) {
                        if ($scope.procTuss[i].codigo_interno == $scope.objVO0482.codtabela) {
                            $scope.consultaTuss = $scope.procTuss[i];
                            $scope.todos = [];
                            refresh();
                        }
                    }
                }
            } else {
                for (i = 0; i < $scope.procTuss.length; i++) {
                    if ($scope.procTuss[i].codigo_interno == $scope.objVO0482.codtabela) {
                        $scope.consultaTuss = $scope.procTuss[i];
                    }
                }
            }
            $("#consultatuss").modal();
        }
    };

    $scope.selecionarProcedimento = function(codprocedimento, descricao, procbloqueado) {
        $scope.objVO0482.codprocedimento = codprocedimento;
        $scope.objVO0482.descricao = descricao;
        $scope.objVO0482.procbloqueado = procbloqueado;
        if ($scope.objVO0482.procbloqueado) {
            $scope.alertabloqueio = true;
        }
    };

    $scope.alertaProcedimento = false;
    $scope.alertabloqueio = false;

    $scope.removerAlertaProcedimento = function() {
        $scope.alertaProcedimento = false;
        $scope.alertabloqueio = false;
    };

    $scope.buscarProcedimentoTussCodigo = function() {
        $scope.alertaProcedimento = false;
        $scope.alertabloqueio = false;
        if ($scope.objVO0482.codtabela && $scope.objVO0482.codprocedimento && $scope.objVO0482.codprocedimento.length >= 8) {
            const body = {
                coddao: 526,
                parametros: ["W8", $scope.objVO0482.codtabela, $scope.objVO0482.codprocedimento]
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
                        $scope.selecionarProcedimento(response.data.conteudo[0].codprocedimento, response.data.conteudo[0].descricao, response.data.conteudo[0].procbloqueado);
                    } else {
                        $scope.alertaProcedimento = true;
                    }
                },
                function errorCallback(erro) {
                    // Adicionar mensagem de erro ao buscar procedimento
                }
            );
        }
    }

    $scope.adicionarProcedimento = function() {
        var incluir = true;
        for (i = 0; i < $scope.objVO0481.procedimentos.length; i++) {
            if (
                $scope.objVO0481.procedimentos[i].codtabela === $scope.objVO0482.codtabela &&
                $scope.objVO0481.procedimentos[i].codprocedimento === $scope.objVO0482.codprocedimento
            ) {
                incluir = false;
            }
        }
        if (incluir) {
            $scope.objVO0481.procedimentos.push(angular.copy($scope.objVO0482));
            $scope.objVO0482 = {
                codprocedimento: null,
                codtabela: null,
                prorrogacao: null,
                qtdsolicitada: null,
                procbloqueado: null,
            };
        } else {
            $scope.alerta.mensagem = "Procedimento repetido.";
            $scope.alerta.complemento = ["Verifique o procedimento selecionado!"];
            $scope.alerta.titulo = "Erro";
            $("#alerta").modal();
        }
    };

    $scope.excluirProcedimento = function(index) {
        $scope.objVO0481.procedimentos.splice(index, 1);
    };

    $scope.todos = [];

    $scope.buscarProcedimentosTuss = function() {
        const sCodEmpresa = "W8";
        const sCodTabela = $scope.consultaTuss.codigo_interno;
        const sCodProcedimento = $scope.termo;
        const sCodDAO = "466";
        const body = {
            coddao: sCodDAO,
            conteudo: null,
            parametros: [sCodEmpresa, sCodTabela, sCodProcedimento],
            hash: null
        }
        document.getElementById("loading").style.display = "block";
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            headers: {
                "Content-Type": "application/json;charset=utf-8;",
            },
            data: JSON.stringify(body),
        }).success(function(data) {
            document.getElementById("loading").style.display = "none";
            $scope.todos = data.conteudo;
            document.getElementById("tabelamodal").style.display = "block";
            refresh();
        }).error(function(error) {
            document.getElementById("loading").style.display = "none";
            $scope.alerta.mensagem = "Falha na conexão, tente novamente mais tarde!";
            $scope.alerta.titulo = "Erro";
            $("#alerta").modal();
        });
    }

    function refresh() {
        var begin = ($scope.currentPage - 1) * $scope.numPerPage;
        var end = begin + $scope.numPerPage;
        $scope.filteredTodos = $scope.todos.slice(begin, end);
        $scope.totalItems = $scope.todos.length;
    };

    $scope.totalItems = $scope.todos.length;
    $scope.filteredTodos = [];
    $scope.currentPage = 1;
    $scope.numPerPage = 10;
    $scope.maxSize = 5;

    $scope.numPages = function() {
        return Math.ceil($scope.todos.length / $scope.numPerPage);
    };

    $scope.$watch("currentPage + numPerPage", function() {
        var begin = ($scope.currentPage - 1) * $scope.numPerPage,
            end = begin + $scope.numPerPage;
        $scope.filteredTodos = $scope.todos.slice(begin, end);
    });

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

    $scope.ModalProfissional = function() {
        $scope.objVO0481.codprofissional = null;
        $("#modalProfissional").modal();
    };

    $scope.ModalProcedimento = function() {
        $scope.objVO0481.procedimentos = [];
        $("#modalProcedimento").modal();
    };

    $scope.selecionarProfissional = function(codprofissional) {
        for (i = 0; i < $scope.lstProfissionais.length; i++) {
            if ($scope.lstProfissionais[i].codprofissional == codprofissional) {
                $scope.objVO0406 = $scope.lstProfissionais[i];
            }
        }
        $scope.objVO0481.tipoinscricao = $scope.objVO0406.codconselho;
        $scope.objVO0481.ufconselhoprof = $scope.objVO0406.uf;
        $scope.objVO0481.nommedico = $scope.objVO0406.nome;
        $scope.objVO0481.inscricao = codprofissional;
        $scope.objVO0481.cboprofissional = $scope.objVO0406.codcbo;
        $scope.objVO0481.codprofissional = $scope.objVO0406.codprofissional
        $scope.buscaProfissional = $scope.objVO0406.nome;
        $("#modalProfissional").modal("hide");
    };

    $scope.buscaProfissionais = function() {
        const sCodEmpresa = "W8";
        const sCodDAO = "465";
        const sCodPrestador = "";
        const sNomProfissional = $scope.buscaProfissional;
        const sNrConselho = "";
        const body = {
            coddao: sCodDAO,
            conteudo: null,
            parametros: [sCodEmpresa, sCodPrestador, sNomProfissional, sNrConselho],
            hash: null
        }
        document.getElementById("loading").style.display = "block";
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            headers: {
                "Content-Type": "application/json;charset=utf-8;",
            },
            data: JSON.stringify(body),
        }).success(function(data) {
            document.getElementById("loading").style.display = "none";
            $scope.lstProfissionais = data.conteudo;
            $scope.lstProfissionaisFiltrada = $scope.lstProfissionais.slice(0, $scope.paginacaoProfissionais.itensPorPagina);
            $scope.paginacaoProfissionais.paginaAtual = 1;
        }).error(function(error) {
            document.getElementById("loading").style.display = "none";
            $("#alerta").modal();
        });
    };

    $scope.prepararConselho = function(lstconselho) {
        if (!lstconselho || lstconselho.length === 0) {
            return "Não informado";
        }
        let sRetorno = "";
        lstconselho.forEach((conselho, index) => {
            sRetorno += `${conselho.nomconselho} ${conselho.numero}-${conselho.uf}`;
            if (index !== lstconselho.length - 1) { // adiciona break line se não for o ultimo item da lista
                sRetorno += "<br>"
            }
        });
        return sRetorno;
    }

    $scope.mudarPaginaProfissionais = function() {
        const begin = ($scope.paginacaoProfissionais.paginaAtual - 1) * $scope.paginacaoProfissionais.itensPorPagina;
        const end = begin + $scope.paginacaoProfissionais.itensPorPagina;
        $scope.lstProfissionaisFiltrada = $scope.lstProfissionais.slice(begin, end);
    }

    $scope.alerta = function(codigo, conteudo) {
        // Se codigo for maior que 0 && não houver critica
        // Se codigo for maior que 0 && houver critica
        // Se for menor ou igual a 0
        if (codigo[0] > 0 && conteudo.length === 0) {
            $scope.alerta.mensagem = ["Solicitação enviada com sucesso!"];
            $scope.alerta.complemento = ["Número da Guia: " + codigo];
            $scope.alerta.titulo = "Sucesso";
            $scope.limparForm();
        } else if (codigo[0] > 0) {
            $scope.alerta.mensagem = ["Solicitação enviada com sucesso.", "Número da Guia: " + codigo];
            $scope.alerta.complemento = ["Crítica da Liberação Automática:", ...conteudo];
            $scope.alerta.titulo = "Aviso";
            $scope.limparForm();
        } else {
            $scope.alerta.mensagem = ["Confira se os campos foram preenchidos corretamente.", "Em caso de dúvida: 62. 3267-7323 / 3267-7332 / 99273-5917."];
            $scope.alerta.complemento = ["Erros encontrados:", ...conteudo];
            $scope.alerta.titulo = "Erro";
        }
        $("#alerta").modal();
    };

    $scope.gravarGuia = function() {
        if ($scope.bGravandoGuia) {
            return;
        }
        const body = {
            coddao: 483,
            conteudo: JSON.parse(JSON.stringify($scope.objVO0481)),
            parametros: [
                "W" + $scope.objVO0306.codcopia,
                String($scope.objVO0306.codpessoa),
                String($scope.objVO0306.codperfil),
            ]
        }
        const [ano, mes, dia] = new Date().toISOString().substring(0, 10).split('-');
        body.conteudo.dtpedido = `${dia}/${mes}/${ano}`
        body.conteudo.dtprovproc = `${dia}/${mes}/${ano}`
        document.getElementById("loading").style.display = "block";
        $scope.bGravandoGuia = true;
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            headers: {
                "Content-Type": "application/json;charset=utf-8;",
            },
            data: JSON.stringify(body),
        }).success(function(data) {
            document.getElementById("loading").style.display = "none";
            $scope.alerta([data.codigo], data.conteudo);
            $scope.bGravandoGuia = false;
        }).error(function(error) {
            document.getElementById("loading").style.display = "none";
            $scope.alerta([0], ["Falha na conexão, tente novamente mais tarde!"]);
            $("#alerta").modal();
            $scope.bGravandoGuia = false;
        });
    }

    $scope.buscarUsuario = function() {
        const body = {
            "coddao": 517,
            "parametros": ["W8", $scope.token]
        }
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(body),
        }).then(
            function successCallback(response) {
                $scope.objVO0306 = response.data.conteudo;
            },
            function errorCallback(error) {
                console.log(error)
            }
        );
    }

    $scope.buscarUsuario();
    $scope.buscarLstTabelaProcedimentos();
});