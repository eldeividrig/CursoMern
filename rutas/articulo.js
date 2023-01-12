const express = require("express");
const router = express.Router();
const multer = require("multer");
const ArticuloControlador = require("../controladores/articulo");


const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './imagenes/articulos/');
    },

    filename: (req, file, cb) => {
        cb(null, "articulo" + Date.now() + file.originalname);
    }
})

const subidas = multer({storage: almacenamiento});



//Rutas de pruebas
router.get("/ruta-de-prueba", ArticuloControlador.prueba);
router.post("/crear", ArticuloControlador.crear);
router.get("/articulos/:ultimos?", ArticuloControlador.listar);
router.get("/articulo/:id", ArticuloControlador.uno);
router.delete("/articulo/:id", ArticuloControlador.borrar);
router.put("/articulo/:id", ArticuloControlador.editar);
router.post("/subir-imagen/:id", [subidas.single("file0")], ArticuloControlador.subir);
router.post("/imagen/:fichero", ArticuloControlador.imagen);


module.exports = router;