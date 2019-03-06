-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Client :  127.0.0.1
-- Généré le :  Mer 06 Mars 2019 à 10:33
-- Version du serveur :  5.7.14
-- Version de PHP :  5.6.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `mrow_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `directory`
--

CREATE TABLE `directory` (
  `id` int(11) NOT NULL,
  `phone_number` varchar(8) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `job` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Contenu de la table `directory`
--

INSERT INTO `directory` (`id`, `phone_number`, `last_name`, `first_name`, `job`) VALUES
(1, '420-2727', 'Orwell', 'Kyle', 'LSPD');

-- --------------------------------------------------------

--
-- Structure de la table `ranks`
--

CREATE TABLE `ranks` (
  `id` int(11) NOT NULL,
  `rank_name` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Contenu de la table `ranks`
--

INSERT INTO `ranks` (`id`, `rank_name`) VALUES
(1, 'Cadet'),
(2, 'Officier'),
(3, 'Sergent'),
(4, 'Sergent-Chef'),
(5, 'Lieutenant'),
(6, 'Capitaine'),
(7, 'Major'),
(8, 'Commandant'),
(9, 'Directeur'),
(10, 'Administrateur');

-- --------------------------------------------------------

--
-- Structure de la table `records`
--

CREATE TABLE `records` (
  `id` int(11) NOT NULL,
  `person_id` int(11) NOT NULL,
  `offense` text NOT NULL,
  `date` timestamp NOT NULL,
  `recidivism` tinyint(1) NOT NULL,
  `manner` text NOT NULL,
  `fine` text NOT NULL,
  `prison_time` text NOT NULL,
  `in_charge` int(11) NOT NULL,
  `note` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `records_individuals`
--

CREATE TABLE `records_individuals` (
  `id` int(11) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `phone_number` varchar(8) NOT NULL,
  `job` varchar(255) NOT NULL,
  `note` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `signup_keys`
--

CREATE TABLE `signup_keys` (
  `key1` varchar(4) NOT NULL,
  `key2` varchar(4) NOT NULL,
  `key3` varchar(4) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Contenu de la table `signup_keys`
--

INSERT INTO `signup_keys` (`key1`, `key2`, `key3`) VALUES
('2839', 'YCxl', '9294');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `matricule` varchar(16) DEFAULT NULL,
  `password` varchar(60) DEFAULT NULL,
  `rank` int(11) NOT NULL DEFAULT '1',
  `last_name` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Contenu de la table `users`
--

INSERT INTO `users` (`id`, `matricule`, `password`, `rank`, `last_name`, `first_name`) VALUES
(23, '20', '6607a999607711cd339dce1de6d64425a0985cfd', 10, 'Orwell', 'Kyle'),
(24, '00', '6607a999607711cd339dce1de6d64425a0985cfd', 9, 'Holt', 'Ray'),
(25, '08', '6607a999607711cd339dce1de6d64425a0985cfd', 8, 'Harrington', 'William'),
(27, '50', '1caf85936167fd1471aa94061ffc0f13e3ec57df', 1, 'de Rixensart', 'Ambroise');

--
-- Index pour les tables exportées
--

--
-- Index pour la table `directory`
--
ALTER TABLE `directory`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `ranks`
--
ALTER TABLE `ranks`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `records`
--
ALTER TABLE `records`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `records_individuals`
--
ALTER TABLE `records_individuals`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `directory`
--
ALTER TABLE `directory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT pour la table `ranks`
--
ALTER TABLE `ranks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT pour la table `records`
--
ALTER TABLE `records`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `records_individuals`
--
ALTER TABLE `records_individuals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
