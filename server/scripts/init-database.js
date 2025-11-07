import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import readline from 'readline';

import { hashPassword } from '../config/auth.js';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function init() {
  try {
    console.log('🛠️  Initializing MySQL database...');

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306,
      multipleStatements: true,
    });

    const databaseName = process.env.DB_NAME || 'portfolio_admin';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    console.log(`✅ Database '${databaseName}' ensured.`);

    await connection.changeUser({ database: databaseName });

    const schemaSql = `
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(190) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        display_name VARCHAR(120) DEFAULT NULL,
        avatar_url VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(190) NOT NULL,
        slug VARCHAR(190) NOT NULL UNIQUE,
        description TEXT NOT NULL,
        role VARCHAR(120) DEFAULT NULL,
        stack JSON DEFAULT NULL,
        tags JSON DEFAULT NULL,
        tech VARCHAR(255) DEFAULT NULL,
        image VARCHAR(255) DEFAULT NULL,
        images JSON DEFAULT NULL,
        links JSON DEFAULT NULL,
        category VARCHAR(120) DEFAULT NULL,
        metrics JSON DEFAULT NULL,
        features JSON DEFAULT NULL,
        duration VARCHAR(120) DEFAULT NULL,
        client VARCHAR(190) DEFAULT NULL,
        order_index INT DEFAULT 0,
        is_featured TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS project_customizations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT NOT NULL,
        settings JSON NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_project (project_id),
        CONSTRAINT fk_customizations_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS site_customizations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(190) NOT NULL UNIQUE,
        value_type ENUM('string','number','boolean','json','color') DEFAULT 'string',
        value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS activity_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        admin_id INT DEFAULT NULL,
        action VARCHAR(190) NOT NULL,
        details JSON DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_admin (admin_id),
        CONSTRAINT fk_logs_admin FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE SET NULL
      );
    `;

    await connection.query(schemaSql);
    console.log('✅ Tables created or updated.');

    // Create default admin if not exists
    const adminEmail = process.env.ADMIN_EMAIL || (await ask('Admin email: '));
    const adminPassword = process.env.ADMIN_PASSWORD || (await ask('Admin password: '));

    if (!adminEmail || !adminPassword) {
      throw new Error('Admin email and password are required');
    }

    const passwordHash = await hashPassword(adminPassword);
    await connection.query(
      `INSERT INTO admin_users (email, password_hash, display_name)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
      [adminEmail, passwordHash, 'Administrator']
    );

    console.log(`✅ Admin user ensured for ${adminEmail}`);
    console.log('🎉 Database initialization complete!');

    connection.end();
  } catch (error) {
    console.error('❌ Initialization failed:', error.message);
  } finally {
    rl.close();
  }
}

init();


