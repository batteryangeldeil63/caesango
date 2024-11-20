/* global app, calcMD5, token, webservice */
app.controller("LoginCtrl", function($scope, $http) {
    $scope.webservice = webservice;
    $scope.webserviceBios = webserviceBios;
    $scope.environment = localStorage.getItem('environment');
    $scope.pagina = pagina;

    if (navigator.userAgent.toLowerCase().indexOf("firefox") > -1) {
        $scope.navegador = "firefox";
    } else {
        $scope.navegador = "chrome";
    }

    $scope.apenasNumeros = function(string) {
        var numsStr = string.replace(/[^0-9]/g, "");
        return numsStr;
    };

    $scope.objLogar = {
        login: null,
        senha1: null
    };

    $scope.logar = function() {
        if ($scope.apenasNumeros($scope.objLogar.login) != null && $scope.apenasNumeros($scope.objLogar.login) != "") {
            var tipo = document.getElementById("tipo").value;
            var login = $scope.objLogar.login;
            var posBen = login.search(/m/g);
            var posBenM = login.search(/M/g);
            var posPres = login.search(/p/g);
            var posPresM = login.search(/P/g);
            if (posBen != null && posBen != -1) {
                $scope.objLogar.login = login.replace(/m/g, "");
            }
            if (posBenM != null && posBenM != -1) {
                $scope.objLogar.login = login.replace(/M/g, "");
            }
            if (posPres != null && posPres != -1) {
                $scope.objLogar.login = login.replace(/p/g, "");
            }
            if (posPresM != null && posPresM != -1) {
                $scope.objLogar.login = login.replace(/P/g, "");
            }

            localStorage.setItem("senha", calcMD5($scope.objLogar.senha1).toUpperCase());

            const body = {
                "coddao": 512,
                "parametros": ["W8", tipo, $scope.objLogar.login.trim(), calcMD5($scope.objLogar.senha1).toUpperCase()]
            }
            $http({
                method: "POST",
                // url: "https://ws.bios.inf.br/service/V1",
                url: "https://" + $scope.webserviceBios + "/service/V1",
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify(body),
            }).then(
                function successCallback(response) {
                    if (!response.data.conteudo) {
                        $("#alerta").modal();
                        return;
                    }
                    const token = response.data.conteudo;
                    const sToken = token.token;
                    const sCodPessoa = token.codpessoa;
                    const sCodPerfil = token.codperfil;
                    localStorage.setItem("inscricao", sCodPessoa);
                    localStorage.setItem("codperfil", sCodPerfil);
                    window.location.href = $scope.pagina + "?token=" + sToken + "&tipo=" + tipo;
                },
                function errorCallback(error) {
                    document.getElementById("avisologin").style.display = "block";
                }
            );
        } else {
            $("#alerta").modal();
        }
    };

    $scope.objVO0498 = {
        senhaatual: null,
        senhanova: null,
        resenhanova: null,
        tipo: null
    };

    $scope.gravarSenha = function(alterarSenha) {
        if ($scope.apenasNumeros($scope.objVO0418.inscricao) != null && $scope.apenasNumeros($scope.objVO0418.inscricao) != "") {
            var tipo = document.getElementById("tipo").value;
            $scope.objVO0418.password1 = calcMD5($scope.objVO0418.password1).toUpperCase();
            $scope.objVO0418.password2 = calcMD5($scope.objVO0418.password2).toUpperCase();
            const body = {
                "coddao": 513,
                "parametros": [
                    "W8",
                    tipo,
                    $scope.objVO0418.inscricao,
                    $scope.objVO0418.cpf,
                    $scope.objVO0418.dtnascimento ? $scope.objVO0418.dtnascimento : "",
                    $scope.objVO0418.password1,
                    $scope.objVO0418.password2
                ]
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
                    if (!response.data.conteudo) {
                        document.getElementById("avisologin").style.display = "block";
                    } else {
                        localStorage.setItem("token", response.data.conteudo);
                        if (alterarSenha) {
                            $scope.alertas(30);
                            return;
                        }
                        window.location.href = $scope.pagina + "/?token=" + response.data.conteudo + "&tipo=" + tipo;
                    }
                },
                function errorCallback(error) {
                    document.getElementById("avisologin").style.display = "block";
                }
            );
        } else {
            $("#alerta").modal();
        }
    }

    $scope.limparForm = function() {
        $scope.objVO0418 = {
            cpf: null,
            dtnascimento: null,
            inscricao: null,
            password1: null,
            password2: null
        };
    };

    $scope.alerta = {
        acao: null,
        codigo: null,
        icone: null,
        link: null,
        mensagem: null,
        tipo: null,
        titulo: null,
        urllink: null
    };

    $scope.alertas = function(cod) {
        if (cod > 0) {
            $scope.alerta.mensagem = "Solicitação enviada com sucesso!";
            $scope.alerta.titulo = "Sucesso";
            $scope.limparForm();
        } else {
            $scope.alerta.mensagem = "Não foi possível gravar sua solicitação!";
            $scope.alerta.titulo = "Erro";
            $scope.alerta.acao = "Tente novamente mais tarde. Caso o erro persista, entre em ";
            $scope.alerta.link = "contato.";
            $scope.alerta.urllink = "contato";
        }
        $("#alerta").modal();
    };
});