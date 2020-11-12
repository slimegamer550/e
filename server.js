const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const db = require('./queries')

app.listen(3000, () => console.log("kuuntelen"));

app.use(express.static("public"));
//app.use(express.json({limit: '1mb'}));

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

const paikat = [
  {
    "paikka": "Helsinki",
    "arvostelu": "Kivaa oli",
    "longitude": "24.887296",
    "latitude": "60.234137600000004"
  },
  {
    "paikka": "Levi",
    "arvostelu": "Ei niin kivaa ollut",
    "longitude": "24.8081",
    "latitude": "67.8040"
  }
]

//app.get('/api/paikat', function(request, response) {
  //response.send(paikat);
//})

//app.post('/api/arvostelu', function(request, response) {
  //console.log("käyttäjän arvostelu");
  //console.log(request.body);
  //paikat.push(request.body);
  //response.send(200);
//})

app.get('/api/paikat', db.haePaikat)
app.get('/api/arvostelu', db.lisaaPaikka)
