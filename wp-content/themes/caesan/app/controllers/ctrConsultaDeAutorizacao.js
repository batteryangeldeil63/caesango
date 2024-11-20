/* global app, service, lstSolicitacoesAutorizadas, token, webservice, tagpag */

app.controller("ConsultaDeAutorizacao", function($scope, $http) {
    $scope.webservice = webservice;
    $scope.webserviceBios = webserviceBios;
    $scope.environment = localStorage.getItem('environment');
    $scope.codprestador = localStorage.getItem("inscricao");
    $scope.codperfil = localStorage.getItem('codperfil');
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    $scope.id1 = urlParams.get("id1");
    $scope.id2 = urlParams.get("id2");
    $scope.urlform = 'http://form.caesan.com.br';
    $scope.token = token;
    $scope.Autorizacao = null;
    $scope.tagpag = tagpag;
    $scope.lstRelatorios = ['', 'rsadt?pedido=', 'RelatorioPDF?codrel=5', 'ng-click="getDadosSolicitacao(', 'RelatorioPDF?codrel=7', 'RelatorioPDF?codrel=8', 'RelatorioPDF?codrel=9', 'RelatorioPDF?codrel=10'];
    $scope.procTuss = [{
            "codigo": "18",
            "termo": "Terminologia de diárias, taxas e gases medicinais"
        },
        {
            "codigo": "21",
            "termo": "TUSS - Outras áreas da Saúde"
        },
        {
            "codigo": "22",
            "termo": "Terminologia de Procedimentos e Eventos em Saúde"
        },
        {
            "codigo": "95",
            "termo": "Tabela Própria Materiais"
        },
        {
            "codigo": "96",
            "termo": "TUSS - Tabela Própria Medicamentos"
        },
        {
            "codigo": "97",
            "termo": "Tabela Própria de Taxas Hospitalares"
        },
        {
            "codigo": "98",
            "termo": "TUSS - Tabela Própria de Pacotes Procedimentos"
        }
    ];

    $scope.procSolicitados = [1, 2, 3, 4, 5];

    $scope.nomTabelaTuss = function(codtabela) {
        var nomTabela = "";
        for (i = 0; i < $scope.procTuss.length; i++) {
            if ($scope.procTuss[i].codigo == codtabela) {
                nomTabela = $scope.procTuss[i].termo;
            }
        }
        return nomTabela;
    };

    $scope.imprimirGuia = function() {
        if ($scope.Autorizacao.sequencia !== 0) {
            const lstCodRel = {
                1: '412',
                2: '413',
                3: '396',
                4: '397'
            }
            const lstParametros = ['W8', lstCodRel[$scope.Autorizacao.tipoguia], $scope.nrpedido, $scope.codprestador];
            // const url=`https://wsbios1.sa-east-1.elasticbeanstalk.com/service/V3/489/${lstParametros.join('_')}/${calcMD5("wd@4@1&1944"+lstParametros.join('')).toString()}`
            const url = `https://ws1.bios.inf.br/service/V3/489/${lstParametros.join('_')}/${calcMD5("wd@4@1&1944"+lstParametros.join('')).toString()}`
            window.open(url, "_blank");
        } else {
            $scope.alerta(2);
        }
    }

    $scope.modalConsultaDeAutorizacao = function() {
        if (!$scope.gconsulta) {
            $('#consultaDeAutorizacao').modal('show');
        }
    }

    $scope.gconsulta = false;

    $scope.getConsultaDeAutorizacao = function() {
        try {
            $scope.gconsulta = document.getElementById("gconsulta").checked;
        } catch (err) {
            $scope.gconsulta = false;
        }
        if (!$scope.gconsulta) {
            document.getElementById('loading').style.display = "block";
            const body = {
                coddao: 490,
                conteudo: null,
                parametros: ["W8", $scope.nrpedido, $scope.codprestador ? $scope.codprestador : ""]
            }
            document.getElementById("loading").style.display = "block";

            $http({
                method: "POST",
                url: "https://" + $scope.webserviceBios + "/service/V1",
                headers: {
                    "Content-Type": "application/json;charset=utf-8;",
                },
                data: JSON.stringify(body)
            }).success(function(data) {
                document.getElementById('loading').style.display = "none";
                if (!data.conteudo) {
                    $scope.alerta(5, $scope.nrpedido);
                    return;
                }
                $scope.Autorizacao = data.conteudo;
                if ($scope.tagpag == 0) {
                    $scope.modalConsultaDeAutorizacao();
                }
            }).error(function(error) {
                document.getElementById('loading').style.display = "none";
                $scope.alerta();
            });
        } else {
            document.getElementById('loading').style.display = "block";
            const body = {
                coddao: 488,
                conteudo: null,
                parametros: [
                    "W8",
                    $scope.nrpedido,
                    $scope.codprestador,
                ]
            }
            document.getElementById("loading").style.display = "block";
            $http({
                method: "POST",
                url: "https://" + $scope.webserviceBios + "/service/V1",
                headers: {
                    "Content-Type": "application/json;charset=utf-8;",
                },
                data: JSON.stringify(body)
            }).success(function(data) {
                document.getElementById('loading').style.display = "none";
                if (!data.conteudo) {
                    $scope.alerta(5, $scope.nrpedido);
                    return;
                }
                $scope.objVO0411 = data.conteudo;
                $('#impressaoSolGuiaExame').modal('show');
            }).error(function(error) {
                document.getElementById('loading').style.display = "none";
                $scope.alerta();
            });
        }
    };

    $scope.excluirConsultaDeAutorizacao = function() {
        var gconsulta;
        try {
            gconsulta = document.getElementById("gconsulta").checked;
        } catch (err) {
            gconsulta = false;
        }
        var tipo = $scope.tipo;
        if (gconsulta) {
            tipo = 2;
        }
        const codusuario = $scope.codperfil + $scope.codprestador;
        const body = {
            coddao: 563,
            parametros: ["W8", $scope.nrpedido, codusuario, tipo]
        }

        $('#consultaDeAutorizacao').modal('hide');
        document.getElementById("loading").style.display = "block";
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(body)
        }).then(
            function successCallback(response) {
                document.getElementById("loading").style.display = "none";
                if (!response.data.conteudo) { // Erro
                    $scope.alerta(4);
                    return;
                }
                $scope.alerta(3);
            },
            function errorCallback(error) {
                $scope.alerta(4);
                document.getElementById("loading").style.display = "none";
            }
        );
    }

    $scope.imprimir = function() {
        window.print();
    };

    $scope.alerta = function(cod, mensagem) {
        if (cod === 1) {
            $scope.alerta.mensagem = ['Solicitação enviada com sucesso!'];
            $scope.alerta.complemento = [];
            $scope.alerta.titulo = 'Sucesso';
            $scope.limparForm();
        } else if (cod === 2) {
            $scope.alerta.mensagem = ["Nenhum registro encontrado para esta autorização."];
            $scope.alerta.complemento = ["Verifique o número e tente novamente!"];
            $scope.alerta.titulo = 'Não encontrado';
        } else if (cod === 3) {
            $scope.alerta.mensagem = ["Exclusão realizada com sucesso!"];
            $scope.alerta.complemento = [];
            $scope.alerta.titulo = 'Sucesso';
        } else if (cod === 4) {
            $scope.alerta.mensagem = ["Não foi possível realizar a exclusão."];
            $scope.alerta.complemento = ["Caso o problema persista, entre em contato."];
            $scope.alerta.titulo = 'Erro';
        } else if (cod === 5) {
            $scope.alerta.mensagem = [`Guia ${mensagem} não encontrada`];
            $scope.alerta.complemento = ["A guia informada não existe ou não faz parte das guias gravadas pelo prestador logado.", "Digite um número de GUIA diferente e tente novamente."];
            $scope.alerta.titulo = 'Erro';
        } else {
            $scope.alerta.mensagem = ["Não foi possível efetuar a consulta."];
            $scope.alerta.complemento = ["Tente novamente mais tarde!"];
            $scope.alerta.titulo = "Erro";
        }
        $("#alerta").modal();
    };

    if ($scope.id1 && $scope.id2) {
        const checkbox = document.getElementById("gconsulta");
        if (checkbox) {
            $scope.tipo = 1;
            checkbox.checked = true;
            $scope.nrpedido = Number($scope.id1);
            $scope.codprestador = $scope.id2;
            $scope.getConsultaDeAutorizacao();
        }
    }
});