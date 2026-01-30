import express from "express";
import { AccessToken } from "livekit-server-sdk";
import 'dotenv/config';

const app = express();

app.get("/token", async (req,res)=>{

 const at = new AccessToken(
  process.env.LIVEKIT_API_KEY,
  process.env.LIVEKIT_API_SECRET,
  { identity:"user"+Date.now() }
 );

 at.addGrant({ roomJoin:true, room:"jarvis" });

 res.send(await at.toJwt());
});

app.listen(process.env.PORT || 3000);

