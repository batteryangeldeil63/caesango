/* global app, webservice */

app.controller("ProgramasCaesan", function($scope, $http) {
    $scope.webservice = webservice;
    $scope.webserviceBios = webserviceBios;

    $scope.environment = localStorage.getItem('environment');
    $scope.objProgCaesan = [{
        "imagem": "dst.png",
        "texto": "O Programa de Prevenção as DST/AIDS surgiu em 2000 com o intuito de estimular a adoção de comportamentos seguros através da política de prevenção, promovendo o acesso à informação e ao uso de preservativos. Este programa atende todos os empregados da Saneago, independente de faixa etária e sexo.",
        "info": {
            "titulo": "Programa de Prevenção as DST/AIDS",
            "fotos": [{
                    "foto": "01-dst.png"
                },
                {
                    "foto": "02-dst.png"
                },
                {
                    "foto": "03-dst.png"
                },
                {
                    "foto": "04-dst.png"
                }
            ]
        }
    }, {
        "imagem": "dengue.png",
        "texto": "A dengue é uma doença transmitida pelo mosquito Aedes aegypti e pode levar a morte. Pensando nisso, no ano de 2002, a Caesan lançou a Campanha de Combate e Prevenção ao Mosquito da Dengue com o objetivo de levar os empregados e seus familiares informações visando a conscientização sobre as formas corretas de combate ao mosquito transmissor da dengue.",
        "info": {
            "titulo": "Campanha de Combate e Prevenção ao Mosquito da Dengue",
            "fotos": [{
                    "foto": "01-dengue.png"
                },
                {
                    "foto": "02-dengue.png"
                },
                {
                    "foto": "03-dengue.png"
                }
            ]
        }
    }, {
        "imagem": "saudehomem.png",
        "texto": "A Caesan sempre buscou melhoria da qualidade de vida de seus beneficiários incentivando a adoção de hábitos saudáveis e a realização de exames preventivos. Pensando nisso, no ano de 2005, foi criado o Programa do Homem com o intuito de incentivar exames essenciais para a boa saúde do homem, como: PSA e Ultrassonografia Prostática.",
        "info": {
            "titulo": "Programa do Homem",
            "fotos": [{
                    "foto": "01-sh.png"
                },
                {
                    "foto": "02-sh.png"
                },
                {
                    "foto": "03-sh.png"
                },
                {
                    "foto": "04-sh.png"
                },
                {
                    "foto": "05-sh.png"
                },
                {
                    "foto": "06-sh.png"
                },
                {
                    "foto": "07-sh.png"
                },
                {
                    "foto": "08-sh.png"
                },
                {
                    "foto": "09-sh.png"
                },
                {
                    "foto": "10-sh.png"
                }
            ]
        }
    }, {
        "imagem": "saudemulher.png",
        "texto": "A Caesan desenvolve atividades preventivas e educativas objetivando não só prevenir doenças como também aprimorar o relacionamento inter-pessoal dos empregados, quando com isso uma melhoria no desempenho profissional e familiar, aliando isso á uma melhoria na qualidade de vida. Diante dessa realidade, não poderíamos deixar de desenvolver uma atividade direcionada ao público feminino da Saneago, implantando, no ano de 2003, o Programa da Mulher visando desenvolver hábitos saudáveis e estimular a periodicidade na realização de exames, tais como: mamografia e prevenção do câncer de colo uterino.",
        "info": {
            "titulo": "Programa da Mulher",
            "fotos": [{
                    "foto": "01-sm.png"
                },
                {
                    "foto": "02-sm.png"
                },
                {
                    "foto": "03-sm.png"
                },
                {
                    "foto": "04-sm.png"
                },
                {
                    "foto": "05-sm.png"
                },
                {
                    "foto": "06-sm.png"
                },
                {
                    "foto": "07-sm.png"
                },
                {
                    "foto": "08-sm.png"
                },
                {
                    "foto": "09-sm.png"
                },
                {
                    "foto": "10-sm.png"
                }
            ]
        }
    }];

    $scope.marcadorIndex = 0;

    $scope.pegarIndex = function(index) {
        $scope.marcadorIndex = index;
        return $scope.marcadorIndex;
    };

    $scope.marcadorIndexFoto = 0;

    $scope.pegarIndexFoto = function(index) {
        $scope.marcadorIndexFoto = index;
        return $scope.marcadorIndexFoto;
    };
});