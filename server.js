const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

const PORT = process.env.PORT || 8081;

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb+srv://test:test@cluster0.kqhtc.mongodb.net/budget?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }, (err) => console.log(err)
);

// routes
app.use(require("./routes/api.js"));
app.use(require("./routes/html-routes.js"))

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});