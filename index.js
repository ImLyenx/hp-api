const express = require("express");
const ip = require("ip");
const app = express();
const port = 3000;
require("./config/prisma");
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use(express.static("public", { extensions: ["html"] }));

app.use("/api/", require("./router"));

app.listen(port, () => {
  console.log(`Server is running on ${ip.address()}:${port}`);
});
