import AnimatedNode from './AnimatedNode';
import { val } from '../val';

import invariant from 'fbjs/lib/invariant';
import { adapt } from '../core/AnimatedBlock';

function reduce(fn) {
  return input => input.reduce((a, b) => fn(val(a), val(b)));
}

function reduceFrom(fn, initialValue) {
  return input => input.reduce((a, b) => fn(val(a), val(b)), initialValue);
}

function infix(fn) {
  return input => fn(val(input[0]), val(input[1]));
}

function single(fn) {
  return input => fn(val(input[0]));
}

const OPERATIONS = {
  // arithmetic
  add: reduce((a, b) => a + b),
  sub: reduce((a, b) => a - b),
  multiply: reduce((a, b) => a * b),
  divide: reduce((a, b) => a / b),
  pow: reduce((a, b) => Math.pow(a, b)),
  modulo: reduce((a, b) => ((a % b) + b) % b),
  sqrt: single(a => Math.sqrt(a)),
  log: single(a => Math.log(a)),
  sin: single(a => Math.sin(a)),
  cos: single(a => Math.cos(a)),
  tan: single(a => Math.tan(a)),
  acos: single(a => Math.acos(a)),
  asin: single(a => Math.asin(a)),
  atan: single(a => Math.atan(a)),
  exp: single(a => Math.exp(a)),

  // logical
  and: reduceFrom((a, b) => a && b, true),
  or: reduceFrom((a, b) => a || b, false),
  not: single(a => !a),
  defined: single(a => a !== null && a !== undefined && !isNaN(a)),

  // comparing
  lessThan: infix((a, b) => a < b),
  /* eslint-disable-next-line eqeqeq */
  eq: infix((a, b) => a == b),
  greaterThan: infix((a, b) => a > b),
  lessOrEq: infix((a, b) => a <= b),
  greaterOrEq: infix((a, b) => a >= b),
  /* eslint-disable-next-line eqeqeq */
  neq: infix((a, b) => a != b),
};

class AnimatedOperator extends AnimatedNode {
  _input;
  _op;
  _operation;

  constructor(operator, input) {
    super(
      { type: 'op', op: operator, input: input.map(n => n.__nodeID) },
      input
    );
    this._op = operator;
    this._input = input;
  }

  __onEvaluate() {
    if (!this._operation) {
      this._operation = OPERATIONS[this._op];
      invariant(this._operation, `Illegal operator '%s'`, this._op);
    }
    return this._operation(this._input);
  }
}

export function createAnimatedOperator(name) {
  return (...args) => new AnimatedOperator(name, args.map(adapt));
}
