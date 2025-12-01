import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// endpoint placeholder
app.get('/api/buildings', (req, res) => {
  res.json([
    { id: 'b1', name: 'Edificio A', svgRegionId: 'region-a' },
    { id: 'b2', name: 'Biblioteca', svgRegionId: 'region-b' }
  ])
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log('API running on port', PORT)
})
