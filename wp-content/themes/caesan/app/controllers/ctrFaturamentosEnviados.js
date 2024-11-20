/* global app, service, lstFaturamento, token, webservice, prestador, lstcodprestador,faturasenviadas */

app.controller("FaturamentosEnviados", function($scope, $http) {
    $scope.webservice = webservice;
    $scope.webserviceBios = webserviceBios;

    $scope.environment = localStorage.getItem('environment');
    $scope.codprestador = localStorage.getItem('inscricao');
    $scope.sequencia = null;
    $scope.token = token;
    $scope.FaturamentoSelecionado = {
        lstguias: []
    };
    $scope.ProcedimentoSelecionado;
    $scope.bGravar = false;
    $scope.lstFaturamento = [];
    $scope.prestador = {};
    $scope.totalFaturaSelecionada = 0;

    // $scope.QtdItensPagina = 10;
    // $scope.QtdPaginas = [];
    // $scope.inicioLstPagina;
    // $scope.fimLstPagina;
    // $scope.paginaAtual = 0;
    $scope.dtAtual = new Date;

    $scope.currentPageFaturamentos = 1;
    $scope.lstFaturamentosFiltrada = [];
    $scope.itemsPerPage = 10;
    $scope.maxSize = 5;

    $scope.$watch("currentPageFaturamentos + itemsPerPage", function() {
        const begin = ($scope.currentPageFaturamentos - 1) * $scope.itemsPerPage;
        const end = begin + $scope.itemsPerPage;
        $scope.lstFaturamentosFiltrada = $scope.lstFaturamento.slice(begin, end);
    });

    $scope.buscaPrestador = function() {
        const body = {
            coddao: 571,
            parametros: ["W8", $scope.codprestador]
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
            $scope.prestador = response.data.conteudo;
        }, function errorCallback(error) {
            document.getElementById("loading").style.display = "none";
        });
    }
    $scope.buscaPrestador();

    $scope.buscaFaturamentos = function() {
        const body = {
            coddao: 521,
            parametros: ["W8", $scope.codprestador]
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
            $scope.lstFaturamento = response.data.conteudo;
            const begin = ($scope.currentPageFaturamentos - 1) * $scope.itemsPerPage;
            const end = begin + $scope.itemsPerPage;
            $scope.lstFaturamentosFiltrada = $scope.lstFaturamento.slice(begin, end);
        }, function errorCallback(error) {
            document.getElementById("loading").style.display = "none";
        });
    }
    $scope.buscaFaturamentos();

    // $scope.GetQtdPaginas = function () {
    //   $scope.QtdPaginas = [];
    //   var auxQtdPaginas = ($scope.lstFaturamento.length / $scope.QtdItensPagina);

    //   for (var i = 0; i < auxQtdPaginas; i++) {
    //     $scope.QtdPaginas.push(i + 1);
    //   }
    // };

    // $scope.InicioLstGuias = function () {
    //   $scope.paginaAtual = 0;
    //   $scope.irPaginaLstGuias($scope.paginaAtual);
    // };

    // $scope.AnteriorLstGuias = function () {
    //   if ($scope.paginaAtual > 0) {
    //     $scope.paginaAtual = $scope.paginaAtual - 1;
    //   }
    //   $scope.irPaginaLstGuias($scope.paginaAtual);
    // };

    // $scope.irPaginaLstGuias = function (pagina) {
    //   $scope.paginaAtual = pagina;
    //   var qtd = pagina * 10;
    //   $scope.inicioLstPagina = qtd;
    //   $scope.fimLstPagina = $scope.inicioLstPagina + $scope.QtdItensPagina;
    // };

    // $scope.ProximoLstGuias = function () {
    //   if ($scope.paginaAtual < ($scope.QtdPaginas.length - 1)) {
    //     $scope.paginaAtual = $scope.paginaAtual + 1;
    //   }
    //   $scope.irPaginaLstGuias($scope.paginaAtual);
    // };

    // $scope.FimLstGuias = function () {
    //   $scope.paginaAtual = $scope.QtdPaginas.length - 1;
    //   $scope.irPaginaLstGuias($scope.paginaAtual);
    // };

    // $scope.InicioLstGuias();

    // $scope.GetQtdPaginas();

    $scope.GetFaturamento = function(seqfaturamento) {
        const body = {
            coddao: 522,
            parametros: ["W8", $scope.codprestador, seqfaturamento]
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
            document.getElementById('loading').style.display = "none";
            $scope.FaturamentoSelecionado = response.data.conteudo;
            $scope.TotalFatura($scope.FaturamentoSelecionado.lstguias)
            $("#resumofaturamento").modal();
        }, function errorCallback(error) {
            document.getElementById("loading").style.display = "none";
        });
    }

    $scope.imprimirFaturamento = function() {
        var telaimpressao = window.open('', 'PRINT', 'height=800,width=600');

        telaimpressao.document.write('<html><head><title>' + document.title + '</title>');
        telaimpressao.document.write('<style> table, th, td { border: 1px solid black; border-collapse: collapse; } </style>');
        telaimpressao.document.write('</head><body>');
        telaimpressao.document.write('<h3>Faturamento da Caesan</h3>');
        telaimpressao.document.write('<p>Clínica: <b>' + $scope.prestador.nomprestador + '</b><br>');
        telaimpressao.document.write('CNPJ/CPF: <b>' + $scope.prestador.identificacao + '</b></p>');
        var lst = '';
        for (var i = 0; i < $scope.FaturamentoSelecionado.lstguias.length; i++) {
            lst = lst + '<tr style="font-size: 12px">\n\
        <td style="text-align: center;">' + $scope.FaturamentoSelecionado.lstguias[i].nrguia + '</td>\n\
        <td style="text-align: center;">' + $scope.FaturamentoSelecionado.lstguias[i].nrcartao + '</td>\n\
        <td style="text-align: left;">' + $scope.FaturamentoSelecionado.lstguias[i].nombeneficiario + '</td>\n\
        <td style="text-align: right;">' + $scope.formatarNumero($scope.FaturamentoSelecionado.lstguias[i].vlrguia) + '</td>\n\
      </tr>';
        }

        var conteudo = '<table style="font-size: 12px; margin-top: 15px; width:100%">' +
            '<thead>' +
            '<tr style="color: #3f4d7f;">' +
            '<th style="text-align: center;">Nº da guia</th>' +
            '<th style="text-align: center;">Nº do cartão</th>' +
            '<th style="text-align: left;">Nome do beneficiário</th>' +
            '<th style="text-align: right;">Valor</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>' +
            '' + lst +
            '</tbody>' +
            '</table>' +
            '<h4><b>Valor total da fatura ' + $scope.totalFaturaSelecionada + '</b></h4>' +
            '<h4><b>Faturamento enviado com o Protocolo de número: __________ </b></h4>';

        telaimpressao.document.write(conteudo);
        telaimpressao.document.write('</body></html>');

        telaimpressao.document.close();
        telaimpressao.focus();

        telaimpressao.print();
        telaimpressao.close();
        return true;
    };

    $scope.TotalFatura = function(LstFaturamento) {
        $scope.totalFaturaSelecionada = 0;
        for (var i = 0; i < LstFaturamento.length; i++) {
            $scope.totalFaturaSelecionada += LstFaturamento[i].vlrguia;
        }
        return $scope.totalFaturaSelecionada;
    };

    $scope.formatarNumero = function(numero) {
        var numero = numero.toFixed(2).split('.');
        numero[0] = "" + numero[0].split(/(?=(?:...)*$)/).join('.');
        return numero.join(',');
    };

    $scope.ObjFaturamentoSelecionado = null;

    $scope.alerta = function(cod) {
        if (cod > 0) {
            $scope.alerta.mensagem = 'Solicitação enviada com sucesso!';
            $scope.alerta.complemento = 'Ambiente de teste. A solicitação não será gravada no banco de dados.';
            $scope.alerta.titulo = 'Sucesso';
        } else {
            $scope.alerta.mensagem = "Não foi possível efetuar sua solicitação.";
            $scope.alerta.complemento = "Tente novamente mais tarde!";
            $scope.alerta.titulo = "Erro";
        }
        $("#alerta").modal();
    };
});