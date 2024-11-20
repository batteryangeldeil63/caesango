/* global app, webservice */

app.controller("CtrlAcaesan", function($scope) {
    $scope.webservice = webservice;
    $scope.webserviceBios = webserviceBios;
    $scope.environment = localStorage.getItem('environment')

    $scope.balPatrimoniais = [{
        nome: "Relatório da Administração",
        lstItens: [{
            titulo: "2019",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/reladministracao_2019.pdf"
        }, {
            titulo: "2020",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/reladministracao_2020.pdf"
        }, {
            titulo: "2021",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/reladministracao_2021.pdf"
        }, {
            titulo: "2022",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/reladministracao_2022.pdf"
        }, {
            titulo: "2023",
            url: "http://www.caesan.com.br/wp-content/uploads/2024/04/reladministracao_2023.pdf"
        }]
    }, {
        nome: "Demonstração de Resultados",
        lstItens: [{
            titulo: "2009 / 2010",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/demresultado_09-10.pdf"
        }, {
            titulo: "2010 / 2011",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/demresultado_10-11.pdf"
        }, {
            titulo: "2011 / 2012",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/demresultado_11-12.pdf"
        }, {
            titulo: "2012 / 2013",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/demresultado_12-13.pdf"
        }, {
            titulo: "2013 / 2014",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/demresultado_13-14.pdf"
        }, {
            titulo: "2014 / 2015",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/demresultado_14-15.pdf"
        }, {
            titulo: "2015 / 2016",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/demresultado_15-16.pdf"
        }, {
            titulo: "2016 / 2017",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/demresultado_16-17.pdf"
        }, {
            titulo: "2017 / 2018",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/demresultado_17-18.pdf"
        }, {
            titulo: "2019",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/demresultado_19.pdf"
        }, {
            titulo: "2020",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/demresultado_20.pdf"
        }, {
            titulo: "2021",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/demresultado_21.pdf"
        }, {
            titulo: "2022",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/demresultado_22.pdf"
        }, {
            titulo: "2023",
            url: "http://www.caesan.com.br/wp-content/uploads/2024/03/demresultado_23.pdf"
        }]
    }, {
        nome: "Parecer da Auditoria Independente",
        lstItens: [{
            titulo: "2007",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/audindependentes_2007.pdf"
        }, {
            titulo: "2008",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/audindependentes_2008.pdf"
        }, {
            titulo: "2009",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/audindependentes_2009.pdf"
        }, {
            titulo: "2010",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/audindependentes_2010.pdf"
        }, {
            titulo: "2011",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/audindependentes_2011.pdf"
        }, {
            titulo: "2012",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/audindependentes_2012.pdf"
        }, {
            titulo: "2013",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/audindependentes_2013.pdf"
        }, {
            titulo: "2014",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/audindependentes_2014.pdf"
        }, {
            titulo: "2015",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/audindependentes_2015.pdf"
        }, {
            titulo: "2016",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/audindependentes_2016.pdf"
        }, {
            titulo: "2017",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/audindependentes_2017.pdf"
        }, {
            titulo: "2018",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/audindependentes_2018.pdf"
        }, {
            titulo: "2019",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/audindependentes_2019.pdf"
        }, {
            titulo: "2020",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/audindependentes_2020.pdf"
        }, {
            titulo: "2021",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/audindependentes_2021.pdf"
        }, {
            titulo: "2022",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/audindependentes_2022.pdf"
        }, {
            titulo: "2023",
            url: "http://www.caesan.com.br/wp-content/uploads/2024/03/audindependentes_2023.pdf"
        }]
    }, {
        nome: "Balanços Patrimoniais",
        lstItens: [{
            titulo: "2006",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/balanco_2006.pdf"
        }, {
            titulo: "2007",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/balanco_2007.pdf"
        }, {
            titulo: "2008",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/balanco_2008.pdf"
        }, {
            titulo: "2009",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/balanco_2009.pdf"
        }, {
            titulo: "2010",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/balanco_2010.pdf"
        }, {
            titulo: "2011",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/balanco_2011.pdf"
        }, {
            titulo: "2012",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/balanco_2012.pdf"
        }, {
            titulo: "2013",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/balanco_2013.pdf"
        }, {
            titulo: "2014",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/balanco_2014.pdf"
        }, {
            titulo: "2015",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/balanco_2015.pdf"
        }, {
            titulo: "2016",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/balanco_2016.pdf"
        }, {
            titulo: "2017",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/balanco_2017.pdf"
        }, {
            titulo: "2018",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/balanco_2018.pdf"
        }, {
            titulo: "2019",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/balanco_2019.pdf"
        }, {
            titulo: "2020",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/balanco_2020.pdf"
        }, {
            titulo: "2021",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/balanco_2021.pdf"
        }, {
            titulo: "2022",
            url: "http://www.caesan.com.br/wp-content/uploads/2023/11/balanco_2022.pdf"
        }, {
            titulo: "2023",
            url: "http://www.caesan.com.br/wp-content/uploads/2024/03/balanco_2023.pdf"
        }]
    }];

    $scope.consDeliberativo = [{
        nome: "CONSELHO DELIBERATIVO",
        lstItens: [{
            cargo: null,
            titulo: "Eliane Lopes dos Santos Inácio",
            dtInicio: "03/11/2020",
            dtFim: "31/10/2024"
        }, {
            cargo: null,
            titulo: "Ângelo Márcio Pereira",
            dtInicio: "03/11/2020",
            dtFim: "31/10/2024"
        }, {
            cargo: null,
            titulo: "João Pedro Tavares Damasceno",
            dtInicio: "03/11/2020",
            dtFim: "31/10/2024"
        }, {
            cargo: null,
            titulo: "Roberto da Silva Ribeiro",
            dtInicio: "03/11/2020",
            dtFim: "31/10/2024"
        }, {
            cargo: null,
            titulo: "Rosimeire Dalat Coelho",
            dtInicio: "03/11/2020",
            dtFim: "31/10/2024"
        }]
    }, {
        nome: "DIRETORIA EXECUTIVA",
        lstItens: [{
            cargo: "DIRETOR PRESIDENTE",
            titulo: "Jose Rogerio da Silva",
            dtInicio: "01/11/2024",
            dtFim: "31/10/2028"
        }, {
            cargo: "DIRETORIA ADMINISTRATIVA FINANCEIRA",
            titulo: "Lyercia Lara Francisca de Araújo",
            dtInicio: "01/11/2024",
            dtFim: "31/10/2028"
        }, {
            cargo: "DIRETORIA OPERACIONAL",
            titulo: "Alzair Martins Monteiro",
            dtInicio: "01/11/2024",
            dtFim: "31/10/2028"
        }]
    }, {
        nome: "CONSELHO FISCAL",
        lstItens: [{
            cargo: null,
            titulo: "Amanda Louza",
            dtInicio: "03/11/2020",
            dtFim: "31/10/2024"
        }, {
            cargo: null,
            titulo: "Juliano José Gomes",
            dtInicio: "03/11/2020",
            dtFim: "31/10/2024"
        }, {
            cargo: null,
            titulo: "Karine Cristiane Ferreira",
            dtInicio: "03/11/2020",
            dtFim: "31/10/2024"
        }]
    }, {
        nome: "SUPLENTES DO CONSELHO DELIBERATIVO",
        lstItens: [{
            cargo: null,
            titulo: "Diogo Carlos Carneiro de Oliveira",
            dtInicio: "03/11/2020",
            dtFim: "31/10/2024"
        }, {
            cargo: null,
            titulo: "José Antônio Batista",
            dtInicio: "03/11/2020",
            dtFim: "31/10/2024"
        }, {
            cargo: null,
            titulo: "Thania Maria Pereira da Silva",
            dtInicio: "03/11/2020",
            dtFim: "31/10/2024"
        }, {
            cargo: null,
            titulo: "Carlos Tadeu Garrote",
            dtInicio: "03/11/2020",
            dtFim: "31/10/2024"
        }, {
            cargo: null,
            titulo: "Ana Cristina da Silva Lima",
            dtInicio: "03/11/2020",
            dtFim: "31/10/2024"
        }]
    }, {
        nome: "SUPLENTES DO CONSELHO FISCAL",
        lstItens: [{
            cargo: null,
            titulo: "Rodolfo Barros Kirsteim",
            dtInicio: "03/11/2020",
            dtFim: "31/10/2024"
        }, {
            cargo: null,
            titulo: "Alfredo da Rocha Araújo Neto",
            dtInicio: "03/11/2020",
            dtFim: "31/10/2024"
        }, {
            cargo: null,
            titulo: "Sebastiao Alves Rodrigues",
            dtInicio: "03/11/2020",
            dtFim: "31/10/2024"
        }]
    }];

    $scope.lstInformativos = [{
        url: "<?php echo get_template_directory_uri(); ?>/themes/Caesan/download/JORNAL/jornal13.pdf",
        foto: "jornal13",
        edicao: "13"
    }, {
        url: "<?php echo get_template_directory_uri(); ?>/themes/Caesan/download/JORNAL/jornal14.pdf",
        foto: "jornal14",
        edicao: "14"
    }, {
        url: "<?php echo get_template_directory_uri(); ?>/themes/Caesan/download/JORNAL/jornal16.pdf",
        foto: "jornal16",
        edicao: "16"
    }, {
        url: "<?php echo get_template_directory_uri(); ?>/themes/Caesan/download/JORNAL/jornal20.pdf",
        foto: "jornal20",
        edicao: "20"
    }, {
        url: "<?php echo get_template_directory_uri(); ?>/themes/Caesan/download/JORNAL/jornal23.pdf",
        foto: "jornal23",
        edicao: "23"
    }];
});