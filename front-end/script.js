"use strict";

window.addEventListener("load", function () {
    function enviarForm() {
        var concorrente = document.getElementById("concorrente").value;
        var cpfCnpj = document.getElementById("cpfCnpj").value;
        var telefone = document.getElementById("telefone").value;
        var email = document.getElementById("ramo").value;
        var ramo = document.getElementById("ramo").value;
        var taxaDebito = document.getElementById("taxaDebito").value;
        var descontoDebito = document.getElementById("descontoDebito").value;
        var taxaCredito = document.getElementById("taxaCredito").value;
        var descontoCredito = document.getElementById("descontoCredito").value;

        var formData = {
            concorrente: concorrente,
            cpfCnpj: cpfCnpj,
            telefone: telefone,
            email: email,
            ramo: ramo,
            taxaDebito: taxaDebito,
            descontoDebito: descontoDebito,
            taxaCredito: taxaCredito,
            descontoCredito: descontoCredito

            //FETCH --> backend
        };fetch('http://localhost:3000/enviaFormulario', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        }).then(function (response) {
            return response.json();
        }).then(function (aprovacao) {
            if (aprovacao.aprovado === false) {} else {
                document.getElementById("aprovacao").style.display = "block";

                document.getElementById("aprovacaoSimulacaoId").innerHTML = aprovacao.simulacao_id;
                document.getElementById("aprovacaoConcorrente").innerHTML = aprovacao.concorrente;
                document.getElementById("aprovacaoCpfCnpj").innerHTML = aprovacao.cpfCnpj;
                document.getElementById("aprovacaoTelefone").innerHTML = aprovacao.telefone;
                document.getElementById("aprovacaoEmail").innerHTML = aprovacao.email;
                document.getElementById("aprovacaoRamo").innerHTML = aprovacao.ramo;
                document.getElementById("aprovacaoTaxaDebito").innerHTML = aprovacao.taxaDebito;
                document.getElementById("aprovacaoDescontoDebito").innerHTML = aprovacao.descontoDebito;
                document.getElementById("aprovacaoTaxaCredito").innerHTML = aprovacao.taxaCredito;
                document.getElementById("aprovacaoDescontoCredito").innerHTML = aprovacao.descontoCredito;
            }
        });
    }

    function enviarAprovacao() {
        var simulacaoId = document.getElementById("aprovacaoSimulacaoId").innerText;
        var simulacao = { simulacaoId: simulacaoId };
        fetch('http://localhost:3000/aprovarFormulario', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(simulacao)
        }).then(function (response) {
            return response.json();
        }).then(function (aprovado) {
            var divAprovados = document.getElementById('aprovados');
            var divBox = document.createElement('div');
            divBox.className = "aprovados__box";
            divAprovados.appendChild(divBox);
            var paragraphSimulacao = document.createElement('p');
            var paragraphData = document.createElement('p');
            paragraphSimulacao.innerHTML = "Numero da simulacao: " + aprovado.simulacao_aprovada_id;
            paragraphData.innerHTML = "Data de aprovacao: " + aprovado.datetime;
            divBox.appendChild(paragraphSimulacao);
            divBox.appendChild(paragraphData);
            var downloadButton = document.createElement('a');
            downloadButton.href = "http://localhost:3000/download/" + aprovado.file_name + ".csv";
            downloadButton.innerHTML = "Clique para baixar";
            divBox.appendChild(downloadButton);
        });
    }

    var form = document.getElementById('form');

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        enviarForm();
    });

    var aprovarButton = document.getElementById('aprovarButton');

    aprovarButton.addEventListener("click", function (event) {
        enviarAprovacao();
    });
});

document.addEventListener('DOMContentLoaded', function (event) {
    //Busca concorrentes
    fetch('http://localhost:3000/concorrentes', {
        method: "GET"
    }).then(function (response) {
        return response.json();
    }).then(function (concorrentes) {
        var selectConcorrente = document.getElementById('concorrente');
        for (var i = 0; i < concorrentes.length; i++) {
            var option = document.createElement('option');
            option.value = concorrentes[i].id;
            option.text = concorrentes[i].nome;
            selectConcorrente.appendChild(option);
        }
    }).catch(function (error) {
        console.log(error);
    });

    //Busca ramos
    fetch('http://localhost:3000/ramos', {
        method: "GET"
    }).then(function (response) {
        return response.json();
    }).then(function (ramos) {
        var selectConcorrente = document.getElementById('ramo');
        for (var i = 0; i < ramos.length; i++) {
            var option = document.createElement('option');
            option.value = ramos[i].id;
            option.text = ramos[i].atividade;
            selectConcorrente.appendChild(option);
        }
    }).catch(function (error) {
        console.log(error);
    });

    fetch('http://localhost:3000/aprovados', {
        method: "GET",
        headers: new Headers({
            "Content-Type": "json"
        })
    }).then(function (response) {
        return response.json();
    }).then(function (aprovados) {
        var divAprovados = document.getElementById('aprovados');

        for (var i = 0; i < aprovados.length; i++) {
            var divBox = document.createElement('div');
            divBox.className = "aprovados__box";
            divAprovados.appendChild(divBox);
            var paragraphSimulacao = document.createElement('p');
            var paragraphData = document.createElement('p');
            paragraphSimulacao.innerHTML = "Numero da simulacao: " + aprovados[i].simulacao_id;
            paragraphData.innerHTML = "Data de aprovacao: " + aprovados[i].data_aceite;
            divBox.appendChild(paragraphSimulacao);
            divBox.appendChild(paragraphData);
            var downloadButton = document.createElement('a');
            downloadButton.href = "http://localhost:3000/download/" + aprovados[i].nome_arquivo + ".csv";
            downloadButton.innerHTML = "Clique para baixar";
            divBox.appendChild(downloadButton);
        }
    }).catch(function (error) {
        console.log(error);
    });
});
