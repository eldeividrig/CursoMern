const express = require("express");
const router = express.Router();
const multer = require("multer");


const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './image/articulos/');
    },

    filename: (req, file, cb) => {
        cb(null, "articulo" + Date.now() + file.originalname);
    }
})

const ArticuloControlador = require("../controladores/articulo");

//Rutas de pruebas
router.get("/ruta-de-prueba", ArticuloControlador.prueba);
router.post("/crear", ArticuloControlador.crear);
router.get("/articulos/:ultimos?", ArticuloControlador.listar);
router.get("/articulo/:id", ArticuloControlador.uno);
router.delete("/articulo/:id", ArticuloControlador.borrar);
router.put("/articulo/:id", ArticuloControlador.editar);
router.post("/subir-imagen/:id", ArticuloControlador.subir);


module.exports = router;