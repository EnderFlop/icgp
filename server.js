const express = require("express")
const cors = require("cors")
require("dotenv").config()

const app = express()
app.use(cors())
const port = 3000

console.log(process.env)

app.get("/folders", function(req, res) {
  fetch('https://api.github.com/repos/EnderFlop/iowacitygraffiti/contents/photos', {headers: {Authorization: process.env.GITHUB_PAT}})
    .then(response => response.json())
    .then(data => res.send(data))
})

app.get("/photos/:folder", function(req, res) {
  const { folder } = req.params
  fetch(`https://api.github.com/repos/EnderFlop/iowacitygraffiti/contents/photos/${folder}`, {headers: {Authorization: process.env.GITHUB_PAT}})
    .then(response => response.json())
    .then(data => res.send(data))
})

app.listen(port, function(error) {
  if (error) {
    console.log(error)
  } else {
    console.log("server listening on port " + port)
  }
})