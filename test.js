const Database = require("./Database");

async function main() {
    const db = new Database({
        host: "localhost",
        user: "root",
        password: "root",
        database: "gestion_vacaciones"
    });

    await db.connect();

    const trabajadores = await db.query("SELECT * FROM trabajador");
    console.log( trabajadores);

    await db.close();
}

main().catch(console.error);
