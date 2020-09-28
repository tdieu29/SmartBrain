const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = {
    users: [
        {
            id: '123',
            name: "John",
            email: "john@gmail.com",
            password: "cookies",
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: "Sally",
            email: "sally@gmail.com",
            password: "bananas",
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'john@gmail.com'
        }
    ]
}
/* Planning:
/ --> res = this is working
/signin --> POST = sucess/ fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT  --> entry count increases
*/
app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    } else {
        res.status(400).json('error logging');
    }
})

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    database.users.push({
        id: '125',
        name: name,
        email: email,
        entries: 0,
        joined: new Date()
    });
    res.json(database.users[database.users.length-1]);
})

app.get('/profile/:userId', (req, res) => {
    const { userId } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === userId) {
            found = true;
            return res.json(user);
        }
    })
    if (!found) {
        res.status(404).json("Not found");
    }
})

app.put('/image', (req, res) => {
    const { userId } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === userId) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    })
    if (!found) {
        res.status(404).json("Not found");
    }
})

app.listen(3000, () => {
    console.log('app is running on port 3000');
})

