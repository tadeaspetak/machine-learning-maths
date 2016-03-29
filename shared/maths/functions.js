import _ from 'lodash';

/**
 * Featured function specifics.
 */

var functions = {
  'linear': {
    name: 'Linear',
    compute(x, params){
      return params[0] + params[1] * x;
    },
    slope(x, params){
      return params[1];
    },
    equation(parameters){
      var params = _.defaults({}, parameters, {
        a: 'a',
        b: 'b'
      });
      return `y =
        ${params.a == 0 ? '' : params.a}
        ${params.a == 0 ? '' : '+'}
        ${params.b == 1 ? '' : params.b}
        x`;
    }
  },
  'quadratic': {
    name: 'Quadratic',
    compute(x, params){
      return params[0] + params[1] * (x * x);
    },
    slope(x, params){
      return 2 * params[1] * x;
    },
    equation(parameters){
      var params = _.defaults({}, parameters, {
        a: 'a',
        b: 'b'
      });
      return `y = ${params.a == 0 ? '' : params.a}${params.a == 0 ? '' : '+'}${params.b == 1 ? '' : params.b}x^2`;
    }
  },
  'root':{
    name: 'Square Root',
    compute(x, params){
      return params[0] + params[1] * (Math.sqrt(x));
    },
    slope(x, params){
      return params[1] / 2 / Math.sqrt(x);
    },
    equation(parameters){
      var params = _.defaults({}, parameters, {
        a: 'a',
        b: 'b'
      });
      return `y =
        ${params.a == 0 ? '' : params.a}
        ${params.a == 0 ? '' : '+'}
        ${params.b == 1 ? '' : params.b}
        \\sqrt{x}`;
    }
  }
};

export default functions;
