app.controller("ctrGuiaMedico", function($scope, $http) {
    $scope.webservice = webservice;
    $scope.webserviceBios = webserviceBios;
    $scope.environment = localStorage.getItem('environment');
    $scope.aux = 1;
    $scope.tipoPesquisaSelecionado = "";
    $scope.lstTipoPesquisa = [{
            codigo: "E",
            descricao: "Especialidades"
        },
        {
            codigo: "S",
            descricao: "Serviços"
        }
    ]
    $scope.lstEspecialidades = [];
    $scope.lstServicos = [];
    $scope.lstPrestadores = [];
    $scope.codigoCBOSelecionado = "";
    $scope.codigoServicoSelecionado = "";
    $scope.nome = "";
    $scope.lstPrestadoresFiltrada = [];
    $scope.lstCidades = [];
    $scope.lstBairros = [];
    $scope.bairroSelecionado = "";
    $scope.cidadeSelecionada = "";
    $scope.alerta = {
        mensagem: "",
        titulo: ""
    }
    $scope.buscaEmAndamento = false;

    $scope.BuscaServicos_Especialidade = function() {
        const sCodEmpresa = "W8";
        const sTipoPesquisa = $scope.tipoPesquisaSelecionado;
        const sCodDAO = "467";
        const body = {
            coddao: sCodDAO,
            conteudo: null,
            parametros: [sCodEmpresa, sTipoPesquisa],
            hash: null
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
            document.getElementById("loading").style.display = "none";
            if (data.conteudo.length === 0) {
                $scope.alerta.mensagem = `Não foi possível carregar a lista de ${$scope.lstTipoPesquisa.filter((tipoPesquisa) => tipoPesquisa.codigo === sTipoPesquisa)[0].descricao}`;
                $scope.alerta.titulo = "Erro";
                $("#alerta").modal();
                return;
            }
            if (sTipoPesquisa === "E") {
                $scope.lstServicos = [];
                $scope.codigoServicoSelecionado = "";
                $scope.lstEspecialidades = data.conteudo;
            } else if (sTipoPesquisa === "S") {
                $scope.lstEspecialidades = [];
                $scope.codigoCBOSelecionado = "";
                $scope.lstServicos = data.conteudo;
            }
        }).error(function(error) {
            $scope.limparForm();
            document.getElementById("loading").style.display = "none";
            $scope.alerta.mensagem = "Falha na conexão, tente novamente mais tarde!";
            $scope.alerta.titulo = "Erro";
            $("#alerta").modal();
        });
    }

    // $scope.DadosGuiaMedico = function(){
    //   if($scope.nome && $scope.nome.length < 4) {
    //     return;
    //   }
    //   const sCodEmpresa = "W8";
    //   const sCodDAO = "468";
    //   const sTipoPesquisa = $scope.tipoPesquisaSelecionado; 
    //   const sCodConsulta = $scope.tipoPesquisaSelecionado === "E" ?  $scope.codigoCBOSelecionado : $scope.codigoServicoSelecionado;
    //   const sNome = $scope.nome ? $scope.nome : ""
    //   const body = {
    //     coddao: sCodDAO,
    //     conteudo: null,
    //     parametros: [sCodEmpresa, sTipoPesquisa, sCodConsulta, sNome],
    //     hash: null
    //   }
    //   $scope.buscaEmAndamento = true;
    //   $http({
    //     method: "POST",
    //     url: "https://" + $scope.webserviceBios +  "/service/V1",
    //     headers: {
    //       "Content-Type": "application/json;charset=utf-8;",
    //     },
    //     data: JSON.stringify(body),
    //   }).success(function (data) {
    //     $scope.buscaEmAndamento = true;
    //     if(data.conteudo.length === 0) {
    //       $scope.alerta.mensagem = 'Sua busca não retornou resultados, altere as opções de busca e tente novamente';
    //       $scope.alerta.titulo = "Atenção!";
    //       $("#alerta").modal();
    //       return;
    //     }
    //     $scope.lstPrestadores = data.conteudo;
    //     $scope.lstPrestadoresFiltrada = JSON.parse(JSON.stringify($scope.lstPrestadores));
    //     $scope.filtrarCidades();
    //   }).error(function (error) {
    //     $scope.buscaEmAndamento = true;
    //     $scope.alerta.mensagem = "Falha na conexão, tente novamente mais tarde!";
    //     $scope.alerta.titulo = "Erro";
    //     $("#alerta").modal();
    //   });
    // }

    $scope.formatarCep = function(cep) {
        if (!cep) return '';
        return cep.replace(/(\d{5})(\d{3})/, "$1-$2");
    }

    $scope.DadosGuiaMedico = function() {
        if ($scope.nome && $scope.nome.length < 4) {
            return;
        }
        const sCodEmpresa = "W8";
        const sCodDAO = "468";
        const sTipoPesquisa = $scope.tipoPesquisaSelecionado;
        const sCodConsulta = $scope.tipoPesquisaSelecionado === "E" ? $scope.codigoCBOSelecionado : $scope.codigoServicoSelecionado;
        const sNome = $scope.nome ? $scope.nome : ""
        const body = {
            coddao: sCodDAO,
            conteudo: null,
            parametros: [sCodEmpresa, sTipoPesquisa, sCodConsulta, sNome],
            hash: null
        }
        $scope.buscaEmAndamento = true;
        $http({
            method: "POST",
            url: "https://" + $scope.webserviceBios + "/service/V1",
            headers: {
                "Content-Type": "application/json;charset=utf-8;",
            },
            data: JSON.stringify(body),
        }).success(function(data) {
            $scope.buscaEmAndamento = false;
            if (data.conteudo.length === 0) {
                $scope.alerta.mensagem = 'Sua busca não retornou resultados, altere as opções de busca e tente novamente';
                $scope.alerta.titulo = "Atenção!";
                $("#alerta").modal();
                return;
            }
            $scope.lstPrestadores = data.conteudo.map(prestador => {
                prestador.lstendereco = prestador.lstendereco.map(endereco => {
                    endereco.cep = $scope.formatarCep(endereco.cep);
                    return endereco;
                });
                return prestador;
            });
            // $scope.lstPrestadores = data.conteudo;
            $scope.lstPrestadoresFiltrada = angular.copy($scope.lstPrestadores);
            $scope.filtrarCidades();
        }).error(function(error) {
            $scope.buscaEmAndamento = false;
            $scope.alerta.mensagem = "Falha na conexão, tente novamente mais tarde!";
            $scope.alerta.titulo = "Erro";
            $("#alerta").modal();
        });
    }

    $scope.limparForm = function() {
        $scope.lstEspecialidades = [];
        $scope.lstPrestadores = [];
        $scope.lstServicos = [];
        $scope.codigoCBOSelecionado = "";
        $scope.codigoServicoSelecionado = "";
        $scope.tipoPesquisaSelecionado = "";
        $scope.nome = "";
    }

    // $scope.filtrarCidades = function(bairro) {
    //   if(bairro) {
    //     $scope.lstCidades = [...new Set($scope.lstPrestadoresFiltrada.filter(prestador => prestador.bairro === bairro).map(prestador => prestador.cidade))]
    //     return;
    //   }
    //   $scope.lstCidades = [...new Set($scope.lstPrestadores.map((prestador) => prestador.cidade))].sort()
    // }

    $scope.filtrarCidades = function(bairro) {
        if (bairro) {
            $scope.lstCidades = [...new Set($scope.lstPrestadoresFiltrada
                .flatMap(prestador => prestador.lstendereco)
                .filter(endereco => endereco.bairro === bairro)
                .map(endereco => endereco.cidade)
            )];
            return;
        }
        $scope.lstCidades = [...new Set($scope.lstPrestadores
            .flatMap(prestador => prestador.lstendereco)
            .map(endereco => endereco.cidade)
        )].sort();
    }

    $scope.limparFiltros = function() {
        $scope.lstPrestadoresFiltrada = JSON.parse(JSON.stringify($scope.lstPrestadores));
        $scope.cidadeSelecionada = "";
        $scope.bairroSelecionado = "";
        $scope.lstBairros = [];
    }

    // $scope.filtrarBairros = function() {
    //   $scope.lstBairros = [...new Set($scope.lstPrestadores.filter((prestador) => prestador.cidade === $scope.cidadeSelecionada).map((prestador => prestador.bairro)))].sort();
    // }

    $scope.filtrarBairros = function() {
        $scope.lstBairros = [...new Set($scope.lstPrestadores
            .flatMap(prestador => prestador.lstendereco)
            .filter(endereco => endereco.cidade === $scope.cidadeSelecionada)
            .map(endereco => endereco.bairro)
        )].sort();
    }

    $scope.filtrarEspecialidade = function() {
        const Especialidades = $scope.lstEspecialidades.filter((especialidade) => especialidade.codigo_interno === $scope.codigoCBOSelecionado)
        let retorno = '';
        if (Especialidades.length !== 0) {
            retorno = Especialidades[0].descricao
        }
        return retorno;
    }

    $scope.filtrarTipoPesquisa = function() {
        const TipoPesquisa = $scope.lstTipoPesquisa.filter((tipoPesquisa) => tipoPesquisa.codigo === $scope.tipoPesquisaSelecionado)
        let retorno = '';
        if (TipoPesquisa.length !== 0) {
            retorno = TipoPesquisa[0].descricao
        }
        return retorno;
    }

    // $scope.filtrarPrestadores = function() {
    //   if($scope.bairroSelecionado) {
    //     $scope.lstPrestadoresFiltrada = $scope.lstPrestadores.filter((prestador) => prestador.bairro === $scope.bairroSelecionado);
    //     return;  
    //   }
    //   $scope.lstPrestadoresFiltrada = $scope.lstPrestadores.filter((prestador) => prestador.cidade === $scope.cidadeSelecionada );
    // }

    $scope.filtrarPrestadores = function() {
        if ($scope.bairroSelecionado) {
            $scope.lstPrestadoresFiltrada = $scope.lstPrestadores.filter(prestador =>
                prestador.lstendereco.some(endereco => endereco.bairro === $scope.bairroSelecionado)
            );
            return;
        }
        $scope.lstPrestadoresFiltrada = $scope.lstPrestadores.filter(prestador =>
            prestador.lstendereco.some(endereco => endereco.cidade === $scope.cidadeSelecionada)
        );
    }
});