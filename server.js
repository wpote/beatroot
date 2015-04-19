var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var size = 16;
var drumState = new Array(size*size);
for (var i = 0; i < size*size; i++)
  drumState[i] = false; 

app.use(express.static('dist'));
app.set('port', (process.env.PORT || 3000));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/dist/index.html');
});

io.on('connection', function(socket){
  console.log('connected');
  socket.on('getDrumState', function(){
    console.log('in getDrumState');
    socket.emit('setDrumState', drumState);
  });
  socket.on('toggle', function(pos){
    if (pos >= 0 && pos < size*size) {
      drumState[pos] = !drumState[pos];
      console.log('broadcasting new drum state');
      var s = 'Active drums: ';
      drumState.forEach(function(cur, i){
        if (cur) s += ' ' + i;
      });
      console.log(s);
      io.sockets.emit('setDrumState', drumState);
    }
  });
  socket.on('chat', function(msg){
    console.log(msg);
    io.sockets.emit('chat', msg);
  });
});

http.listen(app.get('port'), function(){
  console.log('App running on *:' + app.get('port'));
});
