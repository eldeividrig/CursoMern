const { conexion } = require("./basedatos/conexion");
const express = require("express");
const cors = require("cors");

//Inicializar APP
console.log("App de node arrancada");

//Conectar a la base de datos
conexion();

//Crear servidor Node
const app = express();
const puerto = 3900;

//Configurar cors
app.use(cors());

//Convertir body a objeto js
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Rutas

const rutas_articulo = require("./rutas/articulo");

app.use("/api", rutas_articulo);


app.get("/probando", (req, res) => {
    console.log("probando");
    return res.status()
})


//Crear servidor y escuchar peticiones http
app.listen(puerto, () => {
    console.log("Servidor corriendo en el puerto " + puerto);
});
