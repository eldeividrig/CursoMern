const { validarArticulo } = require("../helpers/validar");
const fs = require("fs");
const path = require("path");
const Articulo = require("../modelos/Articulo");

const prueba = (req, res) => {
  return res.status(200).json({
    mensaje: "Soy una accion de prueba en mi controlador de articulos",
  });
};

const crear = (req, res) => {
  //Recoger datos por post a guardar
  let parametros = req.body;

  //Validar Datos
  try {
    validarArticulo(parametros);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "Faltan datos por enviar",
    });
  }

  //Crear el objeto a guardar
  const articulo = new Articulo(parametros);

  //Asignar valores a objeto basado en el modelo (manual o automatico)
  // articulo.titulo = parametros.titulo;
  // articulo.contenido = parametros.contenido;

  //guardar el articulo en la base de datos
  articulo.save((error, articuloGuardado) => {
    if (error || !articuloGuardado) {
      return res.status(400).json({
        status: "error",
        mensaje: "No se ha guardado el articulo",
      });
    }
    //Devolver resultado
    return res.status(200).json({
      status: "success",
      articulo: articuloGuardado,
      mensaje: "Articulo creado con éxito!!",
    });
  });
};

const listar = (req, res) => {
  let consulta = Articulo.find({});
  if (req.params.ultimos) {
    consulta.limit(req.params.ultimos);
  }

  consulta.sort({ fecha: -1 }).exec((error, articulos) => {
    if (error || !articulos) {
      return res.status(404).json({
        status: "error",
        mensaje: "No se han encontrado articulos!",
      });
    }

    return res.status(200).send({
      status: "success",
      contador: articulos.length,
      articulos,
    });
  });
};

const uno = (req, res) => {
  //Recoger un id por la url
  let id = req.params.id;
  //Buscar el articulo
  Articulo.findById(id, (error, articulo) => {
    //Si no existe devolver error
    if (error || !articulo) {
      return res.status(404).json({
        status: "error",
        mensaje: "No se ha encontrado el articulo",
      });
    }
    //Devolver resultado
    return res.status(200).send({
      status: "success",
      articulo,
    });
  });
};

const borrar = (req, res) => {
  let articuloId = req.params.id;

  Articulo.findByIdAndDelete({ _id: articuloId }, (error, articuloBorrado) => {
    if (error || !articuloBorrado) {
      return res.status(500).json({
        status: "error",
        mensaje: "Error al borrar el articulo",
      });
    }
    return res.status(200).send({
      status: "success",
      articulo: articuloBorrado,
      mensaje: "Metodo de borrar",
    });
  });
};

const editar = (req, res) => {
  //Recoger articulo a editar
  let articuloId = req.params.id;

  //Recoger datos del body
  let parametros = req.body;

  //Validar datos
  try {
    validarArticulo(parametros);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "Faltan datos por enviar",
    });
  }

  //Buscar y actualizar articulo
  Articulo.findOneAndUpdate(
    { _id: articuloId },
    parametros,
    { new: true },
    (error, articuloActualizado) => {
      if (error || !articuloActualizado) {
        return res.status(500).json({
          status: "error",
          mensaje: "Error al actualizar el articulo",
        });
      }
      //Devolver respuesta
      return res.status(200).send({
        status: "success",
        articulo: articuloActualizado,
        mensaje: "Articulo actualizado",
      });
    }
  );
};

const subir = (req, res) => {
  //Configurar multer

  //Recoger el fichero de imagern subido
  if (!req.file && !req.files) {
    return res.status(400).json({
      status: "error",
      mensaje: "Peticion Invalida",
    });
  }

  //Nombre del archivo
  let archivo = req.file.originalname;

  //Extension del archivo
  let archivo_split = archivo.split("\.");
  let extension = archivo_split[1];

  //Comprobar extension correcta
  if (extension != "png" && extension != "jpg" &&
    extension != "jpeg" && extension != "gif") {
    fs.unlink(req.file.path, (error) => {
      return res.status(400).json({
        status: "error",
        mensaje: "Imagen invalida",
      });
    })
  } else {
    //Si todo va bien, actualizar el articulo
    let articuloId = req.params.id;
    Articulo.findOneAndUpdate(
      { _id: articuloId },
      {imagen: req.file.filename},
      { new: true },
      (error, articuloActualizado) => {
        if (error || !articuloActualizado) {
          return res.status(500).json({
            status: "error",
            mensaje: "Error al actualizar el articulo",
          });
        }        
      }
    );
    //Devolver respuesta
    return res.status(200).json({
      status: "success",
      files: req.file,
      fichero: req.file
    });
  }
};

const imagen = (req, res) => {
  let fichero = req.params.fichero;
  let rut_fisica = "./imagenes/articulos" + fichero;
}


module.exports = {
  prueba,
  crear,
  listar,
  uno,
  borrar,
  editar,
  subir,
  imagen,
};
