import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

console.log("Server file loaded")

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});

app.post('/api/verify-recaptcha', async (req, res) => {
    const token = req.body.token
    
    if (!token) {
        return res.status(400).json({ error: 'Token is required' })
    }
    const googleRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            secret: process.env.SECRET_KEY || '',
            response: token,
        }).toString(),
    })

    const data = (await googleRes.json()) as any

    return res.json({ success: data.success, ...data })
});