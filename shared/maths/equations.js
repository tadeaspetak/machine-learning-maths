/**
 * Mathematical representations of the featured equations.
 */

var equations = {
  hypothesis: `h_\\theta(x) = \\theta_0 + \\theta_1 x`,
  cost: `J(\\theta_0, \\theta_1) = \\dfrac {1}{2m} \\displaystyle \\sum _{i=1}^m \\left (h_\\theta (x^{(i)}) - y^{(i)} \\right)^2`,
  gradientDescent: `\\theta_1 := \\theta_1 - \\alpha \\frac{1}{m} \\sum\\limits_{i=1}^{m}\\left((h_\\theta(x^{(i)}) - y^{(i)}) x^{(i)}\\right)`
};

export default equations;
