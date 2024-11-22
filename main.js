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
  nome: { type: Sequelize.STRING },
  email: { type: Sequelize.STRING, unique: true },
  idade: { type: Sequelize.INTEGER },
  serie: { type: Sequelize.STRING },
  senha: { type: Sequelize.STRING },
});

// Model de Evento
const Evento = conexaoComBanco.define("eventos", {
  nome: { type: Sequelize.STRING },
  data: { type: Sequelize.DATE },
  descricao: { type: Sequelize.STRING },
});

// Model de Tarefa
const Tarefa = conexaoComBanco.define("tarefas", {
  descricao: { type: Sequelize.STRING },
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

// Rota para salvar (exemplo de cadastro de aluno)
rotas.post("/alunos", async (req, res) => {
  const { nome, email, idade, serie, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ mensagem: "Nome, email e senha são obrigatórios!" });
  }

  try {
    const novoAluno = await Aluno.create({
      nome,
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

// Rota para listar todos os registros
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

// Rota para editar um aluno, evento ou tarefa com parâmetros na URL
rotas.put("/editar/alunos/:id/:nome/:email/:idade/:serie/:senha", async (req, res) => {
  const { id, nome, email, idade, serie, senha } = req.params;

  try {
    const aluno = await Aluno.findByPk(id);
    if (aluno) {
      await aluno.update({ nome, email, idade, serie, senha });
      res.json({ mensagem: "Aluno atualizado com sucesso!" });
    } else {
      res.status(404).json({ mensagem: "Aluno não encontrado!" });
    }
  } catch (error) {
    res.status(500).json({ mensagem: `Erro ao editar aluno: ${error.message}` });
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

// Inicializando o servidor
rotas.listen(3035, () => {
  console.log("Servidor rodando na porta 3035...");
});
