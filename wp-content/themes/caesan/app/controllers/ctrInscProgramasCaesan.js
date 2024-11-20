/* global app, lstEventos, token, webservice, lstTreinamentos */

app.controller("InscProgramasCaesan", function($scope, $http) {
    $scope.webservice = webservice;
    $scope.webserviceBios = webserviceBios;
    $scope.environment = localStorage.getItem('environment');
    // $scope.lstEventos = lstEventos;
    $scope.lstTreinamentos = null;
    $scope.token = token;
    $scope.content = false;

    // try {
    //   $scope.token = token;
    // } catch (e) {
    //   console.log(e);
    // }

    // $scope.formatHora = function (data) {
    //   var sHoras = "";
    //   if((data != undefined) || (data != null)){
    //     sHoras = data.substring(0, 2) + ':' + data.substring(2, 5);
    //   }   
    //   return sHoras;
    // };

    // $scope.objVO0511 = {
    //   "celular": null,
    //   "chave": null,
    //   "confirmado": null,
    //   "ddd": null,
    //   "dtcadastro": null,
    //   "dtnascimento": null,
    //   "email": null,
    //   "enviadoemail": null,
    //   "fax": null,
    //   "nomacompanhante": null,
    //   "nome": null,
    //   "observacao": null,
    //   "tamcamiseta": null,
    //   "tamcamisetaacompanhante": null,
    //   "telefone": null,
    //   "treinamento": null
    // };

    // $scope.VO0510 = {
    //   cargahoraria: null,
    //   codcurso: null,
    //   curso: null,
    //   dtevento: null,
    //   dtfim: null,
    //   dtinicio: null,
    //   fonecontato: null,
    //   hrfim: null,
    //   hrinicio: null,
    //   local: null,
    //   objetivo: null,
    //   qtdmaxparticipante: null,
    //   requisitos: null,
    //   sequencia: null
    // };
    // $scope.objVO0510 = angular.copy($scope.VO0510);

    $scope.VO0511 = {
        celular: null,
        chave: null,
        confirmado: null,
        ddd: null,
        dtcadastro: null,
        dtnascimento: null,
        email: null,
        enviadoemail: null,
        fax: null,
        nomacompanhante: null,
        nome: null,
        observacao: null,
        tamcamiseta: null,
        tamcamisetaacompanhante: null,
        telefone: null,
        treinamento: 29
    };
    $scope.objVO0511 = angular.copy($scope.VO0511);

    $scope.record = function() {
        var body = JSON.stringify({
            coddao: 701,
            parametros: ["W8"],
            conteudo: JSON.parse(JSON.stringify($scope.objVO0511))
        })
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
            $('#modalAtencao').modal('show');
            $scope.modalMessage = data.conteudo;
            $scope.limparForm();
        }).error(function(error) {
            document.getElementById("loading").style.display = "none";
            $('#modalAtencao').modal('show');
            $scope.modalMessage = error.conteudo;
        });
    }


    $scope.buscarLstTreinamentos = function() {
        var strObjVO0628 = JSON.stringify({
            coddao: 700,
            parametros: ["W8"]
        });
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            headers: {
                "Content-Type": "application/json; charset=utf-8;"
            },
            data: strObjVO0628
        }).success(function(data) {
            if (data.conteudo && data.conteudo.length > 0) {
                console.log(data);
                var treinamento = data.conteudo[0];

                function formatarHora(hora) {
                    return hora.slice(0, 2) + 'h' + hora.slice(2);
                }

                $scope.VO0510 = {
                    cargahoraria: treinamento.cargahoraria,
                    codcurso: treinamento.codcurso,
                    curso: treinamento.curso,
                    dtevento: treinamento.dtevento,
                    dtfim: treinamento.dtfim,
                    dtinicio: treinamento.dtinicio,
                    fonecontato: treinamento.fonecontato,
                    hrfim: formatarHora(treinamento.hrfim),
                    hrinicio: formatarHora(treinamento.hrinicio),
                    local: treinamento.local,
                    objetivo: treinamento.objetivo,
                    qtdmaxparticipante: treinamento.qtdmaxparticipante,
                    requisitos: treinamento.requisitos,
                    sequencia: treinamento.sequencia
                };
                $scope.objVO0510 = angular.copy($scope.VO0510); // Atualiza o objeto principal
                $scope.content = true; // Exibe o conteúdo
            }
        }).error(function(error) {
            console.log(error);
        });
    };
    $scope.buscarLstTreinamentos();



    // $scope.getDadosSelecionados = function (cod) {
    //   $scope.objRetorno = [];
    //   for (var i = 0; i < $scope.lstEventos.length; i++) {
    //     if (cod == $scope.lstEventos[i].sequencia) {
    //       $scope.objRetorno = $scope.lstEventos[i];
    //       $scope.regras = $scope.objRetorno.objetivo.split('\r\n\r\n');
    //       $scope.telefones = $scope.regras[$scope.regras.length - 1].split('\r\n');
    //       $scope.regras[$scope.regras.length - 1] = "";
    //     }
    //   }
    // };

    $scope.Cadastrar = function() {
        var strObjVO0511 = JSON.stringify($scope.objVO0511);
        $http.post('http://' + $scope.webservice + '/treinamento/insctreinamento?id1=' + $scope.token, strObjVO0511).success(function(data) {
            $scope.alerta(data);
        }).error(function() {
            $scope.alerta(0);
        });
    };

    $scope.Cadastrar2 = function() {
        var strObjVO0511 = JSON.stringify($scope.objVO0511);
        $http.post('http://' + $scope.webservice + '/treinamento/insctreinamento2', strObjVO0511).success(function(data) {
            $scope.alerta(data);
        }).error(function() {
            $scope.alerta(0);
        });
    };

    $scope.limparForm = function() {
        $scope.objVO0511 = {
            "chave": null,
            "treinamento": 29,
            "ddd": null,
            "telefone": null,
            "fax": null,
            "celular": null,
            "email": null,
            "confirmado": null,
            "dtcadastro": null,
            "enviadoemail": null,
            "nome": null,
            "observacao": null,
            "tamcamiseta": null,
            "nomacompanhante": null,
            "dtnascimento": null,
            "tamcamisetaacompanhante": null
        };
    };

    $scope.gravarInscricao = function() {
        const body = {
            coddao: 701,
            parametros: ["W8"],
            conteudo: JSON.parse(JSON.stringify($scope.objVO0511))
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
            $('#modalAtencao').modal('show');
            $scope.modalMessage = data.conteudo;
            $scope.limparForm();
            // if (data.conteudo == 1) {
            //   document.getElementById("loading").style.display = "none";
            //   $('#modalSucesso').modal('show');
            //   $scope.limparForm();
            // } else {
            //   document.getElementById("loading").style.display = "none";
            //   $('#modalErro').modal('show');
            //   $scope.limparForm();
            // }
        }).error(function(error) {
            document.getElementById("loading").style.display = "none";
            $('#modalAtencao').modal('show');
            $scope.modalMessage = error.conteudo;
            // document.getElementById("loading").style.display = "none";        
            // $('#modalErro').modal('show');
        });
    };

    // }).success(function(data) {
    //   document.getElementById("loading").style.display = "none";
    //   $('#modalAtencao').modal('show');
    //   $scope.modalMessage = data.conteudo;
    //   $scope.limparForm();
    // }).error(function(error) {
    //   document.getElementById("loading").style.display = "none";        
    //   $('#modalAtencao').modal('show');
    //   $scope.modalMessage = error.conteudo;
    // });

    $scope.alerta = {
        "acao": null,
        "codigo": null,
        "icone": null,
        "link": null,
        "mensagem": null,
        "tipo": null,
        "titulo": null,
        "urllink": null
    };

    $scope.alerta = function(cod) {
        if (cod > 0) {
            $scope.alerta.titulo = 'Sucesso';
            $scope.alerta.mensagem = 'Solicitação enviada com sucesso! Aguarde o e-mail de confirmação.';
            $scope.alerta.complemento = null;
            $scope.limparForm();
        } else {
            $scope.alerta.titulo = "Erro";
            $scope.alerta.mensagem = "Não foi possível efetuar a consulta.";
            $scope.alerta.complemento = "Tente novamente mais tarde!";
        }
        $("#alerta").modal();
    };

    // $scope.buscarLstTabelaProcedimentos = function () {
    //   var strObjVO0628 = JSON.stringify({
    //     coddao: 408,
    //     parametros: ["W8"],
    //   });
    //   $http({
    //     method: "POST",
    //     url: "https://" + $scope.webserviceBios + "/service/V1",
    //     headers: {
    //       "Content-Type": "application/json;charset=utf-8;",
    //     },
    //     data: strObjVO0628,
    //   })
    //     .success(function (data) {
    //       $scope.lstProcedimentos = data.conteudo;
    //     })
    //     .error(function (error) {
    //       console.log(error);
    //     });
    // };
    // $scope.buscarLstTabelaProcedimentos();
});