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
  return moment(value).format(format);
});

hbs.registerHelper("getTotal", function (totalObj, keyVal) {
  const value = totalObj[keyVal];

  if (totalObj && keyVal) {
    return Number(totalObj[keyVal]) || 0;
  }
  return 0;
});

hbs.registerHelper("gt", function (a) {
  return Number(a) != 0;
});

// Helper function to format numbers with commas and periods
hbs.registerHelper("formatNumber", function (number) {
  const parsedNumber = parseFloat(number);

  if (isNaN(parsedNumber)) {
    return number; // Return as is if not a number
  }

  // Split number into integer and decimal parts
  const [integerPart, decimalPart] = parsedNumber
    .toFixed(2)
    .toString()
    .split(".");

  // Add commas to the integer part
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Join the parts with a period and return
  return formattedInteger + "." + decimalPart;
});

// Register a helper to replace newlines with <br>
hbs.registerHelper("newlineToBr", function (text) {
  const escapedText = hbs.Utils.escapeExpression(text);
  return new hbs.SafeString(escapedText.replace(/\n/g, "<br>"));
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
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--disable-extensions",
            "--remote-debugging-port=9222",
            "--disable-background-timer-throttling",
            "--disable-backgrounding-occluded-windows",
            "--disable-renderer-backgrounding",
          ],
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
        const log = {
          filePath: `./temp/mypdf${i}.pdf`,
          fileName: `mypdf${i}.pdf`,
          recipient: data[i].Email,
          fullName: `${data[i]["First Name"]} ${data[i]["Middle Name"]} ${data[i]["Last Name"]}`,
          companyName: data[i].companyInfo.company_name,
          employeeID: data[i]["Employee ID"],
          hireDate: data[i]["Hire Date"],
          dateFrom: moment(data[i]["Dates"]["From"]).format("MMMM DD, YYYY"),
          dateTo: moment(data[i]["Dates"]["To"]).format("MMMM DD, YYYY"),
          datePayout: moment(data[i]["Dates"]["Payment"]).format(
            "MMMM DD, YYYY"
          ),
        };

        logs.push(log);

        // Close page and browser
        await page.close();
        await browser.close();
      }
      console.timeEnd("overall");
      resolve(logs);
    } catch (e) {
      reject(e);
    }
  });
};

export default generatePDF;
