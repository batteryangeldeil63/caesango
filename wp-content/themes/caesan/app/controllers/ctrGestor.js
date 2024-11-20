/* global app, token, webservice */

app.controller("ctrGestor", function($scope, $http) {
    $scope.webservice = webservice;
    $scope.webserviceBios = webserviceBios;

    $scope.environment = localStorage.getItem('environment');
    $scope.token = token;
    $scope.guia = null;
    $scope.statusAtual = 0;
    $scope.ativo = "";
    $scope.lstVO0623 = [];
    $scope.selecionado = null;
    $scope.lstVO0618 = [];
    $scope.referenciadespesas = null;
    $scope.codigodespesas = null;
    $scope.objVO0732 = null;
    $scope.lstVO0734 = [];
    $scope.codprocedimento = null;
    $scope.referenciamovimentacao = null;

    $scope.menu = [{
            codigo: 0,
            titulo: "Bem vindo ao portal do Gestor",
            perfil: null
        },
        {
            codigo: 1,
            titulo: "Consulta Beneficiários",
            perfil: null
        },
        {
            codigo: 2,
            titulo: "Receitas",
            perfil: "G"
        },
        {
            codigo: 3,
            titulo: "Quantidade e Despesas Assistencias",
            perfil: "G"
        },
        {
            codigo: 4,
            titulo: "Atendimento Assistencial",
            perfil: "G"
        },
        {
            codigo: 5,
            titulo: "Movimentação de Beneficiários",
            perfil: "G"
        },
    ];

    $scope.planos = [{
            codigo: 1,
            descricao: "Ativos Enfermaria"
        },
        {
            codigo: 2,
            descricao: "Ativos Apartamento"
        },
        {
            codigo: 3,
            descricao: "Aposentados Enfermaria"
        },
        {
            codigo: 4,
            descricao: "Aposentados Apartamento"
        },
        {
            codigo: 5,
            descricao: "Agregados Enfermaria"
        },
        {
            codigo: 6,
            descricao: "Agregados Apartamento"
        },
    ];

    $scope.procTuss = [];

    //{"codigo": 5, "titulo": "Atendimento Beneficiário", "perfil": "C"}

    $scope.ReceitaXDespesa = {
        titulo: null,
        head: null,
        lstItens: [],
        footer: null,
    };
    $scope.lstReceitaXDespesa = [];

    $scope.getReceitaXDespesa = function() {
        $scope.lstReceitaXDespesa = [];
        document.getElementById("loading").style.display = "block";
        const body = {
            coddao: 527,
            parametros: ["W8"]
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
                var lstVO0620 = response.data.conteudo;
                var aux = true;
                for (var i = 0, max = lstVO0620.length; i < max; i++) {
                    if (aux) {
                        $scope.ReceitaXDespesa.titulo = lstVO0620[i].descricao;
                        $scope.ReceitaXDespesa.head = lstVO0620[i];
                        aux = false;
                    } else if (lstVO0620[i].descricao == "Total...") {
                        $scope.ReceitaXDespesa.footer = lstVO0620[i];
                        $scope.lstReceitaXDespesa.push(
                            angular.copy($scope.ReceitaXDespesa)
                        );
                        $scope.ReceitaXDespesa = {
                            titulo: null,
                            head: null,
                            lstItens: [],
                            footer: null,
                        };
                        aux = true;
                    } else {
                        $scope.ReceitaXDespesa.lstItens.push(lstVO0620[i]);
                    }
                }
                document.getElementById("loading").style.display = "none";
            },
            function errorCallback(erro) {
                document.getElementById("loading").style.display = "none";
            }
        );
    }

    $scope.getReceitaXDespesa();

    $scope.getNomePlano = function(codigo) {
        var name = "";
        for (var i = 0, max = $scope.planos.length; i < max; i++) {
            if ($scope.planos[i].codigo == codigo) {
                name = $scope.planos[i].descricao;
            }
        }
        return name;
    };

    $scope.abrirGuias = function(item) {
        if (item == null) {
            item = $scope.menu[0];
        }
        $scope.statusAtual = item.codigo;
        $scope.Titulo = item.titulo;
    };

    $scope.getNome = function(objVO0623, codigo) {
        var name = "";
        if (codigo == 0) {
            name = objVO0623.pessoa.nome;
        } else {
            for (var i = 0, max = objVO0623.lstdependentes.length; i < max; i++) {
                if (objVO0623.lstdependentes[i].codigo == codigo) {
                    name = objVO0623.lstdependentes[i].dependente;
                }
            }
        }
        return name;
    };

    $scope.getBuscaTitular = function() {
        let matricula = document.getElementById("matricula").value;
        let cpf = document.getElementById("cpf").value;
        let nome = document.getElementById("nome").value;

        document.getElementById("loading").style.display = "block";

        const body = {
            coddao: 538,
            parametros: ["W8", matricula, cpf, nome, $scope.ativo ? "S" : "N"]
        }
        $http({
            method: 'POST',
            url: `https://${$scope.webserviceBios}/service/V1`,
            data: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }).then(function(resp) {
            if (resp.data.codigo == 30) {
                $scope.lstVO0623 = resp.data.conteudo;
                //if ($scope.lstVO0623.length > 0) { $scope.getBeneficiario(0); }
            }
            document.getElementById("loading").style.display = "none";
        })
    };

    // $scope.getBuscaTitular = function () {
    //  const body = {
    //     coddao: 538,
    //     parametros: [
    //     "W8",
    //     document.getElementById("matricula").value,
    //     document.getElementById("cpf").value,
    //     document.getElementById("nome").value,
    //     $scope.ativo?"S":"N"
    //   ]
    // }
    // document.getElementById("loading").style.display = "block";
    // $http({
    //     method: "POST",
    //     url: "https://" + $scope.webserviceBios + "/service/V1",
    //     data: JSON.stringify(body),
    //       headers: {'Content-Type': 'application/json; charset=UTF-8'}
    //   }).then(function successCallback(response) {
    //       if (response.data.codigo ==30) {
    //         $scope.lstVO0623 = response.data.conteudo;
    //         if ($scope.lstVO0623.length > 0) {
    //           $scope.getBeneficiario(0);
    //         }
    //       }
    //   }
    //  document.getElementById("loading").style.display = "none";
    //  document.getElementById("loading").style.display = "block";
    //  $scope.selecionado = null;
    //  $scope.lstVO0623 = [];
    //   const body = {
    //     coddao: 538,
    //     parametros: ["W8"]
    //   }
    //   $http({
    //     method: "POST",
    //     url: "https://" + $scope.webserviceBios + "/service/V1",
    //     headers: {
    //       "Content-Type": "application/json; charset=utf-8",
    //     },
    //     data: JSON.stringify(body),
    //   }).then(
    //     function successCallback(response) {
    //       if (response.data.codigo == 30) {
    //         $scope.lstVO0623 = response.data.conteudo;
    //         if ($scope.lstVO0623.length > 0) {
    //           $scope.getBeneficiario(0);
    //         }
    //   }, function errorCallback(response) {
    //       document.getElementById("loading").style.display = "none";
    //   });
    //}

    // $scope.getBuscaTitular = function () {
    //   $scope.selecionado = null;
    //   $scope.lstVO0623 = [];
    //   document.getElementById("loading").style.display = "block";
    //   $http({
    //     method: "GET",
    //     url:
    //       "http://" +
    //       $scope.webservice +
    //       "/cadastro/busca_titular?id1=&id2=" +
    //       document.getElementById("matricula").value +
    //       "&id3=" +
    //       document.getElementById("cpf").value +
    //       "&id4=" +
    //       document.getElementById("nome").value +
    //       "&id5=" +
    //       $scope.token +
    //       "&id6=" +
    //       $scope.ativo,
    //   }).then(
    //     function successCallback(response) {
    //       if (response.data.codigo == 30) {
    //         $scope.lstVO0623 = response.data.conteudo;
    //         if ($scope.lstVO0623.length == 1) {
    //           $scope.getBeneficiario(0);
    //         }
    //       }
    //       document.getElementById("loading").style.display = "none";
    //     },
    //     function errorCallback(response) {
    //       document.getElementById("loading").style.display = "none";
    //     }
    //   );
    // };

    $scope.voltar = function(index) {
        $scope.lstVO0618 = [];
        $scope.selecionado = null;
    };

    $scope.getBeneficiario = function(index) {
        $scope.lstVO0618 = [];
        $scope.selecionado = index;
        document.getElementById("loading").style.display = "block";
        const body = {
            coddao: 528,
            parametros: ["W8", $scope.lstVO0623[index].matricula]
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
                $scope.lstVO0618 = response.data.conteudo;
                document.getElementById("loading").style.display = "none";
            },
            function errorCallback(erro) {
                document.getElementById("loading").style.display = "none";
            }
        );
    }



    $scope.somaValorString = function(x, y) {
        const round = (num, places) => {
            if (!("" + num).includes("e")) {
                return +(Math.round(num + "e+" + places) + "e-" + places);
            } else {
                let arr = ("" + num).split("e");
                let sig = "";
                if (+arr[1] + places > 0) {
                    sig = "+";
                }
                return +(
                    Math.round(+arr[0] + "e" + sig + (+arr[1] + places)) +
                    "e-" +
                    places
                );
            }
        };
        x = x.replaceAll(".", "");
        x = x.replaceAll(",", ".");
        y = y.replaceAll(".", "");
        y = y.replaceAll(",", ".");
        return round(Number(x) + Number(y), 2).toLocaleString("pt-BR", {
            currency: "BRL",
        });
    };

    $scope.abrirGuias(null);

    $scope.getDespesasAssistencias = function() {
        document.getElementById("loading").style.display = "block";
        const body = {
            coddao: 530,
            parametros: [
                "W8",
                document.getElementById("referenciadespesas").value.replace(/([^\d])+/gim, ""),
                document.getElementById("codprocedimento").value,
                document.getElementById("codtabela").value.replace(/[^\d]+/g, "")
            ]
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
                $scope.objVO0732 = response.data.conteudo;
                document.getElementById("loading").style.display = "none";
            },
            function errorCallback(erro) {
                document.getElementById("loading").style.display = "none";
            }
        );
    }



    $scope.getRelEstatistiCacadastro = function() {
        document.getElementById("loading").style.display = "block";
        const body = {
            coddao: 531,
            parametros: [
                "W8",
                document.getElementById("referenciamovimentacao").value.replace(/([^\d])+/gim, "")
            ]
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
                $scope.lstVO0734 = response.data.conteudo;
                document.getElementById("loading").style.display = "none";
            },
            function errorCallback(erro) {
                document.getElementById("loading").style.display = "none";
            }
        );
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
});