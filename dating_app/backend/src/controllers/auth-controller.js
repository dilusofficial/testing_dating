const express = require('express');
require('dotenv').config();


const twilio = require('twilio');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const login=async(req,res)=>{

    const { username, password } = req.body;

    console.log(req.body)
    
    if (username === 'learnbuds' && password === 'learnbuds') {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }


}

const phoneAuthentication=async(req,res)=>{

    const accountSid =process.env.accountSid ; 

    const authToken = process.env.authToken; 
    const client = new twilio(accountSid, authToken);

    const { to } = req.body;

    console.log(to)
    

    if (!to ) {
        return res.status(400).send({ error: 'Missing "to" or "message" field' });
    }

    client.messages.create({
        body: '70250',
        messagingServiceSid: 'MG0537d89b5fb08e721331b461196bdc4b',
        to: to
    })
    .then((message) => res.status(200).send({ success: true, messageSid: message.sid }))
    .catch((error) => res.status(500).send({ success: false, error: error.message }));


}


const otpVerification=async(req,res)=>{

const{code}=req.body

if(code === '70250'){
    res.json({ success: true });

}

else{

    res.status(401).json({ success: false, message: 'Invalid otp number' });

}


}







module.exports= {login,
    phoneAuthentication,
    otpVerification
};

