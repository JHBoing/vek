CREATE DATABASE avaliacao_vek;
USE avaliacao_vek;

CREATE TABLE IF NOT EXISTS ramo (
	id INT NOT NULL AUTO_INCREMENT,
    atividade TEXT NOT NULL,
    taxa_minima_debito DOUBLE NOT NULL,
    taxa_minima_credito DOUBLE NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS concorrente (
	id INT NOT NULL AUTO_INCREMENT,
    nome TEXT NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS simulacao (
	id INT NOT NULL AUTO_INCREMENT,
    concorrente_id INT NOT NULL,
    cpf_cnpj text NOT NULL,
    telefone TEXT NOT NULL,
    email TEXT,
    ramo_id INT NOT NULL,
    taxa_debito_concorrente DOUBLE NOT NULL,
    desconto_debito DOUBLE NOT NULL,
    taxa_credito_concorrente DOUBLE NOT NULL,
    desconto_credito DOUBLE NOT NULL,
    FOREIGN KEY (concorrente_id) REFERENCES concorrente(id),
	FOREIGN KEY (ramo_id) REFERENCES ramo(id),
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS simulacoes_aceitas (
	id INT NOT NULL AUTO_INCREMENT,
    simulacao_id INT NOT NULL,
	data_aceite DATE,
    nome_arquivo TEXT NOT NULL,
    PRIMARY KEY(id)
);

INSERT INTO concorrente (nome) VALUES
('Empresa 1'), ('Empresa 2'), ('Empresa 3');

INSERT INTO ramo (atividade, taxa_minima_debito, taxa_minima_credito) VALUES
('Atividade 1', 2, 5),
('Atividade 2', 5, 5),
('Atividade 3', 3, 9),
('Atividade 4', 1, 3),
('Atividade 5', 2, 5);

INSERT INTO simulacao (concorrente_id, cpf_cnpj, telefone, email, ramo_id, taxa_debito_concorrente, desconto_debito, taxa_credito_concorrente, desconto_credito) VALUES
(2, '555.555.555.55', '4899999999', 'email@email.com', 4, 10, 50, 9, 25);

INSERT INTO simulacoes_aceitas (simulacao_id, data_aceite, nome_arquivo) VALUES (1, '2019-01-29', 'nome');