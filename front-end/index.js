window.addEventListener("load", function() {
    function enviarForm() {
        let concorrente = document.getElementById("concorrente").value;
        let cpfCnpj = document.getElementById("cpfCnpj").value;
        let telefone = document.getElementById("telefone").value;
        let email = document.getElementById("ramo").value;
        let ramo = document.getElementById("ramo").value;
        let taxaDebito = document.getElementById("taxaDebito").value;
        let descontoDebito = document.getElementById("descontoDebito").value;
        let taxaCredito = document.getElementById("taxaCredito").value;
        let descontoCredito = document.getElementById("descontoCredito").value;
        
        let formData = {
            concorrente,
            cpfCnpj,
            telefone,
            email,
            ramo,
            taxaDebito,
            descontoDebito,
            taxaCredito,
            descontoCredito
        }

        //FETCH --> backend
        fetch('http://localhost:3000/enviaFormulario', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        }).then(response => response.json())
        .then(aprovacao => {
            if (aprovacao.aprovado === false) {

            } else {
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
        })
    }

    function enviarAprovacao() {
        let simulacaoId = document.getElementById("aprovacaoSimulacaoId").innerText;
        let simulacao = { simulacaoId };
        fetch('http://localhost:3000/aprovarFormulario', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(simulacao)
        }).then(response => response.json())
        .then(aprovado => {
            let divAprovados = document.getElementById('aprovados');
            let divBox = document.createElement('div');
            divBox.className = "aprovados__box";
            divAprovados.appendChild(divBox);
            let paragraphSimulacao = document.createElement('p');
            let paragraphData = document.createElement('p');
            paragraphSimulacao.innerHTML = "Numero da simulacao: " + aprovado.simulacao_aprovada_id;
            paragraphData.innerHTML = "Data de aprovacao: " + aprovado.datetime;
            divBox.appendChild(paragraphSimulacao);
            divBox.appendChild(paragraphData);
            let downloadButton = document.createElement('a');
            downloadButton.href = `http://localhost:3000/download/${aprovado.file_name}.csv`;
            downloadButton.innerHTML = "Clique para baixar";
            divBox.appendChild(downloadButton);
        });
    }

    let form = document.getElementById('form');
  
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        enviarForm();
    });

    let aprovarButton = document.getElementById('aprovarButton');

    aprovarButton.addEventListener("click", function(event) {
        enviarAprovacao();
    });

});

document.addEventListener('DOMContentLoaded', function(event) {
    //Busca concorrentes
    fetch('http://localhost:3000/concorrentes', {
        method: "GET",
    }).then(response => response.json())
    .then(concorrentes => {
        let selectConcorrente = document.getElementById('concorrente');
        for (let i = 0; i<concorrentes.length; i++) {
            let option = document.createElement('option');
            option.value = concorrentes[i].id;
            option.text = concorrentes[i].nome;
            selectConcorrente.appendChild(option);
        }
    }).catch(error => {
        console.log(error);
    })

    //Busca ramos
    fetch('http://localhost:3000/ramos', {
        method: "GET",
    }).then(response => response.json())
    .then(ramos => {
        let selectConcorrente = document.getElementById('ramo');
        for (let i = 0; i<ramos.length; i++) {
            let option = document.createElement('option');
            option.value = ramos[i].id;
            option.text = ramos[i].atividade;
            selectConcorrente.appendChild(option);
        }
    }).catch(error => {
        console.log(error);
    })

    fetch('http://localhost:3000/aprovados', {
        method: "GET",
        headers: new Headers({
            "Content-Type": "json"
        })
    }).then(response => response.json())
    .then(aprovados => {
        let divAprovados = document.getElementById('aprovados');

        for (let i = 0; i<aprovados.length; i++) {
            let divBox = document.createElement('div');
            divBox.className = "aprovados__box";
            divAprovados.appendChild(divBox);
            let paragraphSimulacao = document.createElement('p');
            let paragraphData = document.createElement('p');
            paragraphSimulacao.innerHTML = "Numero da simulacao: " + aprovados[i].simulacao_id;
            paragraphData.innerHTML = "Data de aprovacao: " + aprovados[i].data_aceite;
            divBox.appendChild(paragraphSimulacao);
            divBox.appendChild(paragraphData);
            let downloadButton = document.createElement('a');
            downloadButton.href = `http://localhost:3000/download/${aprovados[i].nome_arquivo}.csv`;
            downloadButton.innerHTML = "Clique para baixar";
            divBox.appendChild(downloadButton);
        }
    }).catch(error => {
        console.log(error);
    })
});