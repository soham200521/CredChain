require('dotenv').config()
const express=require('express');
const cooki_parser=require('cookie-parser');
const User=require('./models/user');

const app=express();
app.use(express.urlencoded({extended:true}))
app.use(cooki_parser());
app.use(express.json());

app.get('/isregistered', async (req, res) => {
    try {
        const { email } = req.query;
        

        const user = await Doc.findOne({ email })||await Pat.findOne({email});
        if (!user) {
            return res.status(401).json({ registered: false });
        }

        const token = jwt_token(user);
        return res.status(200).cookie('token', token).json({ registered: true });
    } 
    catch (err) {
        console.error('Server error in /isregistered:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(5001,()=>{
    console.log('connected to 5001')
});