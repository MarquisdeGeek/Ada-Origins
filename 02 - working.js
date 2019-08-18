let state = {
  v: [undefined, 
  1, 2, 3,
  0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
  22,      // 19 : constant 22, used to copy itself in [20] each iteration
  0,       // 20 : the indirect address of the next Bernoulli number
  1/6,     // 21 : B1
  -1/30,   // 22 : B3
  0,       // 23 : B5 (computed on first iteration)
  0,       // 24 : B7 (result for original calculation)
  0,0,0,0, // for storing extra results
  ]
}
// NOTE: I manually zero v[13] & v[7] at the start. The notation 0V13 indicates that the value should be
// zero'd after reading. Such statements happen often, and usually at the end of the code. i.e. it
// tidies up after itself (rather than relying and sanitsing the input)
let code = [
/*  0 */  { op:undefined, d:[] }, // 
/*  1 */  { op:'x', a:2,  b:3,  d:[4,5,6] }, // 2n
/*  2 */  { op:'-', a:4,  b:1,  d:[4] },     // 2n-1
/*  3 */  { op:'+', a:5,  b:1,  d:[5] },     // 2n+1
/*  4 */  { op:'/', a:4,  b:5,  d:[11] },    // (2n-1)/(2n+1) - Ada's BUG lists this as 5/4
/*  5 */  { op:'/', a:11, b:2,  d:[11] },    // (2n-1)/(2n+1)/2

/* NEW*/  { op:'-', a:13, b:13, d:[13] },    // A0 = 0 SG NEW, clear out old stuff; previously we relied on cells being 0
/* NEW*/  { op:'-', a:7,  b:7,  d:[7] },     // A0 = 0 SG NEW, clear out old stuff; previously we relied on cells being 0

/*  6 */  { op:'-', a:13, b:11, d:[13] },    // A0 = - ...
/*  7 */  { op:'-', a:3,  b:1,  d:[10] },    // n-1 = 3
/*  8 */  { op:'+', a:2,  b:7,  d:[7] },     // 2+0 = 2, i.e. V2 -> V7
/*  9 */  { op:'/', a:6,  b:7,  d:[11] },    // A0 = 2n/2 = Aj
/* 10 */  { op:'x', a:21, b:11, d:[12] },    // B1*A0
/* 11 */  { op:'+', a:12, b:13, d:[13] },    // V12 -> V13: x = V12
/* 12 */  { op:'-', a:10, b:1,  d:[10] },    // j-1 = 2
/* NEW*/  { op:'-', a:20, b:20, d:[20] },    // SG: zero the contents of 20
/* NEW*/  { op:'+', a:19, b:20, d:[20] },    // SG: v19->v20

/* 13 */  { op:'-', a:6,  b:1,  d:[6] },     // 2n-1
/* 14 */  { op:'+', a:1,  b:7,  d:[7] },     // 2+1=3 (j)
/* 15 */  { op:'/', a:6,  b:7,  d:[8] },     // (2n-1)/3
/* 16 */  { op:'x', a:8,  b:11, d:[11] },    // Aj * (2n-1)/3
/* 17 */  { op:'-', a:6,  b:1,  d:[6] },     // 2n-2
/* 18 */  { op:'+', a:1,  b:7,  d:[7] },     // 3+1=4 (j+1)
/* 19 */  { op:'/', a:6,  b:7,  d:[9] },     // (2n-2)/4
/* 20 */  { op:'x', a:9,  b:11, d:[11] },    // Aj * (2n-2)/4 -> Aj = A3

/* 21 */  { op:'x', a:"*20", b:11, d:[12] }, // A3 * B3 (written as B3 * A3) // SG: a:22 changed to *20
/* NEW */ { op:'+', a:20, b:1,  d:[20] },    // SG: bprev++
/* 22 */  { op:'+', a:12, b:13, d:[13] },    // x + A3*B3 -> x
/* 23 */  { op:'-', a:10, b:1,  d:[10] },    // j-1 = 1
/* 24 */  { op:'?', jump:17, d:[] },         // ~> 13 repeat if j>0 // SG: change address 

/* 25 */  { op:'-', a:"*20", b:13, d:["*20"] },// B7 = -x  // SG Use indirect addressing
/* 26 */  { op:'+', a:1,  b:3,  d:[3] },     // n+1 -> n
];

for(let i=0;i<4;++i) {
  analytical(state, code);
  console.log(state.v[i + 23]);
}


function analytical(state, code) {
  let pc = 1;
  let mill;
  let decodeOperand = function(operand) {
    if (typeof operand === typeof "") {
      if (operand.substr(0,1) === '*') {
        return state.v[parseInt(operand.substr(1), 10)];
      }
      return parseInt(operand, 10);
    }
    return operand;
  };

  do {
    let new_pc = pc + 1;
    let a = decodeOperand(code[pc].a);
    let b = decodeOperand(code[pc].b);
    switch(code[pc].op) {
      case 'x':
      mill = state.v[a] * state.v[b];
      break;
      case '+':
      mill = state.v[a] + state.v[b];
      break;
      case '-':
      mill = state.v[a] - state.v[b];
      break;
      case '/':
      mill = state.v[a] / state.v[b];
      break;
      case '?':
      if (mill !== 0) {
        new_pc = code[pc].jump;
      }
      break;
    }
    //
    code[pc].d.forEach(function(dest) {
      if (typeof dest === typeof "" && dest.substr(0,1) === '*') {
        state.v[state.v[parseInt(dest.substr(1), 10)]] = mill;
      } else {
        state.v[dest] = mill;	
      }
    });
    //
    pc = new_pc;

  } while(pc < code.length);

}
