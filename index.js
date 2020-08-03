const express = require('express');
const shortid = require('shortid');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send('Server is working!')
})

const port = 8000;
server.listen(port, () => console.log(`server running on port ${port}`));