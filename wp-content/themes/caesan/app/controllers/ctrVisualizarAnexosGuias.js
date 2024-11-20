/* global app, webservice */

app.controller("ctrVisualizarAnexosGuias", function($scope, $http) {
    $scope.webservice = webservice;
    $scope.webserviceBios = webserviceBios;
    $scope.environment = localStorage.getItem('environment')
    $scope.isCarregando = false;
    $scope.isExcluindo = false;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    $scope.sCodPrestador = urlParams.get("id1");
    $scope.sNrGuia = urlParams.get("id2");
    $scope.sSeqArquivo = urlParams.get("id3");
    $scope.sPrestadorSN = urlParams.get("id4");
    $scope.lstAnexos = [];
    $scope.codOrigem = "";
    $scope.candidatoExclusaoAnexo = null;
    $scope.numeroAnexoExcluir = null;
    $scope.exclusaoError = false;
    $scope.nrGuiaResultadoBusca = null;
    $scope.nomArquivoResultadoBusca = null;
    $scope.codOrigemResultadoBusca = null;
    $scope.resultadoEnvioAnexos = [];
    $scope.arquivoFaturamento = [];
    $scope.arquivosParaAnexar = [];
    $scope.nomeOrigem = {
        1: "Faturamento",
        2: "Laudo",
        3: "Parecer Interno"
    };
    $scope.exibirConteudo = false;
    $scope.exibirParagrafo = true;

    $scope.mostrarConteudo = function() {
        $scope.exibirConteudo = true;
        $scope.exibirParagrafo = false;
    };

    $scope.cancelar = function() {
        $scope.exibirConteudo = false;
        $scope.exibirParagrafo = true;
    };

    $scope.buscarLstAnexos = function() {
        const pageLoader = document.querySelectorAll(
            '[data-selector="page-loader"]'
        );
        const mainContainer = document.querySelectorAll(
            '[data-selector="main-container"]'
        );
        const codcopia = "W8";
        const body = {
            coddao: 413,
            conteudo: null,
            parametros: [
                codcopia,
                $scope.sCodPrestador,
                $scope.sSeqArquivo,
                $scope.sNrGuia,
                $scope.sPrestadorSN
            ],
            hash: null,
        };
        body.hash = calcMD5("wd@4@1&1944" + body.parametros.join("")).toString();
        $scope.isCarregando = true;
        console.log($scope.sSeqArquivo);
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            headers: {
                "Content-Type": "application/json;charset=utf-8;",
            },
            data: JSON.stringify(body),
        }).success(function(response) {
            $scope.lstAnexos = response.conteudo;
            // if ($scope.lstAnexos && $scope.lstAnexos.length > 0) {
            //   $scope.nrGuiaResultadoBusca = $scope.lstAnexos[0].nrguia;
            //   $scope.nomArquivoResultadoBusca = $scope.lstAnexos[0].nomarquivo;
            //   $scope.codOrigemResultadoBusca = $scope.lstAnexos[0].codorigem;
            // } else {
            //   $scope.nrGuiaResultadoBusca = null;
            //   $scope.nomArquivoResultadoBusca = null;
            //   $scope.codOrigemResultadoBusca = null;
            // }
            $scope.isCarregando = false;
            $scope.mudarDisplay(mainContainer, 1);
            $scope.mudarDisplay(pageLoader, 0);
        }).error(function(error) {
            $scope.isCarregando = false;
            $scope.mudarDisplay(mainContainer, 1);
            $scope.mudarDisplay(pageLoader, 0);
            console.log("error", error);
        });
    };

    $scope.buscarLstAnexos();
    $scope.escolherArquivosAnexar = function() {
        $("#escolher-arquivos-anexar").modal();
    };

    $scope.prepararEnvioAnexos = function() {
        if ($scope.codOrigem === "1") {
            $scope.arquivosParaAnexar.push($scope.arquivoFaturamento);
        }
        $("#confirmar-envio-anexos").modal();
    };

    $scope.prepararExclusaoAnexo = function(anexo) {
        $scope.candidatoExclusaoAnexo = anexo;
        $scope.codOrigemResultadoBusca = anexo.codorigem;
        // $("#confirma-exclusao-anexo").modal();
        // $("#excluir").modal();
    };

    $scope.removerArquivo = function(arqRemover) {
        $scope.arquivosParaAnexar = $scope.arquivosParaAnexar.filter(
            (arquivo) => arquivo.filename != arqRemover.filename
        );
        if ($scope.arquivosParaAnexar.length === 0) {
            $scope.limparInput();
            $("#confirmar-envio-anexos").modal("hide");
        }
    };

    $scope.limparInput = function() {
        $scope.arquivosParaAnexar = [];
        $scope.arquivoFaturamento = [];
    };

    // Metodo para impedir responder todo arquivo como PDF
    $scope.verificarTipoArquivo = function verificarTipo(base64) {

        const tiposArquivos = {
            "/9j/": "image/jpeg",
            "iVBOR": "image/png",
            "JVBER": "application/pdf",
            "UEsDBB": "application/zip"
        }
        for (let i in tiposArquivos) {
            if (base64.startsWith(i)) return tiposArquivos[i];
        }
        return "application/pdf";
    }

    //======================================================

    $scope.visualizarAnexo = function(anexo, index) {
        if (!anexo) return;
        const texto = document.querySelectorAll(
            `[data-selector="visualizar-anexo-texto-${index}"]`
        );
        const loader = document.querySelectorAll(
            `[data-selector="visualizar-anexo-loader-${index}"]`
        );
        const sCodOrigem = anexo.codorigem;
        const codcopia = "W8";
        const sCodPrestador = $scope.sCodPrestador;
        const sSeqArqTISS = anexo.seqarqtiss ? anexo.seqarqtiss : "";
        const sNrGuia = anexo.nrguia;
        const sNomArquivo = anexo.nomarquivo;
        const body = {
            coddao: 414,
            conteudo: null,
            hash: null,
            parametros: [
                codcopia,
                sCodPrestador,
                sSeqArqTISS,
                sNrGuia,
                sCodOrigem,
                sNomArquivo,
            ],
        };
        // body.hash = calcMD5("wd@4@1&1944" + body.parametros.join("")).toString();
        $scope.isCarregando = true;
        $scope.mudarDisplay(texto, 0);
        $scope.mudarDisplay(loader, 1);
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            headers: {
                "Content-Type": "application/json;charset=utf-8;",
            },
            data: JSON.stringify(body),
        }).then(
            function successCallback(response) {
                $scope.mudarDisplay(texto, 1);
                $scope.mudarDisplay(loader, 0);
                $scope.isCarregando = false;
                const base64 = response.data.conteudo[0].arqbase64;
                const tipo = $scope.verificarTipoArquivo(base64.substring(0, 10));
                //const linkSource = `data:application/pdf;base64,${base64}`;
                const linkSource = `data:${tipo};base64,${base64}`;
                const downloadLink = document.createElement("a");
                const fileName = response.data.conteudo[0].nomarquivo;
                downloadLink.href = linkSource;
                downloadLink.download = fileName;
                downloadLink.click();
            },
            function errorCallback(error) {
                $scope.mudarDisplay(texto, 1);
                $scope.mudarDisplay(loader, 0);
                $scope.isCarregando = false;
                console.log("error", error);
            }
        );
    };



    $scope.exclusao = function(numeroGuia) {
        const codcopia = "W8";
        const sArqBase64 = "";
        //const sSeqArqTISS = $scope.sSeqArqTISS !== 0 ? $scope.sSeqArqTISS : "";
        const sSeqArqTISS = ($scope.sSeqArqTISS !== 0 && typeof $scope.sSeqArqTISS !== 'undefined') ? $scope.sSeqArqTISS : "";
        const sExcluirSimNao = 'S';
        const body = {
            coddao: 412,
            conteudo: null,
            hash: null,
            parametros: [
                codcopia,
                sArqBase64,
                $scope.nomArquivoResultadoBusca,
                $scope.sCodPrestador,
                sSeqArqTISS,
                numeroGuia,
                $scope.codOrigemResultadoBusca,
                sExcluirSimNao
            ]
        }
        console.log(body); //REMOVER
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(body),
        })
        /*
             .success(function (response) {
               console.log(response);
               $scope.buscarLstAnexos();
             }).error(function (error) {});
             */
    }

    // --------------------------------- NOVO METODO ------------------- //
    $scope.excluirAnexo_ = function(index) { // #2 index nulo
        var anexo = $scope.candidatoExclusaoAnexo;
        $scope.nomArquivoResultadoBusca = anexo.nomarquivo;

        if (anexo && anexo.nrguia && ($scope.numeroGuiaUsuario === anexo.nrguia)) {
            $scope.exclusao(anexo.nrguia);
            $("#excluir").modal("hide");
        } else {
            console.log("Anexo inválido ou número da guia não encontrado.");
        }
    };

    // -------------------------------------------------------------------//
    /*                                               // METODO ANTIGO {Desativado pois apresenta redundancia de variaveis}
        $scope.excluirAnexo = function(index) { 
        console.log("Número da guia armazenado:", $scope.nrGuiaResultadoBusca);
        console.log("Número da guia inserido:", $scope.numeroGuiaUsuario);
        console.log("Lista de Anexos:", $scope.lstAnexos);
    //    console.log("Índice do Anexo:", index);
        var anexo = $scope.lstAnexos[index]; 
        console.log("Anexo:", anexo);
        console.log("candidato Exclusao: "); console.log($scope.candidatoExclusaoAnexo);
        console.log($scope.candidatoExclusaoAnexo.nrguia);
        $scope.nomArquivoResultadoBusca = $scope.candidatoExclusaoAnexo.nomarquivo;
    		console.log($scope.nomArquivoResultadoBusca);
        if (anexo && anexo.nrguia) {
            var numeroGuiaAnexo = anexo.nrguia;

            if ($scope.numeroGuiaUsuario === numeroGuiaAnexo) {
                console.log("Os números da guia são iguais!");
                $scope.numeroGuiaInvalido = false;
                // Chame sua função de exclusão passando o número da guia correta
                $scope.exclusao(numeroGuiaAnexo);
                $("#excluir").modal("hide");
            } else {
                console.log("Os números da guia são diferentes.");
                $scope.numeroGuiaInvalido = true;
            }
        } else {
            console.log("Anexo inválido ou número da guia não encontrado.");
            // Lógica para lidar com anexo inválido ou número de guia ausente
        }
      };
    */

    $scope.anexarGuias = function() {
        if ($scope.arquivosParaAnexar.length === 0) return;
        $scope.isEnviando = true;
        const bodies = $scope.arquivosParaAnexar.map((arquivo) => {
            const codempresa = "W8";
            const sArqBase64 = arquivo.base64;
            const sNomArquivo = arquivo.filename;
            const sCodPrestador = $scope.sCodPrestador;
            const sSeqArqTISS = $scope.sSeqArqTISS ? $scope.sSeqArqTISS : "";
            const sNrGuia = $scope.sNrGuia;
            const sCodOrigem = $scope.codOrigem;
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
            return body;
        });
        bodies.forEach((body, index) => {
            $http({
                method: "POST",
                url: "https://" + $scope.webserviceBios + "/service/V1",
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify(body),
            }).then(function successCallback(response) {
                let mensagem = "";
                if (response.data.conteudo === "Já existe arquivo anexado para esse ARQUIVO/GUIA." && $scope.codOrigem === "1") {
                    mensagem = 'Já existe um anexo da origem "Faturamento" e pode haver apenas um anexo dessa origem por guia.';
                } else if (response.data.conteudo === "Já existe arquivo anexado para esse ARQUIVO/GUIA.") {
                    mensagem = "Já existe arquivo anexado nessa guia com esse nome";
                } else {
                    mensagem = "Arquivo anexado com sucesso";
                }
                $scope.resultadoEnvioAnexos.push({
                    nomearquivo: body.parametros[2],
                    mensagem: mensagem,
                });
                if (index === bodies.length - 1) {
                    $scope.isEnviando = false;
                    $("#alerta2").modal();
                }
                $scope.buscarLstAnexos();
            }, function errorCallback(response) {
                $scope.resultadoEnvioAnexos.push({
                    nomearquivo: body.parametros[2],
                    mensagem: "Falha ao enviar o anexo",
                });
                if (index === bodies.length - 1) {
                    $scope.isEnviando = false;
                    $("#alerta2").modal();
                }
            });
        });
    };

    $scope.mudarDisplay = function(lstElementos, state) {
        lstElementos.forEach((elemento) => {
            if (state === 0) {
                elemento.style.display = "none";
            }
            if (state === 1) {
                elemento.style.display = "unset";
            }
        });
    };

    $scope.fecharResultadoEnvio = function() {
        $scope.buscarLstAnexos();
        $scope.resultadoEnvioAnexos = [];
        $("#confirmar-envio-anexos").modal("hide");
        $("#alerta2").modal("hide");
        $scope.limparInput();
    };
});