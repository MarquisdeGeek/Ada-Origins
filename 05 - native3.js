// Steps:
//   1. Remove need for temporary vars, e.g. in *= a / b
//   2. Remove v[6] used for holding n*2
//   3. Remove numerator/denom from individual increments

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
  native3(state);
  console.log(state.v[i + 23]);
}


function native3(state, code) {
  let N = 3;
  let N2M1 = 4;
  let N2P1 = 5;
  let B1 = 21;
  let B2 = 22;
  let n = state.v[N];

  state.v[N2M1] = state.v[N2P1] = state.v[6] = 2 * state.v[N];
  state.v[N2M1] -= 1;
  state.v[N2P1] += 1;
  state.v[11] = state.v[N2M1] / state.v[N2P1] / 2;  // '#4 and #5'
  let accumulatingTotal = - state.v[11];

  let k = state.v[N] - 1; // 10 ~ j
  k = k - 1;

  let denom = 2;
  let accumulatingFraction = (2*n) / denom; // i.e. 2n / 2, to keep it authentic

  accumulatingTotal += state.v[B1] * accumulatingFraction

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
