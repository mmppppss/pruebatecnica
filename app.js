const express = require('express')
const fs = require('fs') //debug

const Database = require("./Database");

const app = express();

app.use(express.json());
const db = new Database({
	host: "localhost",
	user: "root",
	password: "root",
	database: "gestion_vacaciones"
});



app.get("/trabajador", async (req, res) => {
	const rows = await db.query("SELECT * FROM trabajador");
	res.json(rows);
});

app.get("/trabajador/:id", async (req, res) => {
	const { id } = req.params;
	const trabajador = await db.query("SELECT * FROM trabajador WHERE codigo = ?", [id]);

	if (trabajador.length === 0) {
		return res.status(404).json({ error: "Trabajador no encontrado" });
	}

	res.json(trabajador[0]);

});

app.post("/trabajador", async (req, res) => {
	try {
		const { cedula_identidad, nombre, fecha_ingreso, area, cargo } = req.body;

		// Validaciones básicas
		if (!cedula_identidad || !nombre) {
			return res.status(400).json({ error: "Faltan datos obligatorios" });
		}
		let fecha = fecha_ingreso ? new Date().toISOString().slice(0, 10) : fecha_ingreso;
		const sql = `
            INSERT INTO trabajador (cedula_identidad, nombre, fecha_ingreso, area, cargo)
            VALUES (?, ?, ?, ?, ?)
        `;

		const result = await db.query(sql, [cedula_identidad, nombre, fecha, area, cargo]);

		res.status(201).json({
			message: "Trabajador creado correctamente",
			trabajador_id: result.insertId
		});

	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Error al crear el trabajador" });
	}
});

const server = app.listen(3000, async () => {
	console.log("Servidor escuchando en http://localhost:3000");
});

//para debug
let file = require.resolve(__filename);
fs.watchFile(file, () => {
	fs.unwatchFile(file);
	console.log(`Update ${__filename}`);
	server.close();
	delete require.cache[file];
	require(file);
});
