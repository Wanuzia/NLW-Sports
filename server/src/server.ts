import express from 'express';
import cors from "cors";

const app = express();
app.use(cors());

app.get("/ads", (req, res) => {

    return res.json([
        { id: 1, nome: 'Anúncio 1'},
        { id: 2, nome: 'Anúncio 2'},
        { id: 3, nome: 'Anúncio 3'}
    ])
})

app.listen(3002, () => {
    console.log('Servidor rodando na porta 3002')
})
