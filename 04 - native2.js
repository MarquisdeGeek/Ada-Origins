// Steps:
//  1. Move loop counters into named variables
//  2. Move accumulators into named variables

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
  native2(state);
  console.log(state.v[i + 23]);
}

function native2(state, code) {
  const N = 3;
  const N2M1 = 4;
  const N2P1 = 5;
  const B1 = 21;
  const B2 = 22;
  const BJAJ = 12;

  state.v[N2M1] = state.v[N2P1] = state.v[6] = 2 * state.v[N];
  state.v[N2M1] -= 1;
  state.v[N2P1] += 1;
  state.v[11] = state.v[N2M1] / state.v[N2P1] / 2;  // '#4 and #5'
  let accumulatingTotal = - state.v[11];

  let k = state.v[N] - 1; // 10 ~ j
  k = k - 1;

  let denom = 2;
  let accumulatingFraction = state.v[6] / denom; // i.e. 2n / 2, to keep it authentic
  state.v[BJAJ] = state.v[B1] * accumulatingFraction
  accumulatingTotal += state.v[BJAJ]; //#11

  let offsetToResult = 22;
  do {
    --state.v[6]; //#13
    ++denom;
    state.v[8] = state.v[6] / denom; // first terms of A : (2n-1)/3
    accumulatingFraction *= state.v[8];


    --state.v[6]; // #17
    ++denom;
    state.v[9] = state.v[6] / denom; // #19  second 2n+1/4
    accumulatingFraction *= state.v[9]; //#20

    state.v[12] = accumulatingFraction * state.v[offsetToResult];  // #21 A3 * B3
    accumulatingTotal += state.v[12];

    k = k - 1;

    ++offsetToResult;

  } while(k > 0);

  state.v[20 + state.v[3]] = -accumulatingTotal
  state.v[3] = state.v[3] + 1;
}
