import { UserService, CartService } from "../services/index.js";
import UserDTO from "../dto/user.js";
import moment from "moment/moment.js";
import nodemailer from "nodemailer";
import config from "../config/config.js";

export const updateRolUser = async (req, res) => {
  try {
    const uid = req.params.uid;
    // const pid = req.params.pid;
    const data = req.body.role;

    var user = await UserService.getById(uid);

    if (req.user.user._id !== uid) {
      res
        .status(400)
        .json({ status: "error", error: "No coinciden los usuarios" });
    } else {
      if (data === "premium" && user.documents.length < 3) {
        res.status(401).json({
          status: "error",
          error: "Debe terminar de compleatar la carga de documentacion",
        });
      } else {
        if (user.length !== 0) {
          await UserService.updateUser(req.user.user._id, { role: data });
          user = await UserService.getById(uid);

          res.status(200).json({ status: "success", payload: user });
        }
      }
    }
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};

export const sendDocument = async (req, res) => {
  try {
    const senDocument = req.files; //objeto, y cada archivo que tiene es un array
    const uid = req.params.uid;

    var user = await UserService.getById(uid);
    //
    const documents = user.documents;

    if (senDocument !== undefined) {
      if (
        senDocument.identificacion &&
        !documents.some((item) => item["name"].includes("identificacion"))
      ) {
        documents.push({
          name: senDocument.identificacion[0].filename,
          reference: senDocument.identificacion[0].path,
        });
      } else if (senDocument.identificacion) {
        documents.map(function (dato) {
          if (dato.name.includes("identificacion")) {
            dato.name = senDocument.identificacion[0].filename;
            dato.reference = senDocument.identificacion[0].path;
          }
        });
      }

      if (
        senDocument.domicilio &&
        !documents.some((item) => item["name"].includes("domicilio"))
      ) {
        documents.push({
          name: senDocument.domicilio[0].filename,
          reference: senDocument.domicilio[0].path,
        });
      } else if (senDocument.domicilio) {
        documents.map(function (dato) {
          if (dato.name.includes("domicilio")) {
            dato.name = senDocument.domicilio[0].filename;
            dato.reference = senDocument.domicilio[0].path;
          }
        });
      }

      if (
        senDocument.cuenta &&
        !documents.some((item) => item["name"].includes("cuenta"))
      ) {
        documents.push({
          name: senDocument.cuenta[0].filename,
          reference: senDocument.cuenta[0].path,
        });
      } else if (senDocument.cuenta) {
        documents.map(function (dato) {
          if (dato.name.includes("cuenta")) {
            dato.name = senDocument.cuenta[0].filename;
            dato.reference = senDocument.cuenta[0].path;
          }
        });
      }
    } else {
      return res
        .status(401)
        .json({ status: "error", error: "No ingreso ningun documento" });
    }
    await UserService.updateUser(uid, { documents: documents });

    user = await UserService.getById(uid);

    res.status(200).json({ status: "success", payload: user });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};
export const getAllUsersController = async (req, res) => {
  const users = await UserService.getAll();
  // console.log(users)
  // let results = new UserDTO(users)

  // const array = []

  const usersDTO = users.map((user) => {
    return new UserDTO(user);
  });

  res.status(200).json({ status: "success", payload: usersDTO });
};

export const deleteUsersController = async (req, res) => {
  try {
    const users = await UserService.getAll();

    var fecha2 = moment(new Date());
    const array = users.filter(
      (user) => fecha2.diff(moment(user.last_connection), "days") > 2
    );

    if (array.length > 0) {
      const promises = array.map(async (data) => {
        const nombre = data.first_name;
        const email = data.email;
        const conexion = moment(data.last_connection).format('DD-MM-YYYY');
        // Envio Mail avisando al usuario que se elimno su cuenta
        const mailerConfig = {
          // uri:wtimeoutMS,
          service: "gmail",
          auth: {
            user: config.NODEMAILER_USER,
            pass: config.NODEMAILER_PASS,
          },
        };
        let transporter = nodemailer.createTransport(mailerConfig);
        let message = {
          from: config.NODEMAILER_USER,
          to: email,
          subject: "Usuario Eliminado",
          html: `<h1>Hola ${nombre}</h1> <hr/> Su cuenta ha sido dada de baja debido a que 
           presenta inactividad desde el día ${conexion} `,
        };


        await transporter.sendMail(message);
        // Elimino usuario y carrito del usuario
        await UserService.delete(data._id.toString());
        await CartService.delete(data.cart.toString());

      });

      Promise.all(promises)
        .then(() => {
          res.status(200).json({ status: "Cuenta/s Eliminada/s" });
        })
        .catch((error) => {
          res.status(500).json({ status: "error", payload: error });
        });
    }
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
};
