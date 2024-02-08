const data = require("./data.json");
const fs = require("fs");
const puppeteer = require("puppeteer");
const hbs = require("handlebars");
const moment = require("moment");
const path = require("path");

if (!fs.existsSync("./payslips")) {
  fs.mkdirSync("./payslips");
}

const compile = async function (templateName, data) {
  const filePath = path.join(process.cwd(), "templates", `${templateName}.hbs`);
  const html = fs.readFileSync(filePath, { encoding: "utf-8" });
  return hbs.compile(html)(data);
};

hbs.registerHelper("dateFormat", function (value, format) {
  console.log("formatting", value, format);
  return moment(value).format(format);
});
(async function () {
  try {
    let i = 0;
    console.time("overall");
    const mem = process.memoryUsage();
    console.log(`Before Generation: ${mem.rss / (1024 * 1024)} MB`);
    for (i; i <= 50; i++) {
      const browser = await puppeteer.launch();
      console.time("pdf");
      const page = await browser.newPage();

      const content = await compile("template", data);

      await page.setContent(content);
      await page.pdf({
        path: `./payslips/mypdf${i}.pdf`,
        format: "A4",
        printBackground: true,
      });

      console.timeEnd("pdf");
      const mem = process.memoryUsage();
      console.log(`Current Mem: ${mem.rss / (1024 * 1024)} MB`);
      await browser.close();
    }
    console.timeEnd("overall");
    process.exit();
  } catch (e) {
    console.log(e);
  }
})();
