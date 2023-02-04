import express from 'express';
import dotenv from 'dotenv';
import { google } from 'googleapis';
import dayjs from 'dayjs';
const app=express();

dotenv.config({})
const Port=8000;

const calendar=google.calendar({
    version:"v3",
    auth: process.env.API_KEY,
})
 
const oauth2Client=new google.auth.OAuth2(
    process.env.client_id,
    process.env.client_secret,
    process.env.REDIRECT_URL
    // process.env.OAth2
)

const scopes=[
    'https://www.googleapis.com/auth/calendar'
];

app.get('/',(req,res)=>{
    const url=oauth2Client.generateAuthUrl({
        access_type:'offline',
        scope:scopes
    });
    res.redirect(url)
})

app.get('/google/redirect',async (req,res)=>{
    const code=req.query.code;
    const {tokens}=await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens);
    console.log(tokens);
    res.send('redirect working');
})
app.get("/schecule_event",async (req,res)=>{
 try{ await  calendar.events.insert({
        calendarId:"primary",
        auth:oauth2Client,
        requestBody:{
            summary:"this is a test event",
            description:"Some event that is vety important",
            start:{
                dateTime:dayjs(new Date()).add(1,'day').toISOString(),
                timeZone:"Asia/Kolkata"
            },
            end:{
                dateTime:dayjs(new Date()).add(1,'day').add(1,'hour').toISOString(),
                timeZone:"Asia/Kolkata"
            }
        }
    });
}catch(err){
    console.log(err)
}
    res.send({
        msg:"Done"
    })
})
app.listen(Port,()=>{
    console.log(`app Start listening on Port ${Port}`);
})