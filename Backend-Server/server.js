const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const signin = require('./controllers/signin');
const register = require('./controllers/register');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'Happy2229',
      database : 'smartbrain'
    }
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post('/signin', signin.handleSignin(db, bcrypt))

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

app.get('/profile/:userId', (req, res) => { profile.handleProfile(req, res, db) })

app.put('/image', (req, res) => { image.handleImage(req, res, db) })

app.post('/imageUrl', (req, res) => { image.handleApiCall(req, res) })

app.listen(3000, () => {
    console.log('app is running on port 3000');
})

/* Planning:
/ --> res = this is working
/signin --> POST = sucess/ fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT  --> entry count increases
*/