const express = require('express')
const app = express()
const port = 3000
var http = require('http').createServer(app)
var io = require('socket.io')(http)
const path = require('path')
require('./public/scripts/utils');

app.use('/static', express.static(path.join(__dirname, 'public')))
app.use('/static', express.static(path.join(__dirname, 'node_modules')))

app.use('/build', express.static(path.join(__dirname, 'dist')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
})

var mockProducts = [{
    id: 1,
    name: 'Notebook Pc'
}, {
    id: 2,
    name: 'Desktop Pc'
}, {
    id: 3,
    name: 'Telephone'
}, {
    id: 4,
    name: 'Smart Watch'
}];

app.get('/api/products', function (req, res) {
    res.send(mockProducts)
})

app.post('/api/products', function (req, res) {
    let data = '';
    req.on('data', function (chunk) {
        data += chunk;
    });
    req.on('end', function () {
        const json = JSON.parse(data);
        var id = mockProducts.getMaxId() + 1;
        var newProduct = {
            id: id,
            name: json.name
        };
        mockProducts.push(newProduct);
        io.emit('added product', newProduct);
        res.end();
    });
})

app.delete('/api/products', function (req, res) {

    let data = '';
    req.on('data', function (chunk) {
        data += chunk;
    });
    req.on('end', function () {
        var json = JSON.parse(data);
        mockProducts = mockProducts.filter((p) => {
            return p.id != json.id;
        });
        io.emit('deleted product', json);
        res.end();
    });
})

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

http.listen(port, () => console.log(`app listening on port ${port}!`))