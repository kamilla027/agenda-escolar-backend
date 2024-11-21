-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 21-Nov-2024 às 03:35
-- Versão do servidor: 10.4.32-MariaDB
-- versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `agenda_escolar`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `alunos`
--

CREATE TABLE `alunos` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `idade` int(11) DEFAULT NULL,
  `serie` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `alunos`
--

INSERT INTO `alunos` (`id`, `nome`, `email`, `idade`, `serie`, `createdAt`, `updatedAt`) VALUES
(1, 'mii', 'boaskamilla@gmail.com', 10, '3°', '2024-11-20 23:59:51', '2024-11-20 23:59:51'),
(2, 'ka', 'fffffffff@gmail.com', 13, '3°', '2024-11-21 00:07:20', '2024-11-21 00:07:20');

-- --------------------------------------------------------

--
-- Estrutura da tabela `eventos`
--

CREATE TABLE `eventos` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) DEFAULT NULL,
  `data` datetime DEFAULT NULL,
  `descricao` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `eventos`
--

INSERT INTO `eventos` (`id`, `nome`, `data`, `descricao`, `createdAt`, `updatedAt`) VALUES
(1, 'mii', '2222-02-22 00:00:00', 'asasassasasasa', '2024-11-21 01:10:48', '2024-11-21 01:10:48');

-- --------------------------------------------------------

--
-- Estrutura da tabela `tarefas`
--

CREATE TABLE `tarefas` (
  `id` int(11) NOT NULL,
  `descricao` varchar(255) DEFAULT NULL,
  `prazo` datetime DEFAULT NULL,
  `materia` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `tarefas`
--

INSERT INTO `tarefas` (`id`, `descricao`, `prazo`, `materia`, `createdAt`, `updatedAt`) VALUES
(1, 'pesquisa sobre teorema de pitágoras', '2004-12-12 00:00:00', NULL, '2024-11-21 00:39:00', '2024-11-21 00:39:00'),
(2, 'pesquisa sobre teorema de pitágoras', '3233-02-23 00:00:00', NULL, '2024-11-21 00:43:17', '2024-11-21 00:43:17'),
(3, 'asasassasasasa', '2024-11-06 00:00:00', NULL, '2024-11-21 01:07:14', '2024-11-21 01:07:14');

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `alunos`
--
ALTER TABLE `alunos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Índices para tabela `eventos`
--
ALTER TABLE `eventos`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `tarefas`
--
ALTER TABLE `tarefas`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `alunos`
--
ALTER TABLE `alunos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `eventos`
--
ALTER TABLE `eventos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `tarefas`
--
ALTER TABLE `tarefas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
