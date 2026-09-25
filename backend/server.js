const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// Porta que será ouvida pelo servidor.
const PORT = process.env.SERVER_PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

// Comando de teste
app.get('/', (req, res) => {
    res.send('API funcionando!');
});

// Pega todas as consultas não canceladas
app.get('/api/consultas', async (req, res) => {
    const { nomeUsuario, ehMedicoStr } = req.query;
    const ehMedico = ehMedicoStr === 'true';
    const coluna = ehMedico ? 'nome_medico' : 'nome_paciente';

    try {
        const result = await pool.query(`SELECT * FROM consultas WHERE NOT cancelada AND ${coluna} = $1 ORDER BY data, hora`, [nomeUsuario]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao exibir consultas' });
    }
});

// Cria uma consulta
app.post('/api/consultas', async (req, res) => {
    const { nome_paciente, nome_medico, data, hora, ehMedico } = req.body;
    const medico = ehMedico === 'true';
    try {
        // Verifica se o médico ou paciente digitado existe no banco de dados
        const nome_cliente = medico ? nome_medico : nome_paciente;
        const verificacao = await pool.query(
            `SELECT codigo FROM ${medico ? 'medicos' : 'pacientes'} WHERE nome = $1`,
            [nome_cliente]
        );

        if (verificacao.rows.length === 0) {
            return res.status(400).json({error: 'Médico ou paciente não cadastrado na base de dados.'});
        }

        const result = await pool.query(
            'INSERT INTO consultas (nome_paciente, nome_medico, data, hora, cancelada) VALUES ($1, $2, $3, $4, false) RETURNING *',
            [nome_paciente, nome_medico, data, hora]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar consulta' });
    }
});

// Cancela uma consulta
app.patch('/api/consultas/:codigo/cancelar', async (req, res) => {
    const { codigo } = req.params;
    try {
        const result = await pool.query(
            'UPDATE consultas SET cancelada = true WHERE codigo = $1 RETURNING *',
            [codigo]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Consulta não encontrada' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao cancelar consulta' });
    }
});

// Edita uma consulta (somente data e hora podem ser mudadas)
app.patch('/api/consultas/:codigo/editar', async (req, res) => {
    const { codigo } = req.params;
    const { nova_hora, nova_data } = req.body;
    try {
        const result = await pool.query(
            'UPDATE consultas SET hora = $1, data = $2 WHERE codigo = $3 RETURNING *',
            [nova_hora, nova_data, codigo]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Consulta não encontrada' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao editar consulta' });
    }
});

// Registro de novos usuários
app.post('/api/registrar', async (req, res) => {
    const { nome, senha, ehMedico } = req.body;

    if (!nome?.trim() || !senha) {
        return res.status(400).json({ error: 'Nome e senha são obrigatórios' });
    }

    try {
        const senhaHash = await bcrypt.hash(senha, 10);

        const result = await pool.query(
            `INSERT INTO ${ehMedico ? 'medicos' : 'pacientes'} (nome, senha) VALUES ($1, $2) RETURNING codigo, nome`,
            [nome, senhaHash]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') { // Código de erro para violação de atributo único no Postgres
            return res.status(409).json({ error: 'Já existe um usuário com esse nome.' });
        }
        console.error(err);
        res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
});

// Login de usuário
app.post('/api/login', async (req, res) => {
    const { nome, senha, ehMedico } = req.body;

    try {
        const result = await pool.query(`SELECT * FROM ${ehMedico ? 'medicos' : 'pacientes'} WHERE nome = $1`, [nome]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Nome ou senha incorretos' });
        }

        const usuario = result.rows[0];
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(401).json({ error: 'Nome ou senha incorretos' });
        }

        res.json({ codigo: usuario.codigo, nome: usuario.nome });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});