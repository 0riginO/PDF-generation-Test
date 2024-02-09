import { Recipe } from "muhammara";
import fs from "fs";

const encryptPDF = async (logs) => {
  return new Promise((resolve, reject) => {
    try {
      const year = new Date().getFullYear();
      const month = new Date().getMonth();
      const day = new Date().getDate();
      logs.forEach((log) => {
        const pdfDoc = new Recipe(
          log.filePath,
          `./payslips/${log.recipient}_${year}-${month}-${day}.pdf`
        );
        pdfDoc
          .encrypt({
            userPassword: "123",
            ownerPassword: "123",
            userProtectionFlag: 4,
          })
          .endPDF();
        log.filePath = `./payslips/${log.recipient}_${year}-${month}-${day}.pdf`;
      });
      fs.rmSync("./temp/", { recursive: true });
      fs.mkdirSync("./temp");
      resolve(logs);
    } catch (e) {
      reject(e);
    }
  });
};

export default encryptPDF;
