-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 12, 2025 at 08:39 PM
-- Server version: 12.0.2-MariaDB
-- PHP Version: 8.4.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gestion_vacaciones`
--

-- --------------------------------------------------------

--
-- Table structure for table `solicitud_vacaciones`
--

CREATE TABLE `solicitud_vacaciones` (
  `id` int(11) NOT NULL,
  `trabajador_id` int(11) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `cantidad_dias` decimal(5,2) NOT NULL,
  `estado` enum('pendiente','aprobada','rechazada') DEFAULT 'pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Dumping data for table `solicitud_vacaciones`
--

INSERT INTO `solicitud_vacaciones` (`id`, `trabajador_id`, `fecha_inicio`, `fecha_fin`, `cantidad_dias`, `estado`) VALUES
(1, 1, '2025-11-15', '2025-11-20', 5.00, 'aprobada'),
(2, 1, '2025-11-15', '2025-11-20', 6.00, 'pendiente'),
(3, 1, '2025-11-15', '2025-11-20', 6.00, 'pendiente'),
(4, 1, '2025-11-15', '2025-11-15', 0.50, 'pendiente'),
(5, 3, '2025-11-15', '2025-11-20', 6.00, 'aprobada'),
(6, 1, '2025-11-15', '2025-11-15', 0.50, 'pendiente'),
(7, 3, '2025-11-03', '2025-11-14', 12.00, 'rechazada');

-- --------------------------------------------------------

--
-- Table structure for table `trabajador`
--

CREATE TABLE `trabajador` (
  `codigo` int(11) NOT NULL,
  `cedula_identidad` varchar(20) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `fecha_ingreso` date NOT NULL,
  `area` varchar(100) DEFAULT NULL,
  `cargo` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Dumping data for table `trabajador`
--

INSERT INTO `trabajador` (`codigo`, `cedula_identidad`, `nombre`, `fecha_ingreso`, `area`, `cargo`) VALUES
(1, '12345678', 'Juan Pérez', '2025-11-12', 'Recursos Humanos', 'Analista'),
(3, '1234567', 'Pedro Pozo', '2025-11-12', 'Sistemas', 'Backend');

-- --------------------------------------------------------

--
-- Table structure for table `vacaciones_acumuladas`
--

CREATE TABLE `vacaciones_acumuladas` (
  `id` int(11) NOT NULL,
  `trabajador_id` int(11) NOT NULL,
  `dias_acumulados` decimal(5,2) DEFAULT 0.00 COMMENT 'Días de vacaciones ganados',
  `dias_tomados` decimal(5,2) DEFAULT 0.00 COMMENT 'Días ya utilizados',
  `dias_disponibles` decimal(5,2) DEFAULT 0.00 COMMENT 'Días restantes'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `solicitud_vacaciones`
--
ALTER TABLE `solicitud_vacaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_solicitud_trabajador` (`trabajador_id`);

--
-- Indexes for table `trabajador`
--
ALTER TABLE `trabajador`
  ADD PRIMARY KEY (`codigo`),
  ADD UNIQUE KEY `cedula_identidad` (`cedula_identidad`);

--
-- Indexes for table `vacaciones_acumuladas`
--
ALTER TABLE `vacaciones_acumuladas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_vacaciones_trabajador` (`trabajador_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `solicitud_vacaciones`
--
ALTER TABLE `solicitud_vacaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `trabajador`
--
ALTER TABLE `trabajador`
  MODIFY `codigo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `vacaciones_acumuladas`
--
ALTER TABLE `vacaciones_acumuladas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `solicitud_vacaciones`
--
ALTER TABLE `solicitud_vacaciones`
  ADD CONSTRAINT `fk_solicitud_trabajador` FOREIGN KEY (`trabajador_id`) REFERENCES `trabajador` (`codigo`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `vacaciones_acumuladas`
--
ALTER TABLE `vacaciones_acumuladas`
  ADD CONSTRAINT `fk_vacaciones_trabajador` FOREIGN KEY (`trabajador_id`) REFERENCES `trabajador` (`codigo`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
