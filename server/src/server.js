const http = require('http');
const app = require('./app');
require('dotenv').config();
require('./db');

const server = new http.Server(app);

const PORT = process.env.PORT;

server.listen(PORT);

server.on('error', err => console.error(err));
server.on('listening', () => console.log('Server was started! Port:' + PORT));
