const express = require("express");
const rotas = express();
const Sequelize = require("sequelize");
const cors = require("cors");

rotas.use(cors());
rotas.use(express.json());

// Conexão com o banco de dados
const conexaoComBanco = new Sequelize("agenda_escolar", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

// Model de Aluno
const Aluno = conexaoComBanco.define("alunos", {
  nm_aluno: { type: Sequelize.STRING },
  email: { type: Sequelize.STRING, unique: true },
  idade: { type: Sequelize.INTEGER },
  serie: { type: Sequelize.STRING },
  senha: { type: Sequelize.STRING },
});

// Model de Evento
const Evento = conexaoComBanco.define("eventos", {
  nm_evento: { type: Sequelize.STRING },
  data: { type: Sequelize.DATE },
  descricao_evento: { type: Sequelize.STRING },
});

// Model de Tarefa
const Tarefa = conexaoComBanco.define("tarefas", {
  descricao_tarefa: { type: Sequelize.STRING },
  prazo: { type: Sequelize.DATE },
  materia: { type: Sequelize.STRING },
});

// Sincronização com o Banco de Dados
const syncDatabase = async () => {
  try {
    await Aluno.sync({ force: false });
    await Evento.sync({ force: false });
    await Tarefa.sync({ force: false });
    console.log("Tabelas sincronizadas corretamente.");
  } catch (error) {
    console.error("Erro ao sincronizar as tabelas:", error);
  }
};

syncDatabase();

// Rota principal
rotas.get("/", (req, res) => {
  res.send("Rota principal");
});

// Rota de login do aluno
rotas.post("/login-aluno", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: "E-mail e senha são obrigatórios!" });
  }

  try {
    const aluno = await Aluno.findOne({ where: { email } });

    if (!aluno) {
      return res.status(404).json({ mensagem: "Aluno não encontrado!" });
    }

    if (aluno.senha !== senha) {
      return res.status(400).json({ mensagem: "Senha incorreta!" });
    }

    res.json(aluno);
  } catch (error) {
    res.status(500).json({ mensagem: `Erro ao realizar login: ${error.message}` });
  }
});


rotas.post("/alunos", async (req, res) => {
  const { nm_aluno, email, idade, serie, senha } = req.body;

  if (!nm_aluno || !email || !senha) {
    return res.status(400).json({ mensagem: "Nome, email e senha são obrigatórios!" });
  }

  try {
    const novoAluno = await Aluno.create({
      nm_aluno,  // Nome atualizado para corresponder ao modelo
      email,
      idade,
      serie,
      senha,
    });

    res.status(201).json(novoAluno);
  } catch (error) {
    res.status(500).json({ mensagem: `Erro ao cadastrar aluno: ${error.message}` });
  }
});

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

// Rota para buscar um registro por ID
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

rotas.post("/eventos", async (req, res) => {
  const { nm_evento, data, descricao_evento } = req.body;

  if (!nm_evento || !data || !descricao_evento) {
    return res.status(400).json({ mensagem: "Todos os campos são obrigatórios!" });
  }

  try {
    const novoEvento = await Evento.create({
      nm_evento,
      data,
      descricao_evento,
    });
    res.status(201).json({ mensagem: "Evento cadastrado com sucesso!", evento: novoEvento });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: `Erro ao cadastrar evento: ${error.message}` });
  }
});

rotas.post("/tarefas", async (req, res) => {
  console.log("Dados recebidos:", req.body); 

  const { descricao_tarefa, prazo, materia } = req.body;

  if (!descricao_tarefa || !prazo || !materia) {
    return res.status(400).json({ mensagem: "Todos os campos são obrigatórios!" });
  }

  try {
    const novaTarefa = await Tarefa.create({ descricao_tarefa, prazo, materia });
    res.status(201).json({ mensagem: "Tarefa cadastrada com sucesso!", tarefa: novaTarefa });
  } catch (error) {
    console.error("Erro ao cadastrar tarefa:", error); 
    res.status(500).json({ mensagem: `Erro ao cadastrar tarefa: ${error.message}` });
  }
});


// Rota para deletar um registro
rotas.get("/deletar/:tipo/:id", async (req, res) => {
  const { tipo, id } = req.params;
  const idNumber = parseInt(id, 10); // Converte o ID para número

  const Model = tipo === "alunos" ? Aluno : tipo === "eventos" ? Evento : tipo === "tarefas" ? Tarefa : null;

  if (!Model) return res.status(400).json({ mensagem: "Tipo inválido!" });

  try {
    const deleted = await Model.destroy({
      where: { id: idNumber },
    });

    if (deleted) {
      res.json({ mensagem: `${tipo.slice(0, -1)} deletado com sucesso!` });
    } else {
      res.status(404).json({ mensagem: `${tipo.slice(0, -1)} não encontrado!` });
    }
  } catch (error) {
    res.status(500).json({ mensagem: `Erro ao deletar ${tipo.slice(0, -1)}: ${error.message}` });
  }
});

// Rota para atualizar um registro
rotas.put("/:tipo/:id", async (req, res) => {
  const { tipo, id } = req.params;
  const { ...dadosAtualizados } = req.body;

  const Model = tipo === "alunos" ? Aluno : tipo === "eventos" ? Evento : tipo === "tarefas" ? Tarefa : null;

  if (!Model) return res.status(400).json({ mensagem: "Tipo inválido!" });

  try {
    const registro = await Model.findByPk(id);
    if (!registro) return res.status(404).json({ mensagem: `${tipo.slice(0, -1)} não encontrado!` });

    // Atualizando o registro
    await registro.update(dadosAtualizados);

    res.json({ mensagem: `${tipo.slice(0, -1)} atualizado com sucesso!`, registro });
  } catch (error) {
    res.status(500).json({ mensagem: `Erro ao atualizar ${tipo.slice(0, -1)}: ${error.message}` });
  }
});


rotas.listen(3035, () => {
  console.log("Servidor rodando na porta 3035...");
});
