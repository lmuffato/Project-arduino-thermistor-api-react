const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

// LENDO OS VALORES DO ARDUINO
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const port = new SerialPort('/dev/ttyACM0', { baudRate: 9600 });
// const parser = port.pipe(new Readline({ delimiter: "-" })); // Delimitador entre linhas
const parser = port.pipe(new Readline());

let valueSerial = "";

// Read the port data
port.on("open", () => { console.log('Porta serial aberta') });
parser.on('data', data => { valueSerial = data });

app.get('/arduino', function (req, res, next) {
  res.json({ dados: valueSerial });
  console.log(valueSerial);
})

app.listen(3001, () => {
  console.log('Aplicação ouvindo na porta 3001');
});

// Endereço da API com os valores
// http://localhost:3001/arduino