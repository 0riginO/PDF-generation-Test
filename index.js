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
const PORT = process.env.PORT;

console.log("Checking ENV...");
console.log(process.env.SMTP_PASS, process.env.PORT);

app.use(
  cors({
    origin: [process.env.ORIGIN_URL, "http://localhost:3000"],
    methods: ["GET", "PATCH", "POST", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json());
app.use(send);

app.listen(PORT, () => {
  console.log("Server running on PORT: ", process.env.PORT);
});
