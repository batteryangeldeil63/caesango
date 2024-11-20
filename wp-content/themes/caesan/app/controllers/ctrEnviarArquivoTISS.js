/* global app, token, webservice */

app.controller("EnviarArquivoTiss", function($scope, $http) {
    $scope.webservice = webservice;
    $scope.webserviceBios = webserviceBios;

    $scope.environment = localStorage.getItem('environment');
    $scope.token = token;

    $scope.arquivosParaAnexar = [];

    $scope.lstArquivos;
    $scope.objAlerta = {
        acao: null,
        codigo: null,
        cor: null,
        icone: null,
        link: null,
        mensagem: null,
        tipo: null,
        titulo: null,
        urllink: null
    };

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
            urllink: null
        }
    };

    // function checkFileSize() {
    //   var input = document.getElementById('mensagemtiss');
    //   var file = input.files[0];
    //   var maxSize = 20 * 1024 * 1024;

    //   if (file && file.size <= maxSize) {
    //     document.getElementById('enviarButton').disabled = false;
    //   } else {
    //     alert('Por favor, selecione um arquivo de até 20 MB.');
    //     input.value = '';
    //     document.getElementById('enviarButton').disabled = true;
    //   }
    // }

    // checkFileSize();

    $scope.enviarArquivoTISS = async function() {
        document.getElementById("loading").style.display = "block";
        var file = document.getElementById("mensagemtiss").files[0];
        const sXML = await file.text();
        const sJSON = JSON.stringify({
            coddao: 482,
            parametros: ["W8", $scope.token, file.name, sXML],
        });
        const containerRetorno = document.querySelector("#container-retorno");
        containerRetorno.style.display = 'none';
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            headers: {
                "Content-Type": "application/json;charset=utf-8;",
            },
            data: sJSON
        }).success(function(data) {
            document.getElementById("loading").style.display = "none";
            $scope.objRetorno = data.conteudo;
            $scope.objAlerta = $scope.objRetorno.mensagem;
            $scope.mensagem = $scope.objAlerta.mensagem.replaceAll("<br>", " ");
            if ($scope.objAlerta.codigo != 7) {
                $scope.objRetorno.mensagem.mensagem = $scope.objRetorno.mensagem.mensagem.replaceAll("\n", "<br>");
                var doc = document.getElementById("alerta-mensagem");
                doc.innerHTML = '<p id="alerta-mensagem">' + $scope.objRetorno.mensagem.mensagem + "</p>";
                $("#alerta").modal();
            } else {
                if ($scope.objRetorno.codigo) { // Centraliza a pagina no container-retorno
                    const containerRetorno = document.querySelector("#container-retorno");
                    containerRetorno.style.display = 'block';
                    window.scrollTo(0, (containerRetorno.getBoundingClientRect().top + window.scrollY) / 2);
                }
            }
        }).error(function(error) {
            var doc = document.getElementById("alerta-mensagem");
            $scope.objAlerta.titulo = "Erro";
            doc.innerHTML = '<p id="alerta-mensagem">Não foi possível enviar o arquivo XML, entre em contato com o suporte técnico para obter mais informações.</p>';
            $("#alerta").modal();
            document.getElementById("loading").style.display = "none";
        });
    }

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
                    filetype: null,
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


    $scope.alerta = function(cod) {
        $scope.objAlerta.mensagem.mensagem = "Não foi possível enviar o arquivo!";
        $scope.objAlerta.mensagem.acao = "Tente novamente mais tarde!";
        $scope.objAlerta.mensagem.titulo = "Erro";
        $scope.objAlerta.mensagem.codigo = cod;
        $("#alerta").modal();
    };

    $scope.abrirPaginaAnexarGuias = function() {
        window.open(`http://www.caesan.com.br/faturas-recebidas/?id1=${$scope.objRetorno.codigo}`, '_blank').focus();
    }

});