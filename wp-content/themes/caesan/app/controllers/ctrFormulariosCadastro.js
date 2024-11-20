/* global app, webservice */

app.controller("FormulariosCadastro", function($scope, $http) {
    $scope.webservice = webservice;
    $scope.webserviceBios = webserviceBios;
    $scope.environment = localStorage.getItem('environment');

    $scope.objFormCadastro = [{
        "nomeprod": "Caesan Padrão",
        "numprod": "458370081",
        "acomodacao": "ENFERMARIA",
        "lembrete": null,
        "downloads": [{
            "nome": "Ficha de Inscrição",
            "link": "http://www.caesan.com.br/wp-content/uploads/2023/11/ficha_inscricao_padrao.pdf"
        }, {
            "nome": "Requerimento para Inclusão de Dependentes/Agregados",
            "link": "http://www.caesan.com.br/wp-content/uploads/2023/11/requerimento_inclusao.pdf"
        }, {
            "nome": "Requerimento para Desligamento (Grupo Familiar)",
            "link": "http://www.caesan.com.br/wp-content/uploads/2023/11/requerimento_desligamento.pdf"
        }, {
            "nome": "Declaração de Dependência Econômica",
            "link": "http://www.caesan.com.br/wp-content/uploads/2023/11/declaracao_dependencia.pdf"
        }, {
            "nome": "Requerimento para transferência de plano Caesan Padrão",
            "link": "http://www.caesan.com.br/wp-content/uploads/2024/01/requerimento_transferencia_padrao.pdf"
        }, {
            "nome": "Requerimento para Exclusão de Dependentes/Agregados",
            "link": "http://www.caesan.com.br/wp-content/uploads/2023/11/requerimento_exclusao.pdf"
        }]
    }, {
        "nomeprod": "Caesan Especial",
        "numprod": "458369088",
        "acomodacao": "APARTAMENTO STANDARD",
        "lembrete": "Opção para acomodação especial R$ 448,74 para todo o grupo familiar.",
        "downloads": [{
            "nome": "Ficha de Inscrição",
            "link": "http://www.caesan.com.br/wp-content/uploads/2023/11/ficha_inscricao_especial.pdf"
        }, {
            "nome": "Requerimento para Inclusão de Dependentes/Agregados",
            "link": "http://www.caesan.com.br/wp-content/uploads/2023/11/requerimento_inclusao.pdf"
        }, {
            "nome": "Requerimento para Desligamento (Grupo Familiar)",
            "link": "http://www.caesan.com.br/wp-content/uploads/2023/11/requerimento_desligamento.pdf"
        }, {
            "nome": "Declaração de Dependência Econômica",
            "link": "http://www.caesan.com.br/wp-content/uploads/2023/11/declaracao_dependencia.pdf"
        }, {
            "nome": "Requerimento para transferência de plano Caesan Especial",
            "link": "http://www.caesan.com.br/wp-content/uploads/2024/01/requerimento_transferencia_especial.pdf"
        }, {
            "nome": "Requerimento para Exclusão de Dependentes/Agregados",
            "link": "http://www.caesan.com.br/wp-content/uploads/2023/11/requerimento_exclusao.pdf"
        }]
    }, {
        "nomeprod": "Agregados Enfermaria",
        "numprod": "457260082",
        "acomodacao": "ENFERMARIA",
        "lembrete": null,
        "downloads": [{
            "nome": "Ficha de Inscrição",
            "link": "http://www.caesan.com.br/wp-content/uploads/2023/11/ficha_inscricao_enfermaria.pdf"
        }, {
            "nome": "Requerimento para Inclusão de Dependentes/Agregados",
            "link": "http://www.caesan.com.br/wp-content/uploads/2023/11/requerimento_inclusao.pdf"
        }, {
            "nome": "Requerimento para Desligamento (Grupo Familiar)",
            "link": "http://www.caesan.com.br/wp-content/uploads/2023/11/requerimento_desligamento.pdf"
        }, {
            "nome": "Declaração de Dependência Econômica",
            "link": "http://www.caesan.com.br/wp-content/uploads/2023/11/declaracao_dependencia.pdf"
        }, {
            "nome": "Requerimento para transferência de plano Agregados Enfermaria",
            "link": "http://www.caesan.com.br/wp-content/uploads/2024/01/requerimento_transferencia_enfermaria.pdf"
        }, {
            "nome": "Requerimento para Exclusão de Dependentes/Agregados",
            "link": "http://www.caesan.com.br/wp-content/uploads/2023/11/requerimento_exclusao.pdf"
        }]
    }, {
        "nomeprod": "Agregados Apartamento",
        "numprod": "457259089",
        "acomodacao": "APARTAMENTO STANDARD",
        "lembrete": "Opção para acomodação especial R$ 448,74 para todo o grupo familiar.",
        "downloads": [{
            "nome": "Ficha de Inscrição",
            "link": "http://www.caesan.com.br/wp-content/uploads/2023/11/ficha_inscricao_apartamento.pdf"
        }, {
            "nome": "Requerimento para Inclusão de Dependentes/Agregados",
            "link": "http://www.caesan.com.br/wp-content/uploads/2023/11/requerimento_inclusao.pdf"
        }, {
            "nome": "Requerimento para Desligamento (Grupo Familiar)",
            "link": "http://www.caesan.com.br/wp-content/uploads/2023/11/requerimento_desligamento.pdf"
        }, {
            "nome": "Declaração de Dependência Econômica",
            "link": "http://www.caesan.com.br/wp-content/uploads/2023/11/declaracao_dependencia.pdf"
        }, {
            "nome": "Requerimento para transferência de plano Agregados Apartamento",
            "link": "http://www.caesan.com.br/wp-content/uploads/2024/01/requerimento_transferencia_apartamento.pdf"
        }, {
            "nome": "Requerimento para Exclusão de Dependentes/Agregados",
            "link": "http://www.caesan.com.br/wp-content/uploads/2023/11/requerimento_exclusao.pdf"
        }]
    }];

    $scope.imprimir = function() {
        window.print();
    };

    $scope.marcadorIndex = 0;

    $scope.pegarIndex = function(index) {
        $scope.marcadorIndex = index;
        return $scope.marcadorIndex;
    };

    $scope.buscarExtrato = function() {
        // const loader = document.querySelectorAll("#loading");
        // $scope.mudarDisplay(loader, 1);
        const date = new Date();
        const month = ("0" + (date.getMonth() + 1)).slice(-2); // Adiciona zero à esquerda e pega os últimos dois dígitos
        const year = date.getFullYear();
        const monthYear = month + year;
        const body = {
            coddao: 693,
            conteudo: null,
            parametros: ["W8", monthYear],
            hash: null,
        };
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            headers: {
                "Content-Type": "application/json;charset=utf-8;",
            },
            data: JSON.stringify(body),
        }).then(
            function successCallback(response) {
                const {
                    conteudo
                } = response.data;
                if (!conteudo) {
                    // $scope.mudarDisplay(loader, 0);
                    return;
                }
                $scope.extrato = response.data.conteudo;
                $scope.formatarUrl();
                // $scope.mudarDisplay(loader, 0);
            },
            function errorCallback(response) {
                // $scope.mudarDisplay(loader, 0);
                $("#alertafalha").modal();
            }
        );
    };

    $scope.formatarUrl = function() {
        $scope.extrato = $scope.extrato.split(" ").join("&nbsp;");
        $scope.extrato = $scope.extrato.split("\n").join("<br>");
        var doc = document.getElementById("extrato");
        doc.innerHTML = '<p style="font-family: Courier New">' + $scope.extrato + "</p>";
    };
    $scope.buscarExtrato();
});