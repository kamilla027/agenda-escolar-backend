const express = require("express");
const rotas = express();
const Sequelize = require("sequelize");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

rotas.use(cors());
rotas.use(express.json());

const conexaoComBanco = new Sequelize("agenda_escolar", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

// Definindo os modelos
const Aluno = conexaoComBanco.define("alunos", {
  nome: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
  },
  idade: {
    type: Sequelize.INTEGER,
  },
  serie: {
    type: Sequelize.STRING,
  },
});

const Evento = conexaoComBanco.define("eventos", {
  nome: {
    type: Sequelize.STRING,
  },
  data: {
    type: Sequelize.DATE,
  },
  descricao: {
    type: Sequelize.STRING,
  },
});

const Tarefa = conexaoComBanco.define("tarefas", {
  descricao: {
    type: Sequelize.STRING,
  },
  prazo: {
    type: Sequelize.DATE,
  },
  materia: {
    type: Sequelize.STRING,
  },
});

// Sincronizando os modelos com o banco
Aluno.sync({ force: false });
Evento.sync({ force: false });
Tarefa.sync({ force: false });

// Rotas

// Rota para cadastrar aluno
rotas.post("/alunos", async (req, res) => {
  const { nome, email, idade, serie } = req.body;
  try {
    const novoAluno = await Aluno.create({ nome, email, idade, serie });
    res.json({ mensagem: "Aluno cadastrado com sucesso", aluno: novoAluno });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao cadastrar aluno", error });
  }
});

// Rota para listar todos os alunos
rotas.get("/alunos", async (req, res) => {
  try {
    const alunos = await Aluno.findAll();
    res.json(alunos);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar alunos", error });
  }
});

// Rota para cadastrar evento
rotas.post("/eventos", async (req, res) => {
  const { nome, data, descricao } = req.body;
  try {
    const novoEvento = await Evento.create({ nome, data, descricao });
    res.json({ mensagem: "Evento cadastrado com sucesso", evento: novoEvento });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao cadastrar evento", error });
  }
});

// Rota para listar todos os eventos
rotas.get("/eventos", async (req, res) => {
  try {
    const eventos = await Evento.findAll();
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar eventos", error });
  }
});

// Rota para cadastrar tarefa
rotas.post("/tarefas", async (req, res) => {
  const { descricao, prazo } = req.body;
  try {
    const novaTarefa = await Tarefa.create({ descricao, prazo });
    res.json({ mensagem: "Tarefa cadastrada com sucesso", tarefa: novaTarefa });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao cadastrar tarefa", error });
  }
});

// Rota para listar todas as tarefas
rotas.get("/tarefas", async (req, res) => {
  try {
    const tarefas = await Tarefa.findAll();
    res.json(tarefas);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar tarefas", error });
  }
});

// Servidor
rotas.listen(3035, () => {
  console.log("Servidor rodando na porta 3035");
});
