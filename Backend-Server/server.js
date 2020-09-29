const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

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

/* Planning:
/ --> res = this is working
/signin --> POST = sucess/ fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT  --> entry count increases
*/

// app.get('/', (req, res) => {
//     res.send(database.users);
// })

app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const isTrue = bcrypt.compareSync(req.body.password, data[0].hash);
            if (isTrue) {
                return db.select('*').from('users').where('email', '=', req.body.email)
                .then(user => {res.json(user[0])})
                .catch(err => res.status(400).json('Unable to get user'))
            } else {
                res.status(400).json('Wrong credentials');
            }
        })
        .catch(err => res.status(400).json('Wrong credentials'))
})

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const hashedPW = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hashedPW,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({
                name: name,
                email: loginEmail[0],
                joined: new Date() 
            })
            .then(user => {
                res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .catch(err => res.status(404).json('Unable to register'))
})

app.get('/profile/:userId', (req, res) => {
    const { userId } = req.params;
    db.select('*').from('users').where({id: userId})
    .then(user => {
        if (user.length) {
            res.json(user[0]);
        } else {
            res.status(400).json('Not found');
        }
    })
    .catch(err => res.status(400).json('Error getting user'))
})

app.put('/image', (req, res) => {
    const { userId } = req.body;
    db('users').where('id','=', userId).increment('entries', 1)
    .returning('entries')
    .then(entries => {res.json(entries[0])})
    .catch(err => res.status(400).json('Unable to get entry count'))   
})

app.listen(3000, () => {
    console.log('app is running on port 3000');
})

