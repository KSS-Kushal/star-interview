const express = require("express");
const path = require('path');
const { sequelize } = require("./db");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

sequelize
  .sync()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((e) => {
    console.log("Error to connect to DB", e);
  });

// sequelize.authenticate().then(() => {
//     console.log('Connection has been established successfully.');
// }).catch(error => {
//     console.error('Unable to connect to the database:', error);
// })

// app.get("/", async (req, res) => {
//  res.render('home')
// });
app.get("/add-question", async (req, res) => {
 res.render('add-question')
});

app.use("/", require('./routes/questions'));

app.get("/health", (req, res) => {
  res.status(200).json({msg: "OK"});
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
