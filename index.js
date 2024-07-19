var express = require("express");
var mysql = require("mysql2");
require('dotenv').config();
const { generateToken, validateToken } = require('./auth');



var app = express();

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DATABASE,
})

app.use(express.json());
const cors = require('cors')
app.use(cors())
app.use((req, res, next) => {

    // Dominio que tengan acceso (ej. 'http://example.com')
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Metodos de solicitud que deseas permitir
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');

    // Encabecedados que permites (ej. 'X-Requested-With,content-type')
    res.setHeader('Access-Control-Allow-Headers', '*');

    next();
})

//endpoint 01
app.get("/", (req, res, next) => {
    res.send("Hola mundo!");
    //res.json(["Tony","Lisa","Michael","Ginger","Food"]);
})

app.get("/listarProd", validateToken, (req, res, next) => {
    //res.send(process.env.MYSQL_HOST);
    try {
        db.query('SELECT * FROM producto', (error, respuesta) => {
            if (error) console.log(error);
            res.json(respuesta);
        });
    } catch (error) {
        console.log('El error es: ' + error)
    }

});

//endpoint 02

app.post("/insertProd", (req, res, next) => {

    try {
        let nombreProd = req.body.nombre;
        //Aquí va el cód de insert
        db.query(`INSERT INTO producto (Id_prod, Nom_prod) VALUES (NULL, '${nombreProd}')`);
        res.status(200).json({ "Mensaje": "Registro guardado" })

    } catch (error) {
        console.log('El error es: ' + error)
    }
    //res.json(["Tony","Lisa","Michael","Ginger","Food"]);
})

//Endpoint 03
//Update
app.patch("/editProd", (req, res) => {
    try {

        //console.log(req.body.nombre + "-"+req.body.id)
        let nombreProd = req.body.nombre;
        let idProd = req.body.id;

        db.query(`SELECT * FROM producto WHERE Id_prod = '${idProd}'`, (error, existe) => {
            if (error) console.log(error);

            if (existe == "") {
                res.status(400).json({ "Error": "Registro no existe" });
            } else {
                db.query(`UPDATE producto SET Nom_prod = '${nombreProd}' WHERE Id_prod = '${idProd}'`);
                res.status(200).json({ "Mensaje": "Registro actualizado" });
            }

        });

    } catch (error) {
        res.status(400).json({ "El error en la actualización es: ": error })
    }/**/
})
//Delete
app.delete("/deleteProd", (req, res) => {
    try {

        //console.log(req.body.nombre + "-"+req.body.id)
        let idProd = req.body.id;

        db.query(`SELECT * FROM producto WHERE Id_prod = '${idProd}'`, (error, existe) => {
            if (error) console.log(error);

            if (existe == "") {
                res.status(400).json({ "Error": "Registro no existe" });
            } else {
                db.query(`DELETE FROM producto WHERE Id_prod = '${idProd}'`);
                res.status(200).json({ "Mensaje": "Registro eliminado" });
            }

        });

    } catch (error) {
        res.status(400).json({ "El error en la actualización es: ": error })
    }
})

// Endpoint tipo post
app.post("/login", (req, res) => {

    const user = req.body.user;
    const pass = req.body.pass;

    const rut = "11111111-1";

    const token = generateToken({rutUser:rut})
    res.status(200).json({ "mi token": token });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});