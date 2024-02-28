const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const port =  process.env.PORT || 5000; 


app.use(express.json());
const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200
}
app.use(cors(corsOptions));
app.options('*', cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
  });


//routes 
app.use("/vignere", require("./routes/VignereCipher"));
app.use("/extendedvignere", require("./routes/ExtendedVignereCipher"));
app.use("/playfair", require("./routes/PlayFairCipher"));
app.use("/product", require("./routes/ProductCipher"));


app.listen(port, () => {
  console.log(`Server is starting on port ${port}`);
});