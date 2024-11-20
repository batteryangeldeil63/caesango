/* global app, service, lstFaturamento, token, webservice, prestador, lstcodprestador */

app.controller("Faturamento", function($scope, $http) {
    $scope.webservice = webservice;
    $scope.webserviceBios = webserviceBios;
    $scope.environment = localStorage.getItem("environment")
    $scope.sequencia = null;
    $scope.lstGuiasComAnexo = [];
    $scope.lstNomesArquivos = [];
    $scope.codprestador = localStorage.getItem("inscricao");
    $scope.isEnviando = false;
    $scope.isExcluindo = false;
    $scope.isVisualizando = false;
    $scope.candidatoExclusaoAnexo = null;
    $scope.exclusaoError = false;
    $scope.numeroGuiaExcluir = "";
    $scope.anexo = {};
    $scope.token = token;
    $scope.FaturamentoSelecionado;
    $scope.ProcedimentoSelecionado;
    $scope.bGravar = false;
    $scope.lstFaturamento = [];
    $scope.prestador = {};
    $scope.QtdItensPagina = 10;
    $scope.QtdPaginas = [];
    $scope.inicioLstPagina;
    $scope.fimLstPagina;
    $scope.paginaAtual = 0;
    $scope.dtAtual = new Date();

    $scope.buscaPrestador = function() {
        const body = {
            coddao: 571,
            parametros: ["W8", $scope.codprestador]
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
            $scope.prestador = response.data.conteudo;
        }, function errorCallback(error) {
            document.getElementById("loading").style.display = "none";
        });
    }

    $scope.buscaPrestador();

    $scope.GetQtdPaginas = function() {
        $scope.QtdPaginas = [];
        var auxQtdPaginas = $scope.lstFaturamento.length / $scope.QtdItensPagina;
        for (var i = 0; i < auxQtdPaginas; i++) {
            $scope.QtdPaginas.push(i + 1);
        }
    };

    $scope.InicioLstGuias = function() {
        $scope.paginaAtual = 0;
        $scope.irPaginaLstGuias($scope.paginaAtual);
    };

    $scope.AnteriorLstGuias = function() {
        if ($scope.paginaAtual > 0) {
            $scope.paginaAtual = $scope.paginaAtual - 1;
        }
        $scope.irPaginaLstGuias($scope.paginaAtual);
    };

    $scope.irPaginaLstGuias = function(pagina) {
        var qtd = pagina * 10;
        $scope.inicioLstPagina = qtd;
        $scope.fimLstPagina = $scope.inicioLstPagina + $scope.QtdItensPagina;
    };

    $scope.ProximoLstGuias = function() {
        if ($scope.paginaAtual < $scope.QtdPaginas.length - 1) {
            $scope.paginaAtual = $scope.paginaAtual + 1;
        }
        $scope.irPaginaLstGuias($scope.paginaAtual);
    };

    $scope.FimLstGuias = function() {
        $scope.paginaAtual = $scope.QtdPaginas.length - 1;
        $scope.irPaginaLstGuias($scope.paginaAtual);
    };

    $scope.InicioLstGuias();

    $scope.objVO0482 = {
        cbhpm: null,
        codtabela: null,
        prorrogacao: null,
        qtdsolicitada: null,
    };

    $scope.objVO0543 = {
        altacomplexidade: false,
        autorizacao: null,
        autorizacaonoturna: false,
        codprocedimento: null,
        codtabela: null,
        codtabelaaut: null,
        cpfexecutante: null,
        descricao: null,
        diretrizutilizacao: false,
        dtautorizacao: null,
        dtrealizacao: null,
        inseridomedauditor: false,
        medicoauditor: false,
        necesautorizacao: false,
        parametros: null,
        parecer: null,
        procedautorizado: null,
        prorrogacao: false,
        qtdautorizada: null,
        qtdfaturada: null,
        qtdsolicitada: null,
        seqautorizacao: null,
        tipoguia: null,
        ultimoprocautorizado: null,
        valor: null,
        vlrcusto: null,
        vlrmanual: null,
    };

    $scope.buscarLstFaturamento = function() {
        if ($scope.lstFaturamento.filter((faturamento) => faturamento.sequencia === $scope.sequencia).length == 0) {
            document.getElementById("loading").style.display = "block";
            const body = {
                coddao: 524,
                parametros: ["W8", $scope.sequencia, $scope.codprestador]
            }
            $http({
                method: "POST",
                url: "https://" + $scope.webserviceBios + "/service/V1",
                headers: {
                    "Content-Type": "application/json;charset=utf-8;",
                },
                data: JSON.stringify(body)
            }).success(function(data) {
                if (data.conteudo.length > 0) {
                    $scope.lstFaturamento.push(...data.conteudo)
                } else {
                    $scope.alerta.mensagem = "Guia não encontrada ou já faturada.";
                    $scope.alerta.complemento = "";
                    $scope.alerta.titulo = "Aviso";
                    $("#alerta").modal();
                }
                $scope.GetQtdPaginas();
                $scope.sequencia = null;
                document.getElementById("loading").style.display = "none";
            }).error(function(error) {
                document.getElementById("loading").style.display = "none";
                $scope.alerta.mensagem = "Não foi possível buscar pedido. Falha na conexão de internet ou webservice indisponível";
                $scope.alerta.complemento = "";
                $scope.alerta.titulo = "Erro";
                $("#alerta").modal();
            });
        } else {
            $scope.alerta.mensagem = "Guia já selecionada!";
            $scope.alerta.complemento = "";
            $scope.alerta.titulo = "Alerta";
            $("#alerta").modal();
        }
    }

    $scope.TotalFatura = function(LstFaturamento) {
        var soma = 0;
        for (var i = 0; i < LstFaturamento.length; i++) {
            soma = soma + $scope.somaFatura(LstFaturamento[i]);
        }
        return soma;
    };

    $scope.somaFatura = function(Faturamento) {
        var soma = 0;
        for (var i = 0; i < Faturamento.lstprocedimentos.length; i++) {
            if (!Faturamento.lstprocedimentos[i].vlrmanual) {
                if (!Faturamento.lstprocedimentos[i].qtdfaturada) {
                    if (Faturamento.lstprocedimentos[i].qtdautorizada != 999.9) {
                        const valor = Faturamento.lstprocedimentos[i].vlrcusto ? Faturamento.lstprocedimentos[i].vlrcusto : Faturamento.lstprocedimentos[i].valor;
                        soma = soma + Number(valor) * Faturamento.lstprocedimentos[i].qtdautorizada;
                    }
                } else {
                    const valor = Faturamento.lstprocedimentos[i].vlrcusto ? Faturamento.lstprocedimentos[i].vlrcusto : Faturamento.lstprocedimentos[i].valor;
                    soma = soma + Number(valor) * Faturamento.lstprocedimentos[i].qtdfaturada;
                }
            } else {
                if (Faturamento.lstprocedimentos[i].qtdfaturada === null) {
                    soma = soma + Number(Faturamento.lstprocedimentos[i].vlrmanual) * Faturamento.lstprocedimentos[i].qtdautorizada;
                } else {
                    soma = soma + Number(Faturamento.lstprocedimentos[i].vlrmanual) * Faturamento.lstprocedimentos[i].qtdfaturada;
                }
            }
        }
        return soma;
    };

    $scope.formatarNumero = function(numero) {
        var numero = numero.toFixed(2).split(".");
        numero[0] = "" + numero[0].split(/(?=(?:...)*$)/).join(".");
        return numero.join(",");
    };

    $scope.imprimirFaturamento = function() {
        localStorage.setItem("lstEnvio", $scope.lstEnvio);
        var telaimpressao = window.open("", "PRINT", "height=800,width=600");
        telaimpressao.document.write("<html><head><title>" + document.title + "</title>");
        telaimpressao.document.write("<style> table, th, td { border: 1px solid black; border-collapse: collapse; } </style>");
        telaimpressao.document.write("</head><body>");
        telaimpressao.document.write("<h3>Faturamento da Caesan</h3>");
        telaimpressao.document.write("<p>Clínica: <b>" + $scope.prestador.nomprestador + "</b><br>");
        telaimpressao.document.write("CNPJ/CPF: <b>" + $scope.prestador.identificacao + "</b></p>");
        var lst = "";
        for (var i = 0; i < $scope.lstEnvio.length; i++) {
            lst = lst + '<tr style="font-size: 12px">\n\<td style="text-align: center;">' +
                $scope.lstEnvio[i].sequencia +
                '</td>\n\<td style="text-align: center;">' +
                $scope.lstEnvio[i].nrcartao +
                '</td>\n\<td style="text-align: left;">' +
                $scope.lstEnvio[i].nombeneficiario +
                '</td>\n\<td style="text-align: right;">' +
                $scope.formatarNumero($scope.somaFatura($scope.lstEnvio[i])) +
                "</td>\n\</tr>";
        }

        var conteudo =
            '<table style="font-size: 12px; margin-top: 15px; width:100%">' +
            "<thead>" +
            '<tr style="color: #3f4d7f;">' +
            '<th style="text-align: center;">Nº da guia</th>' +
            '<th style="text-align: center;">Nº do cartão</th>' +
            '<th style="text-align: left;">Nome do beneficiário</th>' +
            '<th style="text-align: right;">Valor</th>' +
            "</tr>" +
            "</thead>" +
            "<tbody>" +
            "" +
            lst +
            "</tbody>" +
            "</table>" +
            "<h4><b>Valor total da fatura " +
            $scope.formatarNumero($scope.TotalFatura($scope.lstEnvio)) +
            "</b></h4>" +
            "<h4><b>Faturamento enviado com o Protocolo de número: __________ </b></h4>";

        telaimpressao.document.write(conteudo);
        telaimpressao.document.write("</body></html>");

        telaimpressao.document.close();
        telaimpressao.focus();

        telaimpressao.print();
        telaimpressao.close();
        return true;
    };

    $scope.ObjFaturamentoSelecionado = null;

    $scope.excluirProcedimento = function(index) {
        $scope.ObjFaturamentoSelecionado.lstprocedimentos.splice(index, 1);
    };

    $scope.AdicionarProcedimento = function() {
        $("#consultatuss").modal();
    };

    $scope.tabProcedimento = {
        codigo: null,
        termo: null,
    };

    $scope.setFaturamentoAlterado = function(index) {
        if ($scope.ObjFaturamentoSelecionado.dtpedido !== null) {
            var parts = $scope.ObjFaturamentoSelecionado.dtpedido.split("/");
            var dtAutorizacao = new Date(parts[2], parts[1] - 1, parts[0]);
            if ($scope.ObjFaturamentoSelecionado.lstprocedimentos[index].dtrealizacao >= dtAutorizacao && $scope.ObjFaturamentoSelecionado.lstprocedimentos[index].dtrealizacao <= $scope.dtAtual) {
                $scope.ObjFaturamentoSelecionado.alterado = true;
            } else {
                $scope.alerta.mensagem = "Data inválida!";
                $scope.alerta.titulo = "Erro";
                $("#alerta").modal();
            }
        } else {
            $scope.ObjFaturamentoSelecionado.alterado = true;
        }
    };

    $scope.selecionarProcedimento = function(obj) {
        $scope.objVO0543 = obj;
        $scope.objVO0543.seqautorizacao = $scope.ObjFaturamentoSelecionado.sequencia;
        $scope.ObjFaturamentoSelecionado.lstprocedimentos.push(angular.copy($scope.objVO0543));
        $scope.setFaturamentoAlterado($scope.ObjFaturamentoSelecionado.lstprocedimentos.length() - 1);
    };

    $scope.setGravarLstFaturamento = function(index) {
        for (var i = 0; i < $scope.lstFaturamento[index].lstprocedimentos.length; i++) {
            if ($scope.lstFaturamento[index].lstprocedimentos[i].dtrealizacao === null || $scope.lstFaturamento[index].lstprocedimentos[i].qtdfaturada === null || $scope.lstFaturamento[index].lstprocedimentos[i].cpfexecutante === null) {
                $scope.lstFaturamento[index].chkprocessamento = false;
            }
        }
        for (var i = 0; i < $scope.lstFaturamento.length; i++) {
            if ($scope.lstFaturamento[i].chkprocessamento) {
                $scope.bGravar = true;
            }
        }
        if ($scope.lstFaturamento[index].chkprocessamento == false) {
            $scope.alerta.mensagem = "Campos não digitados!";
            $scope.alerta.complemento = 'Os campos: "Realização", "Qtd Faturada" e "CPF Executante" são obrigatórios.';
            $scope.alerta.titulo = "Erro";
            $("#alerta").modal();
        }
    };

    $scope.procTuss = [{
            codigo: "18",
            termo: "Terminologia de diárias, taxas e gases medicinais"
        },
        {
            codigo: "19",
            termo: "Terminologia de Materiais e Órteses, Próteses e Materiais Especiais (OPME)"
        },
        {
            codigo: "20",
            termo: "TUSS - Terminologia de Medicamentos"
        },
        {
            codigo: "21",
            termo: "TUSS - Outras áreas da Saúde"
        },
        {
            codigo: "22",
            termo: "Terminologia de Procedimentos e Eventos em Saúde"
        },
        {
            codigo: "95",
            termo: "Tabela Própria Materiais"
        },
        {
            codigo: "96",
            termo: "TUSS - Tabela Própria Medicamentos"
        },
        {
            codigo: "97",
            termo: "Tabela Própria de Taxas Hospitalares"
        },
        {
            codigo: "98",
            termo: "TUSS - Tabela Própria de Pacotes Procedimentos"
        }
    ];

    $scope.todos = [];

    $scope.buscarProcedimentosTuss = function() {
        const sCodEmpresa = "W8";
        const sCodPrestador = $scope.codPrestador;
        const sCodTabela = $scope.tabProcedimento;
        const sCodProcedimento = $scope.termo;
        const sCodDAO = "462";
        const body = {
            "coddao": sCodDAO,
            "conteudo": null,
            "parametros": [sCodEmpresa, sCodPrestador, sCodTabela, sCodProcedimento],
            "hash": null
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
            $scope.alerta.mensagem = "Erro ao efetuar busca, tente novamente mais tarde!";
            $scope.alerta.titulo = "Erro";
            $("#alerta").modal();
        });
    }

    function refresh() {
        var begin = ($scope.currentPage - 1) * $scope.numPerPage;
        var end = begin + $scope.numPerPage;
        $scope.filteredTodos = $scope.todos.slice(begin, end);
        $scope.totalItems = $scope.todos.length;
    }

    $scope.totalItems = $scope.todos.length;
    $scope.filteredTodos = [];
    $scope.currentPage = 1;
    $scope.numPerPage = 5;
    $scope.maxSize = 5;

    $scope.numPages = function() {
        return Math.ceil($scope.todos.length / $scope.numPerPage);
    };

    $scope.$watch("currentPage + numPerPage", function() {
        var begin = ($scope.currentPage - 1) * $scope.numPerPage,
            end = begin + $scope.numPerPage;
        $scope.filteredTodos = $scope.todos.slice(begin, end);
    });

    $scope.lstEnvio = [];

    $scope.gravarLstFaturamento = function() {
        $scope.lstEnvio = [];
        for (var i = 0; i < $scope.lstFaturamento.length; i++) {
            for (var j = 0; j < $scope.lstFaturamento.length; j++) {
                if ($scope.lstFaturamento[j].sequencia == $scope.lstFaturamento[i].sequencia) {
                    $scope.lstFaturamento.splice(i, 1, $scope.lstFaturamento[j]);
                }
            }
        }
        for (var i = 0; i < $scope.lstFaturamento.length; i++) {
            if ($scope.lstFaturamento[i].chkprocessamento) {
                $scope.lstEnvio.push($scope.lstFaturamento[i]);
            }
        }
        $("#resumofaturamento").modal();
    };

    $scope.todasSelecionadas = false;

    $scope.selecionarTodas = function() {
        for (var i = 0; i < $scope.lstFaturamento.length; i++) {
            $scope.lstFaturamento[i].chkprocessamento = true;
            $scope.todasSelecionadas = true;
            $scope.bGravar = true;
        }
    };

    $scope.removerTodas = function() {
        for (var i = 0; i < $scope.lstFaturamento.length; i++) {
            $scope.lstFaturamento[i].chkprocessamento = false;
            $scope.todasSelecionadas = false;
            $scope.bGravar = false;
        }
    };

    $scope.enviarFaturamento = function() {
        $scope.inscricao = localStorage.getItem('inscricao');
        document.getElementById("loading").style.display = "block";
        for (var i = 0; i < $scope.lstFaturamento.length; i++) {
            $scope.lstFaturamento[i].lstarquivos = [];
        }
        // Não sei da onde vem esse $$hashKey mas ele causa problema ao converter para ArrayList
        const lstFaturamento = $scope.lstFaturamento.map((faturamento) => {
            faturamento.$$hashKey = undefined;
            return faturamento;
        });
        const body = {
            coddao: 523,
            parametros: [
                "W8",
                String($scope.inscricao),
                "",
                JSON.stringify(lstFaturamento)
                // $scope.prestador.codnaoperadora,
                // $scope.prestador.codpessoa,
            ]
        }
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            headers: {
                "Content-Type": "application/json;charset=utf-8;",
            },
            data: JSON.stringify(body)
        }).success(function(data) {
            document.getElementById("loading").style.display = "none";
            if (data.conteudo > 0) {
                $scope.alerta.mensagem = "Solicitação de faturamento enviada com sucesso!";
                $scope.alerta.complemento = "Protocolo de faturamento: " + data.conteudo;
                $scope.alerta.titulo = "Sucesso";
                $scope.limparForm();
                $("#alerta").modal();
            } else {
                $scope.alerta(data);
            }
        }).error(function(error) {
            document.getElementById("loading").style.display = "none";
            $scope.alerta(0);
        });
    };

    $scope.limparForm = function() {
        $scope.lstFaturamento = [];
    };

    $scope.alerta = function(cod) {
        if (cod > 0) {
            $scope.alerta.mensagem = "Solicitação enviada com sucesso!";
            $scope.alerta.complemento = "Ambiente de teste. A solicitação não será gravada no banco de dados.";
            $scope.alerta.titulo = "Sucesso";
        } else {
            $scope.alerta.mensagem = "Não foi possível efetuar sua solicitação.";
            $scope.alerta.complemento = "Tente novamente mais tarde!";
            $scope.alerta.titulo = "Erro";
        }
        $("#alerta").modal();
    };

    $scope.validarProcedimentos = function() {
        var gravar = true;
        for (var i = 0; i < $scope.ObjFaturamentoSelecionado.lstprocedimentos.length; i++) {
            if ($scope.ObjFaturamentoSelecionado.lstprocedimentos[i].dtrealizacao === null || $scope.ObjFaturamentoSelecionado.lstprocedimentos[i].qtdfaturada === null || $scope.ObjFaturamentoSelecionado.lstprocedimentos[i].cpfexecutante === null) {
                gravar = false;
            }
        }
        if (gravar) {
            // $scope.gravarLstAnexos();
            $scope.lstFaturamento[$scope.FaturamentoSelecionado] = $scope.ObjFaturamentoSelecionado;
            $scope.ObjFaturamentoSelecionado = null;
            $("#procedimentos").modal("hide");
        } else {
            $scope.alerta.mensagem = "Campos não digitados!";
            $scope.alerta.complemento = 'Os campos: "Realização", "Qtd Faturada" e "CPF Executante" são obrigatórios.';
            $scope.alerta.titulo = "Erro";
            $("#alerta").modal();
        }
    };

    $scope.validarArquivo = function() {
        var bretorno = true;
        if ($scope.ObjFaturamentoSelecionado.lstarquivos !== null) {
            for (var i = 0; i < $scope.ObjFaturamentoSelecionado.lstarquivos.length; i++) {
                if ($scope.ObjFaturamentoSelecionado.lstarquivos[i]) {
                    if ($scope.ObjFaturamentoSelecionado.lstarquivos[i].filesize > 5000000) {
                        $scope.ObjFaturamentoSelecionado.lstarquivos.splice(i, 1);
                        $scope.alerta.mensagem = "Tamanho de arquivo inválido!";
                        $scope.alerta.complemento = "Os arquivos não podem ter mais de 50 megas.";
                        $scope.alerta.titulo = "Erro";
                        $("#alerta").modal();
                        bretorno = false;
                    }
                }
            }
        }
        return bretorno;
    };

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
            data: strObjVO0628
        }).success(function(data) {
            $scope.procTuss = data.conteudo;
        }).error(function(error) {
            console.log(error);
        });
    };

    $scope.visualizarProcedimentos = function(index) {
        $scope.FaturamentoSelecionado = index;
        $scope.ObjFaturamentoSelecionado = angular.copy($scope.lstFaturamento[$scope.FaturamentoSelecionado]);
        $scope.listarAnexosGuia($scope.ObjFaturamentoSelecionado.sequencia);
    };

    $scope.listarAnexosGuia = function(sNrGuia) {
        const codempresa = "W8";
        const codPrestador = $scope.codprestador;
        const data = {
            coddao: 413,
            conteudo: null,
            hash: null,
            parametros: [codempresa, codPrestador, "", sNrGuia, "N"]
        };
        data.hash = calcMD5("wd@4@1&1944" + data.parametros.join("")).toString();
        document.getElementById("loading").style.display = "block";
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            headers: {
                "Content-Type": "application/json;charset=utf-8;",
            },
            data: JSON.stringify(data)
        }).then(function successCallback(response) {
            $scope.lstGuiasComAnexo = response.data.conteudo.filter((guia) => guia.codorigem === '1').map((guia) => {
                $scope.lstNomesArquivos[guia.nrguia] = guia;
                return guia.nrguia;
            });
            $scope.isEnviando = false;
            $scope.isExcluindo = false;
            $scope.isVisualizando = false;
            document.getElementById("loading").style.display = "none";
            $("#procedimentos").modal();
        }, function errorCallback(response) {
            console.log("error", response);
            document.getElementById("loading").style.display = "none";
            $("#procedimentos").modal();
        });
    };

    $scope.visualizarGuia = function(seqguia) {
        if (!$scope.lstGuiasComAnexo.includes(seqguia)) return;
        const texto = document.getElementById(`visualizar-${seqguia}`);
        const loader = document.getElementById(`loading-visualizar-${seqguia}`);
        const codorigem = "1";
        const codempresa = "W8";
        const sCodPrestador = $scope.codprestador;
        const sNomArquivo = $scope.lstNomesArquivos[seqguia].nomarquivo;
        const body = {
            coddao: 414,
            conteudo: null,
            hash: null,
            parametros: [codempresa, sCodPrestador, "", seqguia, codorigem, sNomArquivo]
        };
        // body.hash = calcMD5("wd@4@1&1944" + body.parametros.join("")).toString();
        $scope.isVisualizando = true;
        loader.style.display = "block";
        texto.style.display = "none";
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            headers: {
                "Content-Type": "application/json;charset=utf-8;",
            },
            data: JSON.stringify(body),
        }).then(function successCallback(response) {
            loader.style.display = "none";
            texto.style.display = "block";
            $scope.isVisualizando = false;
            const base64 = response.data.conteudo[0].arqbase64;
            const linkSource = `data:application/pdf;base64,${base64}`;
            const downloadLink = document.createElement("a");
            const fileName = response.data.conteudo[0].nomarquivo;
            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            downloadLink.click();
        }, function errorCallback(error) {
            console.log("error", error);
        });
    };

    $scope.prepararExclusaoAnexo = function(seqguia) {
        $("#confirma-exclusao-anexo").modal();
        $scope.candidatoExclusaoAnexo = $scope.lstNomesArquivos[seqguia];
    };

    $scope.excluirAnexo = function() {
        if ($scope.numeroGuiaExcluir !== $scope.candidatoExclusaoAnexo.nrguia) {
            $scope.exclusaoError = true;
            return;
        }
        const texto = document.getElementById(`loading-confirmar-exclusao`);
        const loader = document.getElementById(`confirmar-exclusao-text`);
        const confirmarBtn = document.getElementById("confirmar-exclusao-btn");
        $scope.isExcluindo = true;
        const guia = $scope.candidatoExclusaoAnexo;
        const codempresa = "W8";
        const sArqBase64 = "";
        const sNomArquivo = guia.nomarquivo;
        const sCodPrestador = $scope.codprestador;
        const sSeqArqTISS = "";
        const sNrGuia = guia.nrguia;
        const sCodOrigem = "1";
        const sExcluirSimNao = "S";
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
                sExcluirSimNao
            ]
        };
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(body),
        }).then(function successCallback(response) {
            $scope.listarAnexosGuia(guia.nrguia);
            $("#confirma-exclusao-anexo").modal("hide");
            $scope.numeroGuiaExcluir = '';
        }, function errorCallback(error) {
            console.log("error", error);
        });
    };

    $scope.anexarGuia = function(seqguia) {
        if (!$scope.anexo.fileguia.base64) return;
        $scope.isEnviando = true;
        const texto = document.getElementById(`enviar-${seqguia}`);
        const loader = document.getElementById(`loading-enviar-${seqguia}`);
        const codempresa = "W8";
        const sArqBase64 = $scope.anexo.fileguia.base64;
        const sNomArquivo = $scope.anexo.fileguia.filename;
        const sCodPrestador = $scope.codprestador;
        const sSeqArqTISS = "";
        const sNrGuia = seqguia;
        const sCodOrigem = "1";
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
                sExcluirSimNao
            ],
        };
        loader.style.display = "block";
        texto.style.display = "none";
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(body),
        }).then(function successCallback(response) {
            $scope.listarAnexosGuia(seqguia);
            loader.style.display = "none";
            texto.style.display = "block";
            // $scope.objRetorno.conteudo.forEach((item) => {
            //   if (item.seqarquivo === guia.seqarquivo) {
            //     item.fileguia = null;
            //   }
            // });
        }, function errorCallback(response) {
            $scope.listarAnexosGuia(seqguia);
            loader.style.display = "none";
            texto.style.display = "block";
            console.log("error", response);
        });
    };

    $scope.buscarLstTabelaProcedimentos();
});