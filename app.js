const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const schedule = require("node-schedule");
const accountSid = "AC6dbcde5dd7ff01837038af8eef7abf1a";
const authToken = "2e0963a7e354373ccedd1293f3b3c6f0";
const client = require("twilio")(accountSid, authToken);

const app = express();
const PORT = 3002;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//API VARIABLES
const API_KEY = "319370dd37d91cbdcbc002eb56be3dbf";
const url = "https://api.exchangeratesapi.io/v1/";
let base = "CAD";
const defaultCurrencies = ["PHP", "USD", "JPY", "GBP", "AUD"];
let userDefinedCurrencies = [];
//API VARIABLES

//HOME
app.get("/", async (req, res) => {
  let toDisplay = [];
  let convertedAmount;
  let check = checkUserDefinedCurrency(userDefinedCurrencies);
  if (check == true) {
    await axios
      .get(
        `${url}latest?access_key=${API_KEY}&base=${base}&symbols=${userDefinedCurrencies}`
      )
      .then((res) => {
        const data = res.data;
        const rates = data.rates;
        Object.entries(rates).forEach(([currency, rate]) => {
          //console.log(`${currency}: ${rate}`);
          const parsedRate = parseFloat(rate).toFixed(2);
          let currObj = { currSymbol: currency, currentRate: parsedRate };
          toDisplay.push(currObj);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    await axios
      .get(
        `${url}latest?access_key=${API_KEY}&base=${base}&symbols=${defaultCurrencies}`
      )
      .then((res) => {
        const data = res.data;
        const rates = data.rates;
        Object.entries(rates).forEach(([currency, rate]) => {
          //console.log(`${currency}: ${rate}`);
          const parsedRate = parseFloat(rate).toFixed(2);
          let currObj = { currSymbol: currency, currentRate: parsedRate };
          toDisplay.push(currObj);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  res.render("index", { title: "Homepage", toDisplay, convertedAmount, base });
});

//CONVERTER
app.post("/", async (req, res) => {
  const fromCurr = req.body.fromCurrency;
  const toCurr = req.body.toCurrency;
  const amount = req.body.amountInput;
  let convertedAmount;
  await fetch(
    `${url}convert?access_key=${API_KEY}&from=${fromCurr}&to=${toCurr}&amount=${amount}`
  )
    .then((res) => res.json())
    .then((data) => {
      convertedAmount = JSON.parse(data.result);
      convertedAmount = parseFloat(convertedAmount).toFixed(2);
      console.log(convertedAmount);
    });
  let toDisplay = [];
  let check = checkUserDefinedCurrency(userDefinedCurrencies);
  if (check == true) {
    await axios
      .get(
        `${url}latest?access_key=${API_KEY}&base=${base}&symbols=${userDefinedCurrencies}`
      )
      .then((res) => {
        const data = res.data;
        const rates = data.rates;
        Object.entries(rates).forEach(([currency, rate]) => {
          //console.log(`${currency}: ${rate}`);
          const parsedRate = parseFloat(rate).toFixed(2);
          let currObj = { currSymbol: currency, currentRate: parsedRate };
          toDisplay.push(currObj);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    await axios
      .get(
        `${url}latest?access_key=${API_KEY}&base=${base}&symbols=${defaultCurrencies}`
      )
      .then((res) => {
        const data = res.data;
        const rates = data.rates;
        Object.entries(rates).forEach(([currency, rate]) => {
          //console.log(`${currency}: ${rate}`);
          const parsedRate = parseFloat(rate).toFixed(2);
          let currObj = { currSymbol: currency, currentRate: parsedRate };
          toDisplay.push(currObj);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  res.render("index", { title: "Homepage", toDisplay, convertedAmount, base });
});
//CHANGE BASE
app.post("/changeBase", (req, res) => {
  const newBase = req.body.changeCurrency;
  if (newBase.length != 0) {
    changeCurrencyBase(newBase);
    res.redirect("/");
  }
});

app.get("/API", (req, res) => {
  res.render("API", { title: "API" });
});

app.post("/API", async (req, res) => {
  const curr = req.body.selectCurrency;
  const dateInput = req.body.dateInput;
  let forResp;
  const dateInString = dateInput.toString();
  //console.log(typeof[dateInString]);
  //console.log(dateInString);
  await axios
    .get(
      `${url}${dateInString}?access_key=${API_KEY}&base=${base}&symbols=${curr}`
    )
    .then((res) => {
      const data = res.data;
      forResp = data;
      console.log(typeof [forResp]);
    })
    .catch((err) => {
      console.log(err);
    });
  res.json(forResp);
});

app.get("/register", (req, res) => {
  res.render("register", { title: "Register" });
});

app.get("/sendmoney", (req, res) => {
  res.render("sendmoney", { title: "Send Money" });
});

//TRACK
app.get("/track", async (req, res) => {
  let toDisplay = [];
  let check = checkUserDefinedCurrency(userDefinedCurrencies);
  if (check == true) {
    await axios
      .get(
        `${url}latest?access_key=${API_KEY}&base=${base}&symbols=${userDefinedCurrencies}`
      )
      .then((res) => {
        //console.log(res);
        const data = res.data;
        const rates = data.rates;
        Object.entries(rates).forEach(([currency, rate]) => {
          //console.log(`${currency}: ${rate}`);
          const parsedRate = parseFloat(rate).toFixed(2);
          let currObj = { currSymbol: currency, currentRate: parsedRate };
          toDisplay.push(currObj);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    await axios
      .get(
        `${url}latest?access_key=${API_KEY}&base=${base}&symbols=${defaultCurrencies}`
      )
      .then((res) => {
        //console.log(res);
        const data = res.data;
        const rates = data.rates;
        Object.entries(rates).forEach(([currency, rate]) => {
          //console.log(`${currency}: ${rate}`);
          const parsedRate = parseFloat(rate).toFixed(2);
          let currObj = { currSymbol: currency, currentRate: parsedRate };
          toDisplay.push(currObj);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  res.render("track", { title: "Track", toDisplay });
});
//ADD CURRENCY
app.post("/add", (req, res) => {
  const toBeAdded = req.body.toAdd;
  if (toBeAdded.length != 0) {
    addCurrency(toBeAdded);
  }
  console.log(toBeAdded);
  res.status(200).redirect("/track");
});
//DELETE CURRENCY
app.post("/remove", (req, res) => {
  const toBeDeleted = req.body.toAdd;
  if (toBeDeleted.length != 0) {
    deleteCurrency(toBeDeleted);
  }
  console.log(toBeDeleted);
  res.redirect("/track");
});

app.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

app.get("/account", (req, res) => {
  res.render("account", { title: "Account" });
});

app.get("/notification", (req, res) => {
  res.render("notification", { title: "Notify" });
});

app.post("/notification", (req, res) => {
  const chosenCurrency = req.body.selectCurrency;
  const desiredAmount = req.body.amountInput;
  const email = req.body.emailInput;
  const phone = req.body.phoneInput;
  const notifyBy = req.body.notifType;
  scheduler(chosenCurrency, desiredAmount, email, phone, notifyBy);
  res.render("notification", { title: "Notify" });
});

app.use((req, res) => {
  res.status(404).render("404");
});

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}/`);
});

//APP FUNCTIONS
function checkUserDefinedCurrency(userDefinedCurrencies) {
  return userDefinedCurrencies.length != 0;
}

//CHANGE CURRENCY BASE FUNCTION
function changeCurrencyBase(symbol) {
  base = symbol;
}

//ADD CURRENCY FUNCTION
function addCurrency(currencySymbol) {
  userDefinedCurrencies.push(currencySymbol);
}

//DELETE CURRENCY FUNCTIONS
function deleteCurrency(currencySymbol) {
  let found = userDefinedCurrencies.indexOf(currencySymbol);
  if (found > -1) {
    userDefinedCurrencies.splice(found, 1);
  } else {
    console.log("Currency Not Found");
  }
}

//MESSAGE SENDER FUNTIONS
function sendMessage1(currency, desiredRate, rate, phone) {
  const phoneNo = "+1" + phone;
  client.messages
    .create({
      body:
        "Your tracked currency of " +
        currency +
        " is now equals or above your desired rate of " +
        desiredRate +
        ". The current rate is " +
        rate,
      from: "+19042893746",
      to: phoneNo,
    })
    .then((message) => console.log(message.sid));
}

function sendMessage2(currency, desiredRate, rate, phone) {
  const phoneNo = "+1" + phone;
  client.messages
    .create({
      body:
        "Your tracked currency of " +
        currency +
        " is now below your desired rate of " +
        desiredRate +
        ". The current rate is: " +
        rate,
      from: "+19042893746",
      to: phoneNo,
    })
    .then((message) => console.log(message.sid));
}
function scheduler(currency, desiredRate, email, phone, notify) {
  notify = checkNotificationType(notify);
  let count = 1;
  schedule.scheduleJob("*/5 * * * * *", () => {
    axios
      .get(
        `${url}latest?access_key=${API_KEY}&base=${base}&symbols=${currency}`
      )
      .then((res) => {
        const data = res.data;
        const rates = data.rates;
        const rateForCurrency = parseFloat(rates[currency]).toFixed(2);
        console.log(rateForCurrency);
        if (notify == "sms") {
          if (rateForCurrency >= desiredRate) {
            sendMessage1(currency, desiredRate, rateForCurrency, phone);
          } else if (rateForCurrency < desiredRate) {
            sendMessage2(currency, desiredRate, rateForCurrency, phone);
          } else {
            console.log("no message");
          }
        }
      });
    console.log("test no: " + count);
    count++;
  });
}

function checkNotificationType(notifType) {
  if (notifType === "sms") {
    return "sms";
  } else if (notifType === "email") {
    return "email";
  } else {
    console.log("unknown type");
    return "unknown";
  }
}

function add2Numbers(num1, num2) {
  return num1 + num2;
}

module.exports = checkUserDefinedCurrency;
module.exports = checkNotificationType;
module.exports = add2Numbers;
