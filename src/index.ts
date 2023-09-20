import express from 'express'
import * as dotenv from 'dotenv'
dotenv.config()

const app = express()
const port = process.env.NODE_PORT
app.get('/', (_, res) => {
    res.send('Express + TypeScript Server')
})

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`)
})
