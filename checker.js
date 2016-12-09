var fs = require('fs'),
	Checker = function() {};

Checker.prototype.check = function(bayessian) {
	var maleNames = fs.readFileSync('samples/maleSamples.txt', 'utf8').split('\r\n'),
		femaleNames = fs.readFileSync('samples/femaleSamples.txt', 'utf8').split('\r\n'),
		i, len,
		maleRightCount = 0, femaleRightCount = 0;

	for(i = 0, len = maleNames.length; i < len; i++) {
		if(maleNames[i].length > 3) {
			if(bayessian.classify(maleNames[i]) == 'm') {
				maleRightCount++;
			} else {
				console.log('Error on male name ' + maleNames[i]);
			}
		}
	}

	for(i = 0, len = femaleNames.length; i < len; i++) {
		if(femaleNames[i].length > 3) {
			if(bayessian.classify(femaleNames[i]) == 'f') {
				femaleRightCount++;
			} else {
				console.log('Error on female name ' + femaleNames[i]);
			}
		}
	}

	return {
		all:((maleRightCount + femaleRightCount) / (maleNames.length + femaleNames.length)),
		male:(maleRightCount/maleNames.length),
		female:(femaleRightCount/femaleNames.length)
	};
}

module.exports = Checker;