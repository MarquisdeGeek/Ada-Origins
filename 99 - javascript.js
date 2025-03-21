let Fraction = require('./fraction').Fraction


let state = {
  n: 3,
  results: []
}

console.log(`The even-indexed Bernoulli numbers:\n[0] =  1`);

for(var i=0;i<9;++i) {
  nativeJavaScript(state);

  const bn = state.results[i];
  console.log(`[${i+1}] = ${bn<0?'':' '}${(bn).toFixed(9)} (~= ${new Fraction(bn).toString()})`);
}
console.log(`(all fractionals are approximate, as they've been computed from the decimal)`);


// Change state structure
function nativeJavaScript(state) {
  const n = state.n;

  state.results[0] = 1/6;   // B1
  state.results[1] = -1/30; // B3

  let k = n - 2;
  let denom = 2;
  let accumulatingFraction = (2*n) / denom; // i.e. 2n / 2, to keep it authentic
  let accumulatingTotal = 0;

  // Manually process the first 2 terms
  accumulatingTotal += - (2*n - 1) / (2*n + 1) / 2;  // '#4 and #5' - A0
  accumulatingTotal += accumulatingFraction * state.results[0]; // A1

  let numerator = 2 * n;
  let indexToResult = 1;
  do {
    accumulatingFraction *= (numerator - 1) / (denom + 1); // first terms of A : (2n-1)/3
    accumulatingFraction *= (numerator - 2) / (denom + 2); // #19  second 2n+1/4

    accumulatingTotal += accumulatingFraction * state.results[indexToResult];  // #21 A3 * B3

    numerator -= 2;
    denom += 2;

    ++indexToResult;

  } while(--k > 0);

  state.results[indexToResult] = -accumulatingTotal;
  state.n++;
}
