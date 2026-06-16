import mysql from 'mysql2/promise';
import 'dotenv/config';

// Testa a conexão com o banco
export async function testConnection() {
    try {
        const conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            port: process.env.DB_PORT,
            ssl: {
                rejectUnauthorized: false
            }
        });

        console.log('✅ Conectado com sucesso ao banco');

        await conn.end();
    } catch (err) {
        console.error('❌ Erro ao conectar ao banco:', err);
    }
}

// Singleton
class Database {
    static #instance = null;
    #pool = null;

    #createPool() {
        this.#pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            port: process.env.DB_PORT,

            ssl: {
                rejectUnauthorized: false
            },

            waitForConnections: true,
            connectionLimit: 100,
            queueLimit: 0
        });
    }

    static getInstance() {
        if (!Database.#instance) {
            Database.#instance = new Database();
            Database.#instance.#createPool();
        }

        return Database.#instance;
    }

    getPool() {
        return this.#pool;
    }
}

export const connection = Database.getInstance().getPool();

export async function initializeDatabase() {
    console.log('Inicializando banco de dados...');

    try {
        const tempConnection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            port: process.env.DB_PORT,
            ssl: {
                rejectUnauthorized: false
            }
        });

        await tempConnection.query(`
            CREATE TABLE IF NOT EXISTS categorias(
                id INT PRIMARY KEY AUTO_INCREMENT,
                nome VARCHAR(45) NOT NULL,
                descricao VARCHAR(100) NULL,
                dataCad TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await tempConnection.query(`
            CREATE TABLE IF NOT EXISTS produtos (
                id INT PRIMARY KEY AUTO_INCREMENT,
                nome VARCHAR(45) NOT NULL,
                descricao VARCHAR(45) NULL,
                preco DECIMAL(10,2) NOT NULL,
                image VARCHAR(250) NOT NULL,
                quantidade DECIMAL(18,2) NOT NULL,
                idCategoria INT NOT NULL,
                dataCad TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                CONSTRAINT FK_produtos_categorias
                FOREIGN KEY (idCategoria)
                REFERENCES categorias(id)
            );
        `);

        await tempConnection.query(`
            CREATE TABLE IF NOT EXISTS pedidos(
                id INT PRIMARY KEY AUTO_INCREMENT,
                valorTotal DECIMAL(10,2) NOT NULL,
                Status ENUM('Aberto','Finalizado','Pendente') NOT NULL,
                dataCad TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await tempConnection.query(`
            CREATE TABLE IF NOT EXISTS itens_pedidos(
                id INT PRIMARY KEY AUTO_INCREMENT,
                pedidoId INT NOT NULL,
                produtoId INT NOT NULL,
                quantidade DECIMAL(10,2) NOT NULL,
                valorItem DECIMAL(10,2) NOT NULL,

                CONSTRAINT FK_itens_pedidos_pedidos
                FOREIGN KEY (pedidoId)
                REFERENCES pedidos(id),

                CONSTRAINT FK_itens_pedidos_produtos
                FOREIGN KEY (produtoId)
                REFERENCES produtos(id)
            );
        `);

        await tempConnection.end();

        console.log('✅ Banco e tabelas verificados com sucesso');
    } catch (error) {
        console.error('❌ Erro ao criar tabelas:', error);
        throw error;
    }
}