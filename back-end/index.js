
var cors = require('cors')
const express = require('express')
const app = express()
const port = 3000
const getHtmlText = require('./scripts/getHtmlText');
app.use(cors())

app.get('/:url', async (req, res) => {
    res.send(await getHtmlText(req.params.url))
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})