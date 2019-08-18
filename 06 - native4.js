// Steps:
//   1. Expand remaining n/2n instances
//   2. Swap accumulatingFraction * state.v[B1]; around to be consistent

let state = {
  v: [undefined, 
  1, 2, 3,
  0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
  22, // 19: constant 22, used to copy itself in [20] each iteration
  0, // 20 : the memory address of the 1st Bernoulli number, results are "appended" to this reference
  1/6,    // 21 : B1
  -1/30,  // 22 : B3
  0,      // 23 : B5 (our first to be computed)
  0,      // 24 : results continue in
  0,0,0,  // this extra storage
  ]
}

for(let i=0;i<4;++i) {
  native4(state);
  console.log(state.v[i + 23]);
}


function native4(state, code) {
  const N = 3;
  const B1 = 21;
  const B2 = 22;
  let n = state.v[N];

  let k = n - 2;
  let denom = 2;
  let accumulatingFraction = (2*n) / denom; // i.e. 2n / 2, to keep it authentic
  let accumulatingTotal = 0;

  // Manually process the first 2 terms
  accumulatingTotal += - (2*n - 1) / (2*n + 1) / 2;  // '#4 and #5' - A0
  accumulatingTotal += accumulatingFraction * state.v[B1]; // A1

  let numerator = 2 * n;
  let offsetToResult = 22;
  do {
    accumulatingFraction *= (numerator - 1) / (denom + 1); // first terms of A : (2n-1)/3

    accumulatingFraction *= (numerator - 2) / (denom + 2); // #19  second 2n+1/4

    accumulatingTotal += accumulatingFraction * state.v[offsetToResult];  // #21 A3 * B3

    numerator -= 2;
    denom += 2;

    ++offsetToResult;

  } while(--k > 0);

  state.v[20 + state.v[3]] = -accumulatingTotal
  state.v[3] = state.v[3] + 1;
}
