var latitude = 0;
var longitude = 0;
var kartta;

var olet_tassa;
var paikka_merkitty = 0;

async function getData() {
  const response = await fetch('/api/paikat');
  const data = await response.json();
  console.log("Function getdatan tiedot: ", data)

 merkitsePaikat(data);
 tayta_paikkataulukko(data);
}

function tayta_paikkataulukko(data) {
  var table = document.getElementById("paikkataulukko");

  for (var i = 0; i < data.length; i++) {
    var row = table.insertRow(i + 1)
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);

    cell1.innerHTML = data[i].paikka;
    cell2.innerHTML = data[i].arvostelu;
  }
  console.log("Taulukon tiedot: ", table)
}

function merkitsePaikat(data) {
  var kayty_paikka;
  for (var i = 0; i < data.length; i++) {
    kayty_paikka = L.marker([data[i].latitude, data[i].longitude]).addTo(kartta);
    kayty_paikka.bindPopup("<b>" + data[i].paikka + "</b><br>" + data[i].arvostelu).openPopup();
  }

  if (paikka_merkitty == 0) {
    olet_tassa = L.marker([latitude, longitude]).addTo(kartta);
    olet_tassa.bindPopup("<b> Olet tässä </b><br>" + "haluatko merkitä paikan").openPopup();
  }
}

function tyhjenna_paikkataulukko() {
  var table = document.getElementById("paikkataulukko");
  var rivien_maara = table.rows.length -1;

  for (var i = 0; i < rivien_maara; i++) {
    table.deleteRow(1);
  }
}

if ("geolocation" in navigator) {
  console.log("Sijaintitieto saatavilla");
  navigator.geolocation.getCurrentPosition(function(position) {
    console.log(position);

    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    console.log("latitude: " + latitude);
    console.log("longitude: " + longitude);

    document.getElementById("leveysasteet").innerHTML = latitude;
    document.getElementById("pituusasteet").innerHTML = longitude;

    kartta = L.map('kartta').setView([latitude, longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    }).addTo(kartta);

    var marker = L.marker([latitude, longitude]).addTo(kartta);
    getData();
  });

} else {
  console.log("Sijantitieto ei saatavilla");
}

function avaa_paikkatietolomake() {
  document.getElementById("paikkatietolomake").style.display = "block";
  document.getElementById("lomake").reset();
}

function sulje_paikkatietolomake() {
  document.getElementById("paikkatietolomake").style.display = "none";
}

function laheta_arvostelu() {
  var paikka = document.getElementById("paikka").value;
  var arvostelu = document.getElementById("arvostelu").value;

  console.log("Paikka: " + paikka);
  console.log("Arvostelu: " + arvostelu);

  const data = {paikka, arvostelu, longitude, latitude};
  const options = {
    method: "POST",
    headers: {
      "Content-type":"application/json"
    },
    body: JSON.stringify(data)
  };

  console.log("Laheta arvostelu options: ", options);

  fetch('/api/arvostelu', options).then(function(response) {
    console.log("Laheta arvostelu response: ", response)
    if (response.status == 200) {
      tyhjenna_paikkataulukko();
      getData();
      sulje_paikkatietolomake();
    }
  }, function(error) {
    console.log(error);
  });
}
