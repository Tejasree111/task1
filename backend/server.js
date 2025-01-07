/*const express = require('express');
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



function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from the "Authorization" header
    if (!token) return res.status(401).send({ success: false, message: 'Access denied' });

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) return res.status(403).send({ success: false, message: 'Invalid token' });
        req.user = user; 
        console.log(req.user);// Attach user details to the request
        next();
    });
}



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
                const token = jwt.sign({ id: user.Id }, 'your_jwt_secret', { expiresIn: '1h' });
                console.log(user);
                console.log({ success: true, message: 'Login successful', token ,userData: { fname: user.fname, lname: user.lname, email: user.email } });
                //firstName: user.fname, lastName: user.lname,
                res.send({ success: true, message: 'Login successful', token ,userData: { fname: user.fname, lname: user.lname, email: user.email } });
            } else {
                res.send({ success: false, message: 'Invalid email or password' });
            }
        } else {
            res.send({ success: false, message: 'Invalid email or password' });
        }
    });
});

server.get('/api/user', authenticateToken, (req, res) => {
    const sql = 'SELECT id, fname, lname, email FROM users WHERE id = ?';
    console.log(req.user.id);
    db.query(sql, [req.user.id], (err, results) => {
        if (err || results.length === 0) {
            return res.status(500).send({ success: false, message: 'Failed to fetch user data' });
        }
        res.send({ success: true, userData: results[0] });
    });
});

server.get('/api/users', authenticateToken, (req, res) => {
    const sql = 'SELECT id, fname, lname, email FROM users';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send({ success: false, message: 'Failed to fetch users' });
        }
        res.send({ success: true, users: results });
    });
});

server.patch('/api/user/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { fname, lname } = req.body;
  
    const sql = 'UPDATE users SET fname = ?, lname = ? WHERE id = ?';
    db.query(sql, [fname, lname, id], (err, result) => {
      if (err) {
        return res.status(500).send({ success: false, message: 'Failed to update user' });
      }
      res.send({ success: true, message: 'User updated successfully' });
    });
  });

  server.delete('/api/user/:id', authenticateToken, (req, res) => {
    const userId = req.params.id;
  
    const sql = 'DELETE FROM users WHERE id = ?';
    db.query(sql, [userId], (err, result) => {
      if (err) {
        console.error('Error deleting user:', err);
        return res.status(500).send({ success: false, message: 'Failed to delete user' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).send({ success: false, message: 'User not found' });
      }
  
      res.send({ success: true, message: 'User deleted successfully' });
    });
  });
  
  
server.listen(3000, () => {
    console.log('Server started on port 3000');
});*/

const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Model } = require('objection');
const knex = require('./util/database');
const User = require('./models/User');

const fs = require('fs');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); 


server.use(cors());
server.use(bodyParser.json({limit :'10mb'}));

// Initialize Objection.js
Model.knex(knex);

function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from the "Authorization" header
    if (!token) return res.status(401).send({ success: false, message: 'Access denied' });

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) return res.status(403).send({ success: false, message: 'Invalid token' });
        req.user = user; 
        console.log(req.user); // Attach user details to the request
        next();
    });
}

/*
function authorizeRoles(...roles) {
    return (req, res, next) => {
        const userRole = req.user.type; // Extracted from the JWT
        if (!roles.includes(userRole)) {
            return res.status(403).send({ success: false, message: 'Access forbidden: insufficient permissions' });
        }
        next();
    };
}*/


server.post('/api/register', async (req, res) => {
    const { fname, lname, email, password, type , image} = req.body;
    if (!image) {
      return res.status(400).send({ success: false, message: 'No image uploaded' });
    }
     // Validate `type` field
     if (!['User', 'Admin'].includes(type)) {
        return res.status(400).send({ success: false, message: 'Invalid user type' });
    }

   const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log(hashedPassword);
    try {
        const user = await User.query().insert({
            fname,
            lname,
            email,
            password: hashedPassword,
            type,
            image: image, 
            
        });
        res.send({ success: true, message: 'Registration successful' });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).send({ success: false, message: 'Registration failed' });
    }
});
/*
server.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.query().findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                { id: user.Id}, 
                'your_jwt_secret', { expiresIn: '1h' });
            res.send({ success: true, message: 'Login successful', token, userData: { fname: user.fname, lname: user.lname, email: user.email,} });
        } else {
            res.send({ success: false, message: 'Invalid email or password' });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).send({ success: false, message: 'Login failed' });
    }
}); */

server.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.query().findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                { id: user.Id, type: user.type },
                'your_jwt_secret',
                { expiresIn: '1h' }
            );
            res.send({
                success: true,
                message: 'Login successful',
                token,
                userData: {
                    fname: user.fname,
                    lname: user.lname,
                    email: user.email,
                    type: user.type,
                },
            });
        } else {
            res.send({ success: false, message: 'Invalid email or password' });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).send({ success: false, message: 'Login failed' });
    }
});


server.get('/api/user', authenticateToken, async (req, res) => {
    try {
        console.log('Fetching user data for user ID:', req.user.id);
        const user = await User.query().findById(req.user.id).select('Id', 'fname', 'lname', 'email' ,'type', 'image');

       /* if (user) {
            res.send({ success: true, userData: { ...user } });
          } */
    
        if (user) {
            res.send({ success: true, userData: user });
        }
        else {
            res.status(404).send({ success: false, message: 'User not found' });
        }
    } catch (err) {
        console.error('Error fetching user data:', err);
        res.status(500).send({ success: false, message: 'Failed to fetch user data' });
    }
});

server.get('/api/users', authenticateToken, async (req, res) => {
    try {
        const users = await User.query().select('Id', 'fname', 'lname', 'email');
        console.log('Fetched users:', users);
        res.send({ success: true, users });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).send({ success: false, message: 'Failed to fetch users' });
    }
});

server.patch('/api/user/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { fname, lname } = req.body;
    try {
        const updatedUser = await User.query().patchAndFetchById(id, { fname, lname });
        console.log(updatedUser);
        res.send({ success: true, userData: updatedUser });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).send({ success: false, message: 'Failed to update user' });
    }
});

server.delete('/api/user/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        await User.query().deleteById(id);
        res.send({ success: true, message: 'User deleted' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send({ success: false, message: 'Failed to delete user' });
    }
});

server.listen(3000, () => {
    console.log('Server started on port 3000');
});