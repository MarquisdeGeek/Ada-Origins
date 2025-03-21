// Basic class idea from https://stackoverflow.com/a/23575406
class Fraction {
    constructor(fraction) {
      this._fraction = parseFloat(fraction);
      this._sign = Math.sign(fraction);
    }
    
    #_sign;
    #_fraction;

    // Logic from https://stackoverflow.com/a/48953823
    toFraction(x, tolerance) {
        if (x == 0) return [0, 1];
        if (x < 0) x = -x;
        if (!tolerance) tolerance = 0.0001;
        var num = 1, den = 1;
    
        function iterate() {
            var R = num/den;
            if (Math.abs((R-x)/x) < tolerance) return;
    
            if (R < x) num++;
            else den++;
            iterate();
        }
    
        iterate();
        return [num, den];
    }

    toString() {
        let fr = this.toFraction(this._fraction, 0.000001);
        return `${this._sign<0?'-':' '}${fr[0]}/${fr[1]}`;
    }
  }

  exports.Fraction = Fraction;
