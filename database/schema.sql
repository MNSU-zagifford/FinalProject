-- ========================================================
-- CIS 483 / 583 - Term Project: MNSU CampusEco
-- Phase 3: Task 3.4 - Relational Database Schema
-- Authors: Pratik Niroula, Zachary Gifford, Yeabsra Tetemke, Kirubel Dula
-- Database: MySQL / MariaDB (3-Table Relational Schema)
-- ========================================================

CREATE DATABASE IF NOT EXISTS `mnsu_campuseco`;
USE `mnsu_campuseco`;

-- 1. Table for Electric Delivery Fleet
DROP TABLE IF EXISTS `delivery_events`;
DROP TABLE IF EXISTS `packages`;
DROP TABLE IF EXISTS `vehicles`;

CREATE TABLE `vehicles` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `cart_code` VARCHAR(20) NOT NULL UNIQUE,       -- e.g. 'cart04'
    `name` VARCHAR(50) NOT NULL,                    -- e.g. 'EcoCart 04'
    `battery_level` INT NOT NULL DEFAULT 100,      -- 0 to 100%
    `status` ENUM('Available', 'On Delivery', 'Charging', 'Maintenance') DEFAULT 'Available'
);

-- 2. Table for Campus Packages
CREATE TABLE `packages` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `tracking_number` VARCHAR(30) NOT NULL UNIQUE,   -- e.g. 'PKG10234'
    `destination` VARCHAR(120) NOT NULL,            -- e.g. 'Julia Sears Residence'
    `assigned_vehicle_id` INT NULL,                 -- Relational Foreign Key to vehicles
    `size` ENUM('Small', 'Medium', 'Large') DEFAULT 'Medium',
    `weight` DECIMAL(5,2) DEFAULT 1.00,
    `priority` ENUM('Normal', 'Urgent') DEFAULT 'Normal',
    `status` ENUM('Received', 'Loaded', 'En Route', 'Delivered') DEFAULT 'Received',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`assigned_vehicle_id`) REFERENCES `vehicles`(`id`) ON DELETE SET NULL
);

-- 3. Table for Delivery Events (Audit Trail)
CREATE TABLE `delivery_events` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `package_id` INT NOT NULL,                     -- Relational Foreign Key to packages
    `kind` ENUM('Registration', 'Status', 'Delivery') NOT NULL,
    `detail` VARCHAR(255) NOT NULL,
    `logged_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON DELETE CASCADE
);

-- Seed Data (Matches Live Website Demo)
INSERT INTO `vehicles` (`cart_code`, `name`, `battery_level`, `status`) VALUES
('cart04', 'EcoCart 04', 82, 'On Delivery'),
('cart07', 'EcoCart 07', 95, 'Available');

INSERT INTO `packages` (`tracking_number`, `destination`, `assigned_vehicle_id`, `size`, `weight`, `priority`, `status`) VALUES
('PKG10234', 'Julia Sears Residence', 1, 'Medium', 4.5, 'Normal', 'Loaded'),
('PKG12345', 'Preska Residence Hall', 1, 'Small', 2.0, 'Normal', 'Received'),
('PKG39281', 'Centennial Student Union', 1, 'Small', 1.2, 'Urgent', 'En Route'),
('PKG57321', 'Memorial Library', NULL, 'Large', 12.0, 'Normal', 'Received'),
('PKG84920', 'Armstrong Hall', 1, 'Medium', 3.8, 'Normal', 'Delivered');

INSERT INTO `delivery_events` (`package_id`, `kind`, `detail`) VALUES
(1, 'Registration', 'Checked in at Ellis Hub'),
(1, 'Status', 'Loaded into EcoCart 04'),
(2, 'Registration', 'Checked in at Ellis Hub');
