var port = 8080,
	app = require('express')(),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	TrainSampler = require('./trainsampler'),
	Bayesian = require('./baes'),
	Checker = require('./checker'),
	trainSampler = new TrainSampler(),
	bayesian = new Bayesian()
	checker = new Checker();

if(!bayesian.load()) {
	bayesian.train(trainSampler.getSamples(bayesian.getFeatures));
	bayesian.save();
}

console.log(checker.check(bayesian));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/html/index.html');
});

io.on('connection', function (socket) {
  socket.on('postName', function (data) {
    console.log(data.name);
    socket.emit('postClass', {name:data.name, class:bayesian.classify(data.name)});
  });

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});

http.listen(port, function(){
	console.log('Listen: ' + port);
});
