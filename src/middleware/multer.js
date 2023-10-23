import multer from "multer";
import __dirname from '../utils.js'
// import logger from "../loggers.js";

// CONFIGURACIÓN MULTER
const storage= multer.diskStorage({ // acá le digo que se grabe en disco de almacenamiento
    
    destination: function(req, file,cb){
                // cb(null, __dirname + "/public/documents")  //acá le digo que se guarde en carpeta public
                if(file.fieldname === "identificacion" || file.fieldname === "domicilio" || file.fieldname === "cuenta"){
                    cb(null, __dirname + "/public/documents"); //acá le digo que se guarde en carpeta public
                };
                if(file.fieldname == "imageprofile"){
                    cb(null, __dirname + "/public/profiles");
                };
                if(file.fieldname == "thummbnails"){
                    cb(null, __dirname + "/public/products");
                };
    },
    filename: function(req, file,cb){
        // logger.info(file)
        const identificacion = file.originalname;
      
        cb(null, file.fieldname+ '-' + file.originalname) //y acá que se guarde con el nombre original con el que viene
    }
})


export const uploader= multer({storage})
