const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const { requiresAuth } = require('express-openid-connect');
const { auth } = require('express-openid-connect');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'http://localhost:5000',
  clientID: 'lOR5gIEMu4aK2CGLqATMdr5i6tmDUmTQ',
  issuerBaseURL: 'https://dev-b3y8m--i.us.auth0.com'
};

//bring in mongoose
const mongoose = require('mongoose');

//bring in method override
const methodOverride = require('method-override');

const blogRouter = require('./routes/blogs');
const Blog = require('./models/Blog');
const app = express();

//connect to mongoose
mongoose.connect(process.env.URI, {useNewUrlParser: true, useUnifiedTopology: true,
  useCreateIndex: true,})
.then(()=>{
  app.listen(process.env.PORT, ()=>{
      console.log('connected to db and server is running on port', process.env.PORT);
  });
})
.catch((error)=>{
  console.log(error);
})
app.use(auth(config));

//set template engine
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
//route for the index
app.get('/', requiresAuth(), async (request, response) => {
  let blogs = await Blog.find().sort({ timeCreated: 'desc' });

  response.render('index', { blogs: blogs });
});

app.use(express.static('public'));
app.use('/blogs', blogRouter);
