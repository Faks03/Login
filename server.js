const connectDB = require('./config/db')
const express = require('express');
const bodyParser = require('express').json;
const userRoute = require('./routes/User');
const productRoute = require('./routes/Product')
const viewRoute = require('./routes/View')
const ejs = require('ejs')



const { urlencoded } = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(bodyParser());
app.use(urlencoded({extended:true}))
app.use(express.static("public"))
app.use('/user',userRoute)
app.use('/product',productRoute)
app.use('/view', viewRoute)
app.use('/uploads', express.static('uploads'));

const start = async () => {
    try {
      await connectDB(process.env.MONGO_URI);
    //   console.log("Connected to DB")
      app.listen(port, () => {
        console.log(`Server listening on port ${port}!`);
      });
    } catch (error) {
      
      console.log("Internet Not Connected");
    }
  };

start();