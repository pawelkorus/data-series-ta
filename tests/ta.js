var arrayIterator = require('../').arrayIterator;
var functionOperator = require('../').functionOperator;
var ta = require('../').ta;
var expect = require('chai').expect;

describe('technical analysis', function() {

var testData = [3.0, 4.8, 234.34, 34.5, 1.0, 123];

var extendedTestData = testData.map(function(v) { return v });
Array.prototype.push.apply(extendedTestData, [5, 94.56, 23.456]);

var fullData = [
/*	open,	close,	min,	max			*/
	[3.0,	5.0,	1.0,	10.0],
	[12.0,	24.0,	0.1,	100.0],
	[1.0,	36.0,	1.0,	70.0],
	[0.5,	18.0,	0.5,	20.0],
	[42.0,	42.0,	40.0,	60.0],
	[15.0,	17.0,	4.5,	20.0] 
]

var stochasticOscilatorTestData = [
/*	close,	min,	max			*/
	[5.0,	1.0,	10.0],
	[24.0,	0.1,	100.0],
	[36.0,	1.0,	70.0],
	[18.0,	0.5,	20.0],
	[42.0,	40.0,	60.0],
	[17.0,	4.5,	20.0] 
]

var check = function(expected, op) {
	expected.forEach(function(v) {
		if(v === undefined) {
			expect(op.next()).to.be.equal(v);
		} else {
			expect(op.next()).to.be.closeTo(v, 0.001);
		}
	})
}

var data = [
['SMA(3)', testData, [undefined, undefined, 80.71333, 91.21333, 89.94667, 52.83333], ta.SMA(3)],
['WMA(3)', testData, [undefined, undefined, 119.27, 96.163, 51.057, 67.58333333], ta.WMA(3)],
['EMA(0.33)', testData, [3, 3.6, 80.51333333, 65.17555556, 43.7837037, 70.1891358], ta.EMA(1/3)],
['ROC(3)', extendedTestData, [undefined, undefined, undefined, 10.5, -0.791666667, -0.475121618, -0.855072464, 93.56, -0.809300813], ta.ROC(3)],
['%K3 Stochastic Oscilator', stochasticOscilatorTestData, [undefined, undefined, 35.93593594, 17.91791792, 59.71223022, 27.73109244], ta.StochasticOscilator(3)],
];

data.forEach(function(v) {
	var label = v[0];
	var testData = v[1];
	var expected = v[2];
	var fun = v[3];
	
	it(label, function(done) {
		var it = arrayIterator(testData);
		var op = functionOperator(it, fun);
		
		check(expected, op);
		
		done();
	});
	
});

});
