const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const uuidv4 = require('uuid/v4');


app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

//Pool de conexoes e queries

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'vek',
    password: 'vek',
    database: 'avaliacao_vek'
});

const getRamos = (request, response) => {
    pool.query('SELECT * FROM ramo ORDER BY atividade ASC', (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results);
    })
}

const getConcorrentes = (request, response) => {
    pool.query('SELECT * FROM concorrente ORDER BY nome ASC', (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results);
    })
}

const getAprovados = (request, response) => {
    pool.query('SELECT * FROM simulacoes_aceitas', (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results);
    })
}

const executaCalculo = (request, response) => {
    const req = request.body;
    let concorrente = req.concorrente;
    let cpfCnpj = req.cpfCnpj;
    let telefone = req.telefone;
    let email = req.email;
    let ramo = req.ramo;
    let taxaDebito = req.taxaDebito;
    let descontoDebito = req.descontoDebito;
    let taxaCredito = req.taxaCredito;
    let descontoCredito = req. descontoCredito;

    pool.query('SELECT * from ramo where id = ?', [ramo], (error, results) => {
        if (error) {
            throw error;
        }

        if (results[0] == undefined) {
            response.send({error: 'erro'});
        }

        let calculoDebito = taxaDebito - (taxaDebito*(descontoDebito/100));
        let calculoCredito = taxaCredito - (taxaCredito*(descontoCredito/100));
        if ((calculoDebito >= results[0].taxa_minima_debito) && (calculoCredito >= results[0].taxa_minima_credito)) {

            pool.query('INSERT INTO simulacao (concorrente_id, cpf_cnpj, telefone, email, ramo_id, taxa_debito_concorrente, desconto_debito, taxa_credito_concorrente, desconto_credito) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [concorrente, cpfCnpj, telefone, email, ramo, taxaDebito, descontoDebito, taxaCredito, descontoCredito],
            (error, results) => {
                if (error) {
                    throw error;
                }

                response.status(200).send(
                    {
                        concorrente,
                        cpfCnpj,
                        telefone,
                        email,
                        ramo,
                        taxaDebito,
                        descontoDebito,
                        taxaCredito,
                        descontoCredito,
                        simulacao_id: results.insertId,
                        aprovado: true
                    }
                );
            });

            
        } else if (calculoDebito < results[0].taxa_minima_debito) {
            response.send({ aprovado: false, error: "Desconto inviavel para debito"});
        } else {
            response.send({ aprovado: false, error: "Desconto inviavel para credito"});
        }
    })
}

const aprovarFormulario = (request, response) => {
    const req = request.body;

    //receber parametros

    let simulacaoId = req.simulacaoId;
    let datetime = new Date();
    datetime = datetime.getFullYear() + "-" + (datetime.getMonth() + 1) + "-" + datetime.getDate();
    let fileName = uuidv4();

    //criar arquivo
    pool.query('SELECT * FROM simulacao WHERE id = ?', [simulacaoId], (error, results) => {
        const csvWriter = createCsvWriter({
            path: `download/${fileName}.csv`,
            header: [
                {id: 'simulacaoId', title:'Numero da Simulacao'},
                {id: 'concorrente', title: 'Numero Concorrente'},
                {id: 'cpfCnpj', title: 'CPF - CNPJ'},
                {id: 'telefone', title:'Telefone'},
                {id: 'email', title:'Email'},
                {id: 'ramoId', title:'Numero do Ramo'},
                {id: 'taxaDebitoConcorrente', title:'Taxa Debito Concorrente'},
                {id: 'descontoDebito', title:'Desconto Debito'},
                {id: 'taxaCreditoConcorrente', title:'Taxa Credito Concorrente'},
                {id: 'descontoCredito', title:'Desconto Credito'}
            ]
        });

        const records = [
            {
                simulacaoId: results[0].id, 
                concorrente: results[0].concorrente_id,
                cpfCnpj: results[0].cpf_cnpj,
                telefone: results[0].telefone,
                email: results[0].email,
                ramoId: results[0].ramo_id,
                taxaDebitoConcorrente: results[0].taxa_debito_concorrente,
                descontoDebito: results[0].desconto_debito,
                taxaCreditoConcorrente: results[0].taxa_credito_concorrente,
                descontoCredito: results[0].desconto_credito
            },
        ];
    
        csvWriter.writeRecords(records)
        .then(() => {
            //inserir na database
            pool.query('INSERT INTO simulacoes_aceitas (simulacao_id, data_Aceite, nome_arquivo) VALUES (?, ?, ?)', [simulacaoId, datetime, fileName], (error, results) => {
                if (error) {
                    throw error;
                }
                
                response.status(200).send(
                    {
                        simulacao_aprovada_id: results.insertId,
                        file_name: fileName,
                        datetime
                    }
                )
            });
        });
    });
}

//ROUTES
app.get('/ramos', getRamos);
app.get('/concorrentes', getConcorrentes);
app.get('/aprovados', getAprovados);
app.post('/enviaFormulario', executaCalculo);
app.post('/aprovarFormulario', aprovarFormulario);

//Rota para download dos arquivos
app.get('/download/:file(*)',(req, res) => {
    var file = req.params.file;
    var fileLocation = path.join('./download',file);
    res.download(fileLocation, file); 
  });

app.listen(port, () => {
    console.log(`App rodando na porta ${port}.`);
});
