-- ========================================================
-- CIS 483 / 583 - Term Project: MNSU CampusEco
-- Phase 3: Task 3.4 - Relational Database Schema
-- Author: Pratik Niroula
-- Database: MySQL / MariaDB
-- ========================================================

CREATE DATABASE IF NOT EXISTS `mnsu_campuseco`;
USE `mnsu_campuseco`;

-- 1. Table for EcoCart delivery carts
DROP TABLE IF EXISTS `vehicles`;
CREATE TABLE `vehicles` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `cart_code` VARCHAR(20) NOT NULL UNIQUE,
    `name` VARCHAR(50) NOT NULL,
    `battery_level` INT NOT NULL DEFAULT 100,
    `status` ENUM('Available', 'On Delivery', 'Charging', 'Maintenance') DEFAULT 'Available'
);

-- 2. Table for campus packages
DROP TABLE IF EXISTS `packages`;
CREATE TABLE `packages` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `tracking_number` VARCHAR(30) NOT NULL UNIQUE,
    `destination` VARCHAR(120) NOT NULL,
    `size` ENUM('Small', 'Medium', 'Large') DEFAULT 'Medium',
    `weight` DECIMAL(5,2) DEFAULT 1.00,
    `priority` ENUM('Normal', 'Urgent') DEFAULT 'Normal',
    `status` ENUM('Received', 'Loaded', 'En Route', 'Delivered') DEFAULT 'Received',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Initial test data for grading
INSERT INTO `vehicles` (`cart_code`, `name`, `battery_level`, `status`) VALUES
('cart04', 'EcoCart 04', 82, 'On Delivery'),
('cart07', 'EcoCart 07', 95, 'Available');

INSERT INTO `packages` (`tracking_number`, `destination`, `size`, `weight`, `priority`, `status`) VALUES
('PKG10234', 'Julia Sears Residence', 'Medium', 4.5, 'Normal', 'Loaded'),
('PKG39281', 'Centennial Student Union', 'Small', 1.2, 'Urgent', 'En Route'),
('PKG57321', 'Memorial Library', 'Large', 12.0, 'Normal', 'Received'),
('PKG84920', 'Armstrong Hall', 'Medium', 3.8, 'Normal', 'Delivered');
