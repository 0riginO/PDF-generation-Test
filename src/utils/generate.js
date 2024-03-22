import puppeteer from "puppeteer";
import hbs from "handlebars";
import moment from "moment";
import path from "path";
import fs from "fs";

const compile = async function (templateName, data) {
  const filePath = path.join(process.cwd(), "templates", `${templateName}.hbs`);
  const html = fs.readFileSync(filePath, { encoding: "utf-8" });
  return hbs.compile(html)(data);
};

hbs.registerHelper("dateFormat", function (value, format) {
  console.log("formatting", value, format);
  return moment(value).format(format);
});

hbs.registerHelper('getTotal', function (totalObj, keyVal) {
  return totalObj[keyVal];
});


const generatePDF = async function (data) {
  return new Promise(async (resolve, reject) => {
    const logs = [];
    console.log("Data: ", data);
    try {
      let i = 0;
      console.time("overall");
      const mem = process.memoryUsage();
      console.log(`Before Generation: ${mem.rss / (1024 * 1024)} MB`);
      for (i; i < data.length; i++) {
        const browser = await puppeteer.launch({
          executablePath: "/usr/bin/chromium-browser",
          args: ["--no-sandbox"],
        });
        console.time("pdf");
        const page = await browser.newPage();

        // Populate template
        const content = await compile("Template 1", data[i]);
        console.log(data[i]);
        await page.setContent(content);
        await page.pdf({
          path: `./temp/mypdf${i}.pdf`,
          format: "A4",
          printBackground: true,
        });

        console.timeEnd("pdf");
        const mem = process.memoryUsage();
        console.log(`Current Mem: ${mem.rss / (1024 * 1024)} MB`);
        await browser.close();
        const log = {
          filePath: `./temp/mypdf${i}.pdf`,
          fileName: `mypdf${i}.pdf`,
          recipient: data[i].Email,
          fullName: `${data[i]["First Name"]} ${data[i]["Middle Name"]} ${data[i]["Last Name"]}`,
          companyName: data[i].company_name,
          employeeID: data[i].employeeID
        };

        logs.push(log);
      }
      console.timeEnd("overall");
      resolve(logs);
    } catch (e) {
      reject(e);
    }
  });
};

export default generatePDF;
