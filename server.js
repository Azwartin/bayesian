var http = require('http'),
	io = require('socket.io'),
	TrainSampler = require('./trainsampler'),
	Bayesian = require('./baes'),
	bayesian = new Bayesian(),
	trainSampler = new TrainSampler();

console.log(JSON.stringify(bayesian));
console.log(bayesian);
if(!bayesian.load()) {
	bayesian.train(trainSampler.getSamples(bayesian.getFeatures));
	console.log(JSON.stringify(bayesian));
	console.log(bayesian);
	bayesian.save();
}

var server = http.createServer(function(req, res) {}).listen(8080);
io = io.listen(server);

io.sockets.on('connection', function (socket) {
  socket.on('postName', function (data) {
    console.log(data.name);
    socket.emit('postClass', {name:data.name, class:bayesian.classify(bayesian.getFeatures(data.name))});
  });

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});

console.log('Running');