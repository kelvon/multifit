module.exports = function(io){
    io.sockets.on('connection', function(client){
        client.emit('hello', {title: 'você está conectado!'});
    });
}