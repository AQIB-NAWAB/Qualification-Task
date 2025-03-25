import express, { Request, Response } from 'express';
import CRON_JOBS from './cron';
import { getAccessToken } from './utils/generateToken';
import axios from 'axios';

const app=express();

app.use(express.json());


app.get('/health',(req,res)=>{
    res.send('Server is running');
});

// @ts-ignore
app.post("/assign-badge",async (req: Request, res: Response)=>{
  try{
    const {name,email}=req.body;
    // check if user already present in sheet 

    const URL=process.env.GOOGLE_SCRIPTS_USER_EXIST;

    if(!URL){
      throw new Error('Google script URL not found');
    }

    const response=await axios.get(URL);


    return res.status(200).json({
      message:'Badge assigned successfully',
      response:response.data
    });


    const access_token=await getAccessToken();






  }catch(err){
    console.log(err);
  }
});

const PORT=process.env.PORT || 5000;


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});

CRON_JOBS();
