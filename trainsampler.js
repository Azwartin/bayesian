var fs = require('fs'),
	TrainSampler = function(){};

TrainSampler.prototype.getMaleSamples = function(){
	return this.readSamplesFile('samples/maleSamples.txt');
}

TrainSampler.prototype.getFemaleSamples = function() {
	return this.readSamplesFile('samples/femaleSamples.txt');
}

TrainSampler.prototype.readSamplesFile = function(path) {
	return fs.readFileSync(path, 'utf8').split("\r\n");
}

TrainSampler.prototype.getSamples = function(featuresFunc) {
	var samples = [],
		names = [];

	names = this.getMaleSamples();
	names.forEach(function(name) {
		if(name.length > 3) {
			samples.push({classID: 'm', features:featuresFunc(name)});
		}
	});

	names = this.getFemaleSamples();
	names.forEach(function(name) {
		if(name.length > 3) {
			samples.push({classID: 'f', features:featuresFunc(name)});
		}
	});
	
	return samples;
}

module.exports = TrainSampler;

