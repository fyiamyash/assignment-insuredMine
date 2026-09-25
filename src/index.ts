import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(3000, () => {
  console.log("app is listening on port 3000 ");
});
