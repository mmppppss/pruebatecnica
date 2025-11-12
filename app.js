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




app.get("/solicitud", async (req, res) => {
	try {

		const sql = `
            SELECT 
                s.id AS solicitud_id,
                s.trabajador_id,
                t.nombre,
                t.cedula_identidad,
                s.fecha_inicio,
                s.fecha_fin,
                s.cantidad_dias,
                s.estado
            FROM solicitud_vacaciones s
            LEFT JOIN trabajador t ON s.trabajador_id = t.codigo
            ORDER BY s.id DESC
        `;

		const solicitudes = await db.query(sql);
		res.json(solicitudes);

	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Error al obtener solicitudes" });
	}
});

app.get("/solicitud/:id", async (req, res) => {
	try {

		const { id } = req.params;
		const sql = `
            SELECT 
                s.id AS solicitud_id,
                s.trabajador_id,
                t.nombre,
                t.cedula_identidad,
                s.fecha_inicio,
                s.fecha_fin,
                s.cantidad_dias,
                s.estado
            FROM solicitud_vacaciones s
            LEFT JOIN trabajador t ON s.trabajador_id = t.codigo
			WHERE s.id=?
            ORDER BY s.id DESC 
        `;

		const solicitudes = await db.query(sql, [id]);
		res.json(solicitudes);

	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Error al obtener solicitudes" });
	}
});




app.post("/solicitud", async (req, res) => {
	try {
		const { trabajador_id, fecha_inicio, fecha_fin, cantidad_dias, cantidad_horas } = req.body;

		if (!trabajador_id || !fecha_inicio || !fecha_fin) {
			return res.status(400).json({ error: "Faltan datos obligatorios" });
		}

		let dias = cantidad_dias;

		if (!dias) {
			const inicio = new Date(fecha_inicio);
			const fin = new Date(fecha_fin);

			if (fin < inicio) {
				return res.status(400).json({ error: "fecha_fin no puede ser anterior a fecha_inicio" });
			}

			dias = (fin - inicio) / (1000 * 60 * 60 * 24) + 1;
		}

		if (cantidad_horas && !cantidad_dias) {
			dias = cantidad_horas / 8;
		}

		const sql = `
            INSERT INTO solicitud_vacaciones 
            (trabajador_id, fecha_inicio, fecha_fin, cantidad_dias, estado)
            VALUES (?, ?, ?, ?, 'pendiente')
        `;

		const result = await db.query(sql, [trabajador_id, fecha_inicio, fecha_fin, dias]);

		res.status(201).json({
			message: "Solicitud de vacaciones creada",
			solicitud_id: result.insertId,
			cantidad_dias: dias
		});

	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Error al crear la solicitud" });
	}
});



app.put("/solicitud/:id/:estado", async (req, res) => {
	try {
		const { id, estado } = req.params;

		const estadosValidos = ["aprobada", "rechazada"];
		if (!estadosValidos.includes(estado)) {
			return res.status(400).json({ error: "Estado inválido" });
		}

		const solicitud = await db.query(
			"SELECT * FROM solicitud_vacaciones WHERE id = ?",
			[id]
		);

		if (solicitud.length === 0) {
			return res.status(404).json({ error: "Solicitud no encontrada" });
		}

		await db.query(
			"UPDATE solicitud_vacaciones SET estado = ? WHERE id = ?",
			[estado, id]
		);

		res.json({ message: `Solicitud ${id} actualizada a "${estado}" correctamente` });

	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Error al actualizar la solicitud" });
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
