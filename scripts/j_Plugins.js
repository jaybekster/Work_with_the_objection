(function() {

Function.prototype.throttle = (function() { //delay method before next invoke for any function
	var self = func = delay = null,
		busy = false;
	func = function throttle(delay) {
		if (busy) {
			return false;
		} else {
			if( isNaN(delay) ) {
				return false
			} else {
				delay = parseInt(delay)
			}
			self = this;
			busy = true;
			setTimeout(function() {
				busy = false;
			}, delay)
			return self.apply(this, Array.prototype.slice.call(arguments, 1 ) )
		}
	}
	return func;
})()

Array.prototype.remake = function(Type) {
	if (!Type || !Type.prototype) return false;
	var length = this.length;
	while(length--) {
		this[length] = new Type();
	}
	return this;
}

if (!Array.prototype.filter) {
	Array.prototype.filter = function(fun) {
		var len = this.length;
		if (typeof fun != "function") throw new TypeError({
			title: "argument is not a function"
		});
		var res = new Array();
		var thisp = arguments[1];
		for (var i = 0; i < len; i++) {
			if (i in this) {
				var val = this[i];
				if (fun.call(thisp, val, i, this)) res.push(val);
			}
		}
	return res;
	}
}

if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (obj, start) {
    for (var i = (start || 0); i < this.length; i++) {
      if (this[i] == obj) {
        return i;
      }
    }
    return -1;
  }
}

if (!Number.prototype.isInt) {
	Number.prototype.isInt = function() {
		return ( Math.round(this)===this+0 )
	}
}

if (!Math.roundTo) {
	Math.roundTo = function(num, count) {
		var x = Math.pow(10, count);
		num*=x;
		return Math.round(num)/x;
	}	
}

if (!Array.prototype.forEach) {
	Array.prototype.forEach = function(fun) {
		var len = this.length;
		if (typeof fun != "function") throw new TypeError();
		var thisp = arguments[1];
		for (var i = 0; i < len; i++) {
			if (i in this) fun.call(thisp, this[i], i, this);
		}
	}
}

if (!Array.prototype.map) {
  Array.prototype.map = function(callback, thisArg) {
    var T, A, k;
    if (this == null) {
      throw new TypeError();
    }
    var O = Object(this);
    var len = O.length >>> 0;
    if (typeof callback !== "function") {
      throw new TypeError(callback + " is not a function");
    }
    if (thisArg) {
      T = thisArg;
    }
    A = new Array(len);
    k = 0;
    while(k < len) {
      var kValue, mappedValue;
      if (k in O) {
        kValue = O[ k ];
        mappedValue = callback.call(T, kValue, k, O);
      }
      k++;
    }
    return A;
  }   
}
if (!Object.prototype.method) {
	Object.prototype.method = function method(name, func) {
		return !this.prototype[name] ? this.prototype[name] = func : false; 
	}
}

if (jQuery) {

jQuery.fn.leftclick = function ( data, fn ) { //left click jQuery event hamdler method
	var name = "mousedown",
		func = function(e) {
			var self = this;
			if (e.which==1) {
				e.type = "leftclick"
				return ( func = fn.call(this, e) );
			}
			return false;
		}
	if ( fn == null ) {
		fn = data;
		data = null;
	}
	return arguments.length > 0 ? this.on( name, null, data, func ) : this.trigger( name );
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateArrayRandomNumber (min, len) {
//  Нужно учесть что в диапазоне участвуют и минимальное и максимальное число
//  тоесть если задать (0, 100) то на выходе получим массив из 101-го числа
//  от 1 до 100 и плюс число 0
	var totalNumbers    = questions({}).count()-1 - min + 1,
	    arrayTotalNumbers   = [],
	    arrayRandomNumbers  = [],
	    tempRandomNumber;
	while (totalNumbers--) {
		arrayTotalNumbers.push(totalNumbers + min);
	}
	while (len--) {
		tempRandomNumber = Math.round(Math.random() * (arrayTotalNumbers.length - 1));
		arrayRandomNumbers.push(arrayTotalNumbers[tempRandomNumber]);
		arrayTotalNumbers.splice(tempRandomNumber, 1);
	}
	return arrayRandomNumbers;
}

}

})()