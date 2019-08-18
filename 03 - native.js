
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
  native(state);
  console.log(state.v[i + 23]);
}

function native(state) {
  const N = 3;
  const N2M1 = 4;
  const N2P1 = 5;
  const A0 = 11;
  const A1 = 13;
  const B1 = 21;
  const B2 = 22;
  const BJAJ = 12;

  state.v[N2M1] = state.v[N2P1] = state.v[6] = 2 * state.v[N];
  state.v[N2M1] -= 1;
  state.v[N2P1] += 1;
  state.v[11] = state.v[N2M1] / state.v[N2P1] / 2;  // '#4 and #5'
  state.v[A1] = - state.v[11];

  state.v[10] = state.v[N] - 1; // 10 ~ j
  state.v[7] = 2;
  state.v[A0] = state.v[6] / state.v[7]; // i.e. 2n / 2, to keep it authentic
  state.v[BJAJ] = state.v[B1] * state.v[A0]
  state.v[A1] = state.v[A1] + state.v[BJAJ]; //#11
  state.v[10] = state.v[10] - 1; // --j TODO: should this be 7, if it's J

  state.v[20] = 22; //offsetToResult

  do {
    --state.v[6]; //#13
    ++state.v[7];
    state.v[8] = state.v[6] / state.v[7]; // first terms of A : (2n-1)/3
    state.v[A0] *= state.v[8];


    --state.v[6]; // #17
    ++state.v[7];
    state.v[9] = state.v[6] / state.v[7]; // #19  second 2n+1/4
    state.v[A0] *= state.v[9]; //#20

    state.v[12] = state.v[A0] * state.v[state.v[20]];  // #21 A3 * B3    // state.v[20] aka offsetToResult
    state.v[A1] += state.v[12];

    state.v[10] = state.v[10] - 1; // --j

    ++state.v[20]; // aka offsetToResult

  } while(state.v[10] > 0);

  state.v[state.v[20]] = -state.v[A1];  // state.v[20] aka offsetToResult, always 1 after the last computed number
  state.v[3] = state.v[3] + 1;
}
