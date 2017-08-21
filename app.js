var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var chtprs = JSON.parse(fs.readFileSync('chat/chat.json','utf8'));
var chat = chtprs[0]
var users = chtprs[1]
var type = chtprs[2]

app.get('/', function(req, res){
  res.sendfile('files/index.html');
});

app.get('/css/w3.css', function(req, res){
  res.sendfile('files/css/w3.css');
});

app.get('/js/jquery.js', function(req, res){
  res.sendfile('files/js/jquery.js');
});

app.get('/script.js', function(req, res){
  res.sendfile('files/script.js');
});

app.get('/main.css', function(req, res){
  res.sendfile('files/main.css');
});
app.get('/chat', function(req, res){
  res.sendfile('files/chat.html');
});
app.get('/swears.json', function(req, res){
  res.sendfile('files/swears.json');
});

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
  res.sendfile('files/404.html', 404);
});


//Whenever someone connects this gets executed
io.on('connection', function(socket){
console.log('A user connected');

socket.on("ban", function(data){

  io.sockets.emit("banned", data);
});

socket.on("gc", function(data){
var chtprs = JSON.parse(fs.readFileSync('chat/chat.json','utf8'));
var chat = chtprs[0]
var users = chtprs[1]
var type = chtprs[2]
socket.emit('rc',[chat,users]);
console.log("brodcasting to ", data);
});

socket.on("chated", function(data){
io.sockets.emit("connectionToChat", data);
users.push(data[1]);
chat.push(data[0]);

var stuff = [chat,users]
stuff = JSON.stringify(stuff)
fs.writeFile("chat/chat.json", stuff);
});



socket.on("connected!", function(data){
users.push("Server");
chat.push("New User "+data+" Connected!");

var stuff = [chat,users]
stuff = JSON.stringify(stuff)
fs.writeFile("chat/chat.json", stuff);

io.sockets.emit("connectionToChat", ["New User "+data+" Connected!","Server"]);

});
socket.on("disconnected!", function(data){

io.sockets.emit("connectionToChat", ["New User "+data+" Disconnected!","Server"]);
users.push("Server");
chat.push("User "+data+" Disconnected!");

var stuff = [chat,users]
stuff = JSON.stringify(stuff)
fs.writeFile("chat/chat.json", stuff);
});
//Whenever someone disconnects this piece of code executed
socket.on('disconnect', function () {
console.log('A user disconnected');



});

});

http.listen(8080, function(socket){

console.log('listening on *:8080');

});
