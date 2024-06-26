import generatePDF from "../utils/generate.js";
import encrypt from "../utils/encrypt.js";
import send from "../utils/send.js";

const sendAndGeneratePDF = (req, res) => {
  const data = req.body;
  generatePDF(data)
    .then((logs) => {
      return encrypt(logs);
    })
    .then((logs) => {
      return send(logs);
    })
    .then((isSuccess) => {
      console.log("Result: ", isSuccess);
      isSuccess ? res.sendStatus(200) : res.sendStatus(500);
    });
};

export default sendAndGeneratePDF;
