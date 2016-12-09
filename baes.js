var fs = require('fs'),
	Bayesian = function() {
		this.classes = {};
		this.frequencies = {};
		this.samplesCount = 0;
}

/*
тренировочный набор есть массив вида [ 
	{classID: 'idOfClass', features: {fl:'a', sl:'n', ll:'n'}},
	...
	]
 ]
*/
Bayesian.prototype.classify = function(name) {
	var complianceDegrees = this._calculateComplianceDegrees(this.getFeatures(name));
	return this._classOfMinDegree(complianceDegrees);
}

Bayesian.prototype._calculateComplianceDegrees = function(feats) {
	var classID, featID,
		defaultFreq = Math.pow(10, -7), 
		result = {}, currentFreq = 0,
		currentLetter;

	for(classID in this.classes) {
		result[classID] = - Math.log(this.classes[classID]);
		for(featID in this.frequencies[classID]) {
			currentLetter = feats[featID];
			if (!currentLetter) {
				throw new Error('feats incorrect');
			}

			if(this.frequencies[classID][featID][currentLetter]) {
				currentFreq = this.frequencies[classID][featID][currentLetter];
			} else {
				currentFreq = defaultFreq;
			}

			result[classID] -= Math.log(currentFreq);
		}
	}

	return result;
}

Bayesian.prototype._classOfMinDegree = function(complianceDegrees) {
	var minDegree = Number.MAX_VALUE,
		minClassID = false,
		classID;

	for(classID in complianceDegrees) {
		if(complianceDegrees[classID] < minDegree) {
			minClassID = classID;
			minDegree = complianceDegrees[classID];
		}
	}

	return minClassID;
}

Bayesian.prototype.train = function(samples) {// получаем таблицу частот признаков
	this._frequencyCount(samples);
	this._normalize();
	console.log('Trained');
}

Bayesian.prototype._frequencyCount = function(samples) {
	var classID, feats, featID,
		i = 0, len = samples.length,
		classes = {}, freq = {},
		currentFreqCounter, currentFreq, currentFeatures;

	for(i = 0; i < len; i++) {// считаем частоты фич для классов
		classID = samples[i].classID;
		if (!classes[classID]) {
			classes[classID] = 1;
			freq[classID] = {
				ll:{},
				fl:{},
				sl:{}
			};
		} else {
			classes[classID] += 1;
		}

		currentFreqCounter = freq[classID];
		currentFeatures = samples[i].features;
		for(featID in currentFeatures) {
			if (!currentFreqCounter[featID][currentFeatures[featID]]) {
				currentFreqCounter[featID][currentFeatures[featID]] = 1;
			} else {
				currentFreqCounter[featID][currentFeatures[featID]] += 1;
			}
		}
	}

	this.classes = classes;
	this.frequencies = freq;
	this.samplesCount = len;
}

Bayesian.prototype._normalize = function() {
	var classID, featID, currentFreqCounter, feat;

	for(classID in this.frequencies) {
		currentFreqCounter = this.frequencies[classID];
		for(featID in currentFreqCounter) {
			for(feat in currentFreqCounter[featID]) {
				currentFreqCounter[featID][feat] /= this.classes[classID];
			}
		}
	}

	for(classID in this.classes) {
		this.classes[classID] /= this.samplesCount;
	}
}

Bayesian.prototype.getFeatures = function(word) {
	word = word.trim().toLowerCase();
	if(word.length < 3) {
		throw new Error('Small name')
	}

	return { 
		fl:word[0],
		sl:word[1],
		ll:word[word.length - 1]
	};
}

Bayesian.prototype.save = function() {
	console.log(this.classes);
	console.log(JSON.stringify(this.classes));
	fs.writeFileSync('data/data.json', JSON.stringify(this), 'utf8');
	console.log('Saved');
}

Bayesian.prototype.load = function() {
	try {
		var data = JSON.parse(fs.readFileSync('data/data.json'));
		this.classes = data.classes;
		this.frequencies = data.frequencies;
		this.samplesCount = data.samplesCount;
		console.log('Loaded');
	} catch (e) {
		return false;
	}

	return true;
}

module.exports = Bayesian;