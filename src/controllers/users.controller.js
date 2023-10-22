import { UserService } from "../services/index.js";

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
