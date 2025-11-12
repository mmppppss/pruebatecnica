const mysql = require("mysql2/promise"); 

class Database {
    constructor(config) {
        this.config = config;
        this.connection = null;

		this.connect();
    }

    async connect() {
        try {
            this.connection = await mysql.createConnection(this.config);
			console.log('conectado')
        } catch (error) {
			console.error('no conectado ', error)
            throw error;
        }
    }

    async query(sql, params = []) {
        if (!this.connection) {
            throw new Error("No hay conexion");
        }
        try {
            const [rows] = await this.connection.execute(sql, params);
            return rows;
        } catch (error) {
            console.error("Error en query", error.message);
            throw error;
        }
    }

    async close() {
        if (this.connection) {
            await this.connection.end();
            console.log("Conexión cerrada");
        }
    }
}

module.exports = Database;
