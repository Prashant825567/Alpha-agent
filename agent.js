import 'dotenv/config';
import fetch from 'node-fetch';
import { defineAgent } from "@livekit/agents";
import { deepgramSTT } from "@livekit/agents-plugin-deepgram";
import { elevenlabsTTS } from "@livekit/agents-plugin-elevenlabs";

async function askGemini(text){
 const r = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
  {
   method:"POST",
   headers:{ "Content-Type":"application/json"},
   body: JSON.stringify({
    contents:[{parts:[{text}]}]
   })
  }
 );
 const j = await r.json();
 return j.candidates?.[0]?.content?.parts?.[0]?.text || "No reply";
}

export default defineAgent({

 stt: deepgramSTT({
  apiKey: process.env.DEEPGRAM_API_KEY
 }),

 tts: elevenlabsTTS({
  apiKey: process.env.ELEVENLABS_API_KEY,
  voiceId: process.env.ELEVENLABS_VOICE_ID
 }),

 async onTranscription(ctx, text){
  console.log("User:", text);
  const reply = await askGemini(text);
  await ctx.say(reply);
 }
});

