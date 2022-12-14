import express from 'express';
import cors from "cors";
import { PrismaClient } from  '@prisma/client';
import { convertHourstringToMinutes } from './utils/convert-hour-string-to-minutes';
import { convertMinutestoHourString } from './utils/convert-minutes-to-hour-string';

const app = express();
app.use(cors());
app.use(express.json())
const prisma = new PrismaClient(
    {
        log: ['query']
    }
) // faz a conexão com o banco de dados

app.get("/games",  async (req, res) => {
    const games = await prisma.game.findMany({
        include: {
            _count: {
                select: {
                    ads: true,
                }
            }
        }
    })
    return res.json(games);
});
app.post("/games/:id/ads", async (req, res) => {
    const gameId = req.params.id;
    const body = req.body;
    try{const ad = await prisma.ad.create({
        data:{
            id: 'uuid()',
            gameId,
            name: body.name,
            yearsPlaying: body.yearsPlaying,
            discord: body.discord,
            weekDays: body.weekDays.join(','),
            hourStart: convertHourstringToMinutes(body.hourStart),
            hourEnd: convertHourstringToMinutes(body.hourEnd),
            useVoiceChannel: body.useVoiceChannel,
        }
        
    })
    console.log(ad)
    return res.status(201).json(ad);
}catch(error){
    console.log(error)
    return res.send(error)
}
});
app.get("/games/:id/ads", async (req, res) => {
   const gameId = req.params.id
   const ads = await prisma.ad.findMany({
       select: {
            id: true,
            name: true,
            weekDays: true,
            useVoiceChannel: true,
            yearsPlaying: true,
            hourStart: true,
            hourEnd: true,
       },
       where: {
           gameId,
       },
       orderBy: {
           createdAt: 'desc',
       }
   })
    return res.json(ads.map(ad => {
        return {
            ...ad, 
            weekDays: ad.weekDays.split(','),
            hourStart: convertMinutestoHourString(ad.hourStart),
            hourEnd: convertMinutestoHourString(ad.hourEnd)

        }
    }))
});
app.get("/ads/:id/discord", async (req, res) => {
    const adId = req.params.id;
    const ad = await prisma.ad.findUniqueOrThrow({
        select: {
            discord: true,
        },
        where: {
            id: adId,
        }
    })
        return res.json({
            discord: ad.discord,
        })
});

app.listen(3002, () => {
    console.log('Servidor rodando na porta 3002')
})
/* 
Adicionar validação
zod js
UntilTheEnd
*/