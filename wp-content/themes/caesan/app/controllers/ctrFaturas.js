/* global app, service, lstFaturas, token, webservice */

app.controller("Faturas", function($scope, $http) {
    $scope.webservice = webservice;
    $scope.webserviceBios = webserviceBios;

    $scope.environment = localStorage.getItem('environment');
    // Pega a sequencia do arquivo através da URL para usar na abertura do modal
    // assim que a pagina abrir
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sSeqArquivo = urlParams.get("id1");

    $scope.numPerPage = 10;
    $scope.maxSize = 5;
    $scope.candidatoExclusaoAnexo = null;
    $scope.exclusaoError = false;
    $scope.numeroGuiaExcluir = "";
    $scope.enviandoExclusao = "";
    $scope.lstGuiasComAnexo = [];
    $scope.lstNomesArquivos = [];
    $scope.currentPageFaturas = 1;
    $scope.filteredLstFaturas = [];
    $scope.coddao = coddao;
    $scope.sTISS = sTISS;
    $scope.lstFaturas = [];
    $scope.isVisualizando = false;
    $scope.isExcluindo = false;
    $scope.isEnviando = false;
    $scope.fileguia = null;
    $scope.codprestador = localStorage.getItem("inscricao");

    // adicionado para implementar anexar guias 02/05/2022
    $scope.objRetorno = {
        codigo: null,
        conteudo: [{
            fileguia: null,
            seqguia: null,
            tipguia: null
        }],
        mensagem: {
            acao: null,
            codigo: null,
            cor: null,
            icone: null,
            link: null,
            mensagem: null,
            tipo: null,
            titulo: null,
            urllink: null,
        },
    };

    $scope.buscaLstFaturas = function() {
        const body = {
            coddao: $scope.coddao,
            parametros: [
                "W8",
                $scope.codprestador,
                $scope.sTISS
            ]
        }
        document.getElementById("loading").style.display = "block";
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            data: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(function successCallback(response) {
            $scope.lstFaturas = response.data.conteudo;
            const begin = ($scope.currentPageFaturas - 1) * $scope.numPerPage;
            const end = begin + $scope.numPerPage;
            $scope.filteredLstFaturas = $scope.lstFaturas.slice(begin, end);
            document.getElementById("loading").style.display = "none";
        }, function errorCallback(response) {
            document.getElementById("loading").style.display = "none";
            // TODO: adicionar mensagem de erro
        });
    }
    $scope.buscaLstFaturas();

    $scope.formatDate = function(refbase) {
        if (!refbase) return '';
        return refbase.slice(0, 2) + '/' + refbase.slice(2);
    };

    $scope.numPages = function() {
        return Math.ceil($scope.lstFaturas.length / $scope.numPerPage);
    };
    $scope.$watch("currentPageFaturas + numPerPage", function() {
        const begin = ($scope.currentPageFaturas - 1) * $scope.numPerPage;
        const end = begin + $scope.numPerPage;
        $scope.filteredLstFaturas = $scope.lstFaturas.slice(begin, end);
    });

    $scope.objAlerta = {
        mensagem: "",
        acao: "",
        titulo: "",
        codigo: "",
        urllink: "",
        link: ""
    }

    $scope.buscarGuiasAnexar = function(sequencia) {
        document.getElementById("loading").style.display = "block";
        var strObjVO0628 = JSON.stringify({
            coddao: 407,
            parametros: ["W8", sequencia]
        });
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            headers: {
                "Content-Type": "application/json;charset=utf-8;",
            },
            data: strObjVO0628
        }).success(function(data) {
            document.getElementById("loading").style.display = "none";
            $scope.objRetorno.conteudo = data.conteudo;
            $scope.objRetorno.codigo = sequencia;
            $("#anexarGuias").modal();

            // $scope.objAlerta = $scope.objRetorno.mensagem;
            // $scope.mensagem = $scope.objAlerta.mensagem.replaceAll("<br>", " ");
            // // Se nao tiver guias mandar mensagem de erro
            // if ($scope.objAlerta.codigo != 7) {
            //   $scope.objRetorno.mensagem.mensagem = $scope.objRetorno.mensagem.mensagem.replaceAll("\n", "<br>");
            //   var doc = document.getElementById("alerta-mensagem");
            //   doc.innerHTML = '<p id="alerta-mensagem">' + $scope.objRetorno.mensagem.mensagem + "</p>";
            // }
        }).error(function(e) {
            document.getElementById("loading").style.display = "none";
            $scope.alerta(0);
        });
    };

    $scope.limparForm = function() {
        for (var i = 0; i < $scope.objRetorno.conteudo.length; i++) {
            $scope.objRetorno.conteudo[i].fileguia = {
                base64: null,
                filename: null,
                filesize: null,
                filetype: null,
            };
        }
    };

    $scope.limparArquivoTiss = function() {
        $scope.objRetorno = {
            codigo: null,
            conteudo: [{
                fileguia: {
                    base64: null,
                    filename: null,
                    filesize: null,
                    filetype: null
                },
                seqguia: null,
                tipguia: null,
            }, ],
            mensagem: {
                acao: null,
                codigo: null,
                cor: null,
                icone: null,
                link: null,
                mensagem: null,
                tipo: null,
                titulo: null,
                urllink: null,
            },
        };
    };

    $scope.alerta = function(cod, mensagem) {
        if (cod === 0) {
            $scope.objAlerta.mensagem = "Não foi possível enviar o arquivo!";
            $scope.objAlerta.acao = "Tente novamente mais tarde!";
            $scope.objAlerta.titulo = "Erro";
            $scope.objAlerta.codigo = cod;
        } else {
            $scope.objAlerta.mensagem = mensagem;
            $scope.objAlerta.titulo = "Aviso";
            $scope.objAlerta.codigo = cod;
        }
        $("#alerta").modal("show");
        $("#alerta").css("z-index: 1500;");
    };

    $scope.listarAnexosGuia = function(sequencia) {
        const codempresa = "W8";
        const codPrestador = $scope.codprestador;
        const sNrGuia = "";
        const data = {
            coddao: 413,
            conteudo: null,
            hash: null,
            parametros: ["W8", $scope.codprestador, sequencia, "", "S"]
        };
        data.hash = calcMD5("wd@4@1&1944" + data.parametros.join("")).toString();
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            headers: {
                "Content-Type": "application/json;charset=utf-8;",
            },
            data: JSON.stringify(data)
        }).then(function successCallback(response) {
            // $scope.lstGuiasComAnexo = response.data.conteudo.map((guia) => {
            //   $scope.lstNomesArquivos[guia.nrguia] = guia.nomarquivo;
            //   return guia.nrguia;
            // });

            $scope.lstGuiasComAnexo = response.data.conteudo.map((guia) => {
                // Verifica se nrguia e nomarquivo são iguais
                if (guia.nrguia && guia.nomarquivo) {
                    // Se forem iguais, armazena o seqarqtiss
                    $scope.lstNomesArquivos[guia.nrguia] = {
                        nomarquivo: guia.nomarquivo,
                        seqarqtiss: guia.seqarqtiss
                    };
                }
                return guia.nrguia; // Retorna o número da guia para controle de anexos
            });

            $scope.isEnviando = false;
            $scope.isExcluindo = false;
            $scope.isVisualizando = false;
        }, function errorCallback(response) {
            console.log("error", response);
        });
    };

    $scope.openFileInput = function(seqguia) {
        // Simula o clique no input de arquivo escondido
        document.getElementById('file-input-' + seqguia).click();
    };

    // Método para confirmar o anexo
    $scope.confirmarAnexo = function(guia) {
        // Armazena o guia selecionado em uma variável global no escopo
        $scope.guiaSelecionado = guia;

        // Verifique se o guia já tem um valor para seqarquivo, caso contrário atribua um valor
        if (!$scope.guiaSelecionado.seqarquivo) {
            // Certifique-se de que o seqarquivo está sendo atribuído corretamente
            $scope.guiaSelecionado.seqarquivo = $scope.objRetorno.codigo || 'VALOR_PADRAO'; // Defina o valor correto aqui
        }

        // Verifica se o arquivo foi corretamente carregado
        if ($scope.guiaSelecionado.fileguia && $scope.guiaSelecionado.fileguia.filename) {
            $scope.arquivoSelecionado = $scope.guiaSelecionado.fileguia.filename;
            $('#modalConfirmarAnexo').modal('show');
        } else {
            console.error('Erro: O arquivo não foi selecionado corretamente');
        }
    };

    $scope.confirmarEnvio = function() {
        if (!$scope.guiaSelecionado || !$scope.guiaSelecionado.fileguia) {
            console.error('Erro: O objeto guia ou fileguia está indefinido.');
            return;
        }

        $('#modalConfirmarAnexo').modal('hide');

        $scope.anexarGuia($scope.guiaSelecionado);
    };

    $scope.anexarGuia = function(guia) {
        if (!guia.seqarquivo) {
            console.error('Erro: seqarquivo não está definido');
            return;
        }

        console.log('Anexando o arquivo:', guia.fileguia.filename, 'com seqarquivo:', guia.seqarquivo);

        const texto = document.getElementById(`enviar-${guia.seqguia}`);
        const loader = document.getElementById(`loading-enviar-${guia.seqguia}`);

        const body = {
            coddao: 412,
            conteudo: null,
            parametros: ["W8", guia.fileguia.base64, guia.fileguia.filename, $scope.codprestador, guia.seqarquivo, guia.seqguia, "1", "N"]
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
            $scope.listarAnexosGuia(guia.seqarquivo);
            loader.style.display = "none";
            texto.style.display = "block";

            $scope.objRetorno.conteudo.forEach((item) => {
                if (item.seqarquivo === guia.seqarquivo) {
                    item.fileguia = null;
                }
            });
            $scope.alerta(30, response.data.conteudo);
        }, function errorCallback(response) {
            console.log("error", response);
        });
    };

    /**
     * Se o número inserido no input de confirmação de exclusão for igual ao número
     * do candidatoExclusaoAnexo.seqguia envia um request para excluir o anexo
     *
     *
     * @returns Caso o número seja diferente, sai da função sem fazer nada.
     */
    $scope.excluirAnexo = function() {
        if ($scope.numeroGuiaExcluir != $scope.candidatoExclusaoAnexo.seqguia) {
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
        const sNomArquivo = $scope.lstNomesArquivos[guia.seqguia].nomarquivo;
        const sCodPrestador = $scope.codprestador;
        const sSeqArqTISS = $scope.lstNomesArquivos[guia.seqguia].seqarqtiss;
        const sNrGuia = guia.seqguia;
        const sCodOrigem = "1";
        const sExcluirSimNao = "S";
        const body = {
            coddao: 412,
            conteudo: null,
            hash: null,
            parametros: ["W8", "", sNomArquivo, $scope.codprestador, sSeqArqTISS, guia.seqguia, "1", "S"]
        };
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(body),
        }).then(function successCallback(response) {
            $scope.listarAnexosGuia(sSeqArqTISS);

            $scope.alerta(30, response.data.conteudo);
            $("#confirma-exclusao-anexo").modal("hide");
            $scope.numeroGuiaExcluir = null;
            $("#anexarGuias").modal("show");
        }, function errorCallback(error) {
            console.log("error", error);
        });
    };

    $scope.visualizarGuia = function(guia) {
        if (!$scope.lstGuiasComAnexo.includes(guia.seqguia)) return;

        const texto = document.getElementById(`visualizar-${guia.seqguia}`);
        const loader = document.getElementById(`loading-visualizar-${guia.seqguia}`);

        const sNomArquivo = $scope.lstNomesArquivos[guia.seqguia].nomarquivo;
        const seqarqtiss = $scope.lstNomesArquivos[guia.seqguia].seqarqtiss;

        const body = {
            coddao: 414,
            conteudo: null,
            parametros: ["W8", $scope.codprestador, seqarqtiss, guia.seqguia, "1", sNomArquivo],
            hash: null
        };

        // Mostra o loader
        $scope.isVisualizando = true;
        showLoader(loader, texto);

        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            headers: {
                "Content-Type": "application/json;charset=utf-8;",
            },
            data: JSON.stringify(body)
        }).then(function successCallback(response) {
            hideLoader(loader, texto);
            $scope.isVisualizando = false;

            // Processa e baixa o arquivo
            const base64 = response.data.conteudo[0].arqbase64;
            const linkSource = `data:application/pdf;base64,${base64}`;
            const downloadLink = document.createElement("a");
            const fileName = response.data.conteudo[0].nomarquivo;
            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            downloadLink.click();

        }, function errorCallback(error) {
            console.log("error", error);
            hideLoader(loader, texto);
            $scope.isVisualizando = false;
        });
    };

    /**
     * Abre o modal para confirmar exclusão de anexos e
     * atribui a guia atual ao candidatoExclusaoAnexo
     * @param {*} guia
     */
    $scope.prepararExclusaoAnexo = function(guia) {
        $("#confirma-exclusao-anexo").modal();
        $scope.candidatoExclusaoAnexo = guia;
        $scope.isExcluindo = false; // Inicializa como não excluindo
    };

    function showLoader(loader, texto) {
        loader.style.display = "block";
        texto.style.display = "none";
    }

    function hideLoader(loader, texto) {
        loader.style.display = "none";
        texto.style.display = "block";
    }

    if (sSeqArquivo) {
        $scope.buscarGuiasAnexar(String(sSeqArquivo));
    }

    $scope.gerarLinkV3 = function(lstParametros) {
        return `https://${$scope.webserviceBios}/service/V3/489/${lstParametros.join("_")}/${calcMD5("wd@4@1&1944"+lstParametros.join("")).toUpperCase()}`;
    }
});