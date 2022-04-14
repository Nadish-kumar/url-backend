import express from "express";
import mongoose from "mongoose";
import cards from './dbperson.js';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import url from './urldb.js';
import jwt from 'jsonwebtoken';
import shortUrl from 'node-url-shortener';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';



dotenv.config();

// let option = {
//     origin: "https://verdant-dolphin-7e7550.netlify.app"
// }

//appconfig
const secret = "4641316895";
const app = express();
const port = process.env.PORT || 8001
const connection__url = "mongodb+srv://yatvik:yatvik07@cluster0.ybnwc.mongodb.net/url?retryWrites=true&w=majority"
//middlewares
app.use(express.json());
app.use(cors());
let authenticate = (req, res, next) => {
    if (req.headers.authentication) {
        try {
            let result = jwt.verify(req.headers.authentication, secret);
            next();
        } catch (error) {
            res.status(401).json({ mesaagae: "token expired" })
        }
    } else {
        res.status(401).json({ message: 'not authorized' })
    }
}
//db config
mongoose.connect(connection__url,)
//api endpoint
app.get('/', (req, res) => {
    res.status(200).send('hello nadish programer')
})

app.post('/register', (req, res) => {
    //hash the password
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);
    req.body.password = hash
    const dbcard = req.body
    console.log(dbcard)
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "",
            pass: "8825637070"
        }
    });

    let mailoption = {

        from: "nadishkrish65@gmail.com",
        to: req.body.email,
        subject: "Fox shortener url authentication verify mail",
        text: `Hello ${req.body.name}your app is very powerful keep it good and safe`
    }

    transporter.sendMail(mailoption, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            console.log('email send !!!!!')
        }
    })
    cards.create(dbcard, (err, data) => {
       
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})




app.get('/register', (req, res) => {
    const dbcard = req.body

    cards.create(dbcard, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
})

app.put('/register', async (req, res) => {
    try {
        let user = await cards.findOne({ email: req.body.email });
        if (user) {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(req.body.password, salt);
            req.body.password = hash
            const dbcard = req.body
            cards.updateOne(dbcard, (err, data) => {
                if (err) {
                    res.status(500).send(err)
                } else {
                    res.status(200).send(data)
                }
            })
        } else {
            res.status(401).json({ message: 'user not found' });
        }
    } catch (error) {
        console.log(error)
    }
})

app.get('/main', authenticate, (req, res) => {
    res.json({ mesaagae: 20 })
})

app.post('/login', async (req, res) => {
    //find the email matches
    try {
        let user = await cards.findOne({ email: req.body.email });
        if (user) {
            let passwordresult = await bcrypt.compare(req.body.password, user.password)
            console.log(passwordresult)
            if (passwordresult) {
                let token = jwt.sign({ userid: user._id }, secret, { expiresIn: '1h' });
                res.json({ token })
            } else {
                res.status(401).json({ message: 'wrong password' })
            }
        } else {
            res.status(401).json({ message: 'user not found' });
        }
    } catch (error) {
        console.log(error)
    }
})

app.post('/url', async (req, res) => {
    console.log(req.body.url)
    shortUrl.short(req.body.url, function (err, ball) {
        req.body.url = ball;
        console.log(ball)
        const dbcard = req.body
        url.create(dbcard, (err, data) => {
            if (err) {
                res.status(500).send(err)
            } else {
                console.log(data)
                res.status(201).send(data)
            }
        })
    });
})

app.get('/url/:id', (req, res) => {
    const dbcard = req.params.id
    console.log(dbcard)
    url.find({username : dbcard}, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
             res.status(200).send(data)
        }
    })
})





//listener
app.listen(port, () => console.log(`listening on localhost: ${port}`));