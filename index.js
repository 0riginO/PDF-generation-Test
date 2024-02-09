import fs from "fs";
import express from "express";
import send from "./src/routes/send_route.js";
import cors from "cors";

if (!fs.existsSync("./payslips")) {
  fs.mkdirSync("./payslips");
}

if (!fs.existsSync("./temp")) {
  fs.mkdirSync("./temp");
}

const app = express();

app.use(cors());
app.use(express.json());
app.use(send);

app.listen(3000, () => {
  console.log("Server running on PORT 3000");
});
