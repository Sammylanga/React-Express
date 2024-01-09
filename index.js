const app = require(`express`)();
const PORT = 8080;
const express = require('express');
const User =require('./Db/db');
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");
const { createTokens, validateToken } = require("./jwt");

app.use(express.json());

app.use(cookieParser());
app.use(express.urlencoded({extended:false}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Adjust this based on your security requirements
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

app.listen(
    PORT,
    () => console.log(`its alive on http://localhost:${PORT}`)
)

app.post("/login", async function(req, res){
    try {
        // check if the user exists
        const user = await User.findOne({ username: req.body.username });
        if (user) {
          //check if password matches
          const passwordMatch = await bcrypt.compare(req.body.password, user.password);

          if (passwordMatch) {

            const accessToken = createTokens(user);

            res.cookie("token", accessToken, {
                // maxAge: 60 * 60 * 24 * 30 * 1000,
                httpOnly: true,
              });

            res.status(200).json({
                accessToken: accessToken,
                login: true,
                userexits: true,
                username: user.username 
            });
            
          } else {
            res.status(200).json({
                login: false,
                userexits: true , 
                error: "password doesn't match" });
          }
        } else {
          res.status(200).json({
            login: false,
            userexits: false ,
            error: "User doesn't exist" });
        }
      } catch (error) {
        res.status(400).json({ error: "Login Failed" });
      }
});

app.post('/signup', async(req ,res) => { 

  //work factor defines the number of iterations the underlying hash function performs when hashing a password
  const workFactor = 10;
  const hashedPassword = await bcrypt.hash(req.body.password, workFactor);

  const data = {
    username: req.body.username,
    password: hashedPassword, 
    email: req.body.email
  }

  try{ 
    // check if the user exists
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      res.status(200).json({
        signup: false,
        userexits: true
      })
    } else{
        // create a new user if the new user does not exist
        const newUser = await User.create(data);
        res.status(200).json({signup: true});
    }
  } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message});
  }
});

app.post("/profile", validateToken, (req, res) => {
      res.status(200).json({
        authenticated: true
    });
  });