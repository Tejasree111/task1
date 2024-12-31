const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

server.use(cors());
server.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'user'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySql connected');
});

server.post('/api/register', async (req, res) => {
    const { fname, lname, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    const sql = 'INSERT INTO users (fname, lname, email, password) VALUES (?, ?, ?, ?)';
    db.query(sql, [fname, lname, email, hashedPassword], (err, result) => {
        if (err) {
            return res.status(500).send({ success: false, message: 'Registration failed' });
        }
        res.send({ success: true, message: 'Registration successful' });
    });
});

server.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
        if (err) {
            return res.status(500).send({ success: false, message: 'Login failed' });
        }
        if (results.length > 0) {
            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);
            console.log(isMatch);
            if (isMatch) {
                const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
                res.send({ success: true, message: 'Login successful', token });
            } else {
                res.send({ success: false, message: 'Invalid email or password' });
            }
        } else {
            res.send({ success: false, message: 'Invalid email or password' });
        }
    });
});

server.listen(3000, () => {
    console.log('Server started on port 3000');
});