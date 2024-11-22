const express = require("express");
const rotas = express();
const Sequelize = require("sequelize");
const cors = require("cors");
const bcrypt = require("bcryptjs");

rotas.use(cors());
rotas.use(express.json());

const conexaoComBanco = new Sequelize("agenda_escolar", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

const Aluno = conexaoComBanco.define("alunos", {
  nome: { type: Sequelize.STRING },
  email: { type: Sequelize.STRING, unique: true },
  idade: { type: Sequelize.INTEGER },
  serie: { type: Sequelize.STRING },
  senha: { type: Sequelize.STRING },
});

const Evento = conexaoComBanco.define("eventos", {
  nome: { type: Sequelize.STRING },
  data: { type: Sequelize.DATE },
  descricao: { type: Sequelize.STRING },
});

const Tarefa = conexaoComBanco.define("tarefas", {
  descricao: { type: Sequelize.STRING },
  prazo: { type: Sequelize.DATE },
  materia: { type: Sequelize.STRING },
});

Aluno.sync({ force: false });
Evento.sync({ force: false });
Tarefa.sync({ force: false });

rotas.get("/:tipo", async (req, res) => {
  const { tipo } = req.params;
  const Model = tipo === "alunos" ? Aluno : tipo === "eventos" ? Evento : tipo === "tarefas" ? Tarefa : null;

  if (!Model) return res.status(400).json({ mensagem: "Tipo inválido!" });

  try {
    const registros = await Model.findAll();
    res.json(registros);
  } catch (error) {
    res.status(500).json({ mensagem: `Erro ao carregar ${tipo}: ${error.message}` });
  }
});

rotas.get("/:tipo/:id", async (req, res) => {
  const { tipo, id } = req.params;
  const Model = tipo === "alunos" ? Aluno : tipo === "eventos" ? Evento : tipo === "tarefas" ? Tarefa : null;

  if (!Model) return res.status(400).json({ mensagem: "Tipo inválido!" });

  try {
    const registro = await Model.findByPk(id);
    if (registro) res.json(registro);
    else res.status(404).json({ mensagem: `${tipo.slice(0, -1)} não encontrado!` });
  } catch (error) {
    res.status(500).json({ mensagem: `Erro ao carregar ${tipo.slice(0, -1)}: ${error.message}` });
  }
});

rotas.post("/:tipo", async (req, res) => {
  const { tipo } = req.params;
  const Model = tipo === "alunos" ? Aluno : tipo === "eventos" ? Evento : tipo === "tarefas" ? Tarefa : null;

  if (!Model) return res.status(400).json({ mensagem: "Tipo inválido!" });

  try {
    const novoRegistro = await Model.create(req.body);
    res.status(201).json(novoRegistro);
  } catch (error) {
    res.status(500).json({ mensagem: `Erro ao criar ${tipo.slice(0, -1)}: ${error.message}` });
  }
});

rotas.put("/:tipo/:id", async (req, res) => {
  const { tipo, id } = req.params;
  const Model = tipo === "alunos" ? Aluno : tipo === "eventos" ? Evento : tipo === "tarefas" ? Tarefa : null;

  if (!Model) return res.status(400).json({ mensagem: "Tipo inválido!" });

  try {
    const registro = await Model.findByPk(id);
    if (registro) {
      await registro.update(req.body);
      res.json({ mensagem: `${tipo.slice(0, -1)} atualizado com sucesso!` });
    } else {
      res.status(404).json({ mensagem: `${tipo.slice(0, -1)} não encontrado!` });
    }
  } catch (error) {
    res.status(500).json({ mensagem: `Erro ao atualizar ${tipo.slice(0, -1)}: ${error.message}` });
  }
});

conexaoComBanco.authenticate().then(() => {
  console.log("Conexão com o banco de dados estabelecida.");
  rotas.listen(3035, () => {
    console.log("Servidor rodando na porta 3035.");
  });
});
