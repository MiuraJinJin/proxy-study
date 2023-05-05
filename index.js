const express = require("express");
const app = express();
const { createProxyMiddleware } = require("http-proxy-middleware");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const url = require("url");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  mix: 5
})

app.get("/", (req, res) => {
  const params = url.parse(req.url).query;
  console.log(params);
  res.send("This is my proxy server");
});

app.use("/city-weather-data", limiter, (req, res) => {
  const params = url.parse(req.url).query;
  createProxyMiddleware({
    target: process.env.API_URL_CITY_WEATHER + "?" + params,
    changeOrigin: true,
    pathRewrite: {
      [`^/city-weather-data`]: ""
    }
  })(req, res);
});

const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`Listening on localhost port ${port}`);
});

module.exports = app;