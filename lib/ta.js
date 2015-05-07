var functionOperator = require('./core').functionOperator;
var valueIterator = require('./core').valueIterator;

function SMA(n) {
	var buffer = [];
	var mean = 0;

	var f = function(v) {
		if(v === undefined) return undefined;

		mean += v/n;
		buffer.push(v);
		
		if(buffer.length < n) {
			return undefined;
		} else if(buffer.length == n) {
			return mean;
		} else {
			mean -= buffer.shift()/n;
			return mean;
		}
	}
	
	return f;
}

function WMA(n) {
	var result = 0;
	var sum = 0;
	var buffer = [];
	
	var divider = 0;
	for(var i = 1; i <= n; i++) {
		divider += i;
	}
	
	var f = function(v) {
		if(v === undefined) return undefined;

		buffer.push(v);
		
		result = result + n * v - sum;
		sum += v;
		
		if(buffer.length < n) {	
			return undefined;
		} else if(buffer.length == n) {
			// intentionally left blank, because return value should not be undefined
		} else {
			sum -= buffer.shift();
		}
		
		return result / divider;
	}
	
	return f;
}

/**
 * As starting point for recursive formula the first value in time series is taken
 */
function EMA(periods) {
	var ema = undefined;
	var alpha = 2/(periods + 1);
	
	var f = function(v) {
		if(v === undefined) return undefined;
	
		if(ema === undefined) {
			ema = v;
			return ema;
		} else {
			ema = ema + alpha * (v - ema);
			return ema;
		}
	}
	
	return f;
}

function ROC(n) {
	var buffer = [];
	
	var f = function(v) {
		if(v === undefined) return undefined;

		buffer.push(v);
		
		if(buffer.length <= n) {
			return undefined;
		} else {
			var historicalV = buffer.shift();
			return (v - historicalV)/historicalV
		}
	}
	
	return f;
}

function StochasticOscilator(n) {
	var bufferLow = [];
	var bufferHigh = [];
	var high = Number.MIN_VALUE;
	var low = Number.MAX_VALUE;
	var result = undefined;

	var f = function(close, currentLow, currentHigh) {
		if(close === undefined || currentHigh === undefined || currentLow === undefined) return undefined;

		if(currentHigh > high) high = currentHigh;
		
		if(currentLow < low) low = currentLow;

		bufferHigh.push(currentHigh);
		bufferLow.push(currentLow);
		
		if(bufferHigh.length >= n) {
			result = 100 * (close - low)/(high - low);
			
			var old = bufferHigh.shift();
			if(old == high) { // we need to find new high
				high = Math.max.apply(null, bufferHigh);
			} 
	
			old = bufferLow.shift();
			if(old == low) { // we need to find new low
				low = Math.min.apply(null, bufferLow);
			}
		} else {
			result = undefined;
		}

		return result;
	}
	
	return f;
}

function MACD(a, b, c) {
	var macdLineIt = valueIterator();
	var signalLineIt = valueIterator();

	var EMAa = functionOperator(macdLineIt, EMA(a));
	var EMAb = functionOperator(macdLineIt, EMA(b));
	var EMAc = functionOperator(signalLineIt, EMA(c));
	
	var f = function(v) {
		if(v === undefined) return undefined;

		macdLineIt.setValue(v);
		var macdV = EMAa.next() - EMAb.next();
		
		signalLineIt.setValue(macdV);
		var signalLineV = EMAc.next();
		
		return [macdV, signalLineV];
	}

	return f;
}

module.exports = exports = {
	SMA: SMA,
	WMA: WMA,
	EMA: EMA,
	ROC: ROC,
	StochasticOscilator: StochasticOscilator,
	MACD: MACD
}
