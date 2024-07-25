require('dotenv').config();
require('express-async-errors');
const express=require('express');
const app=express();

const connectDB=require('./db/connect');

const authRouter=require('./routes/auth');
const auth=require('./middleware/authentication');
const blogRouter=require('./routes/blogs');
const sendEmail=require('./controllers/sendmail');

const helmet=require('helmet');
const cors=require('cors');
const xss=require('xss-clean');
const rateLimiter=require('express-rate-limit');

const authenticateUser=require('./middleware/authentication');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const fileUpload=require('express-fileupload')
const cloudinary=require('cloudinary').v2
cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.CLOUD_API_KEY,
  api_secret:process.env.CLOUD_API_SECRET
})

app.set('trust proxy',1);
app.use(rateLimiter({
  windowMs: 15*60*1000,
  max:100
}));
app.use(express.static('./public'))
app.use(express.json());
app.use(fileUpload({useTempFiles:true}));
app.use(helmet())
app.use(cors());
app.use(xss())


// console.log(authenticateUser);

app.use('/api/v1/auth',authRouter);
app.use('/api/v1/blogs',auth,blogRouter);
app.get('/api/v1/sendmail',sendEmail);


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();