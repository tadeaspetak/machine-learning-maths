import d3 from 'd3';
import _ from 'lodash';
import React from 'react';

import Plotter from 'maths/plotter';
import functions from 'maths/functions';
import katex from 'katex';

/**
 * Functions & derivatives.
 */

export default class Derivative extends React.Component {
  constructor(props){
    super(props);

    //initialize the state
    this.state = {
      params: {
        a: 10,
        b: 4.5
      }
    };

    //initialize some common things
    this.data = _.range(0, 10, 0.1);
    this.drawFunction = d3.svg.line()
      .interpolate('basis')
      .x(item => this.plotter.x(item))
      .y(item => this.plotter.y(this.computeFuncValue(item)));
  }
  componentDidMount(){
    this.currentFunction = functions[d3.select('.functionType').node().value];
    this.updateMath();

    this.initialize();
  }
  render() {
    return(<div>
      <h1 className="page-header">Quick Intro to Mathematical Functions & Derivatives</h1>

      <p>A <strong>mathematical function</strong> is a relation of a set of inputs and a set
        of outputs with the property that each input corresponds to exactly one output. This unambiguity
        is extremely important as otherwise, it would be impossible to reliably predict the output value
        of a function for given input(s). In this demo, we are going to focus solely on
        functions with one argument <strong><em>x</em></strong>. The output is, by convention, denoted <strong><em>y</em></strong>.</p>

      <p>The <strong>derivative</strong> of a function measures the sensitivity to change of the output to changes in input.
        I.e. how quickly the output increases or decreases when we increase or decrease the argument(s).
        In layman terms, it is the slope of the tangent to the function curve at a specific point.</p>

      <p>Play around with the chart below until you feel you understand what is going on without reservations.
        Try changing the parameters and the function type, watch the curve reflect these adjustments, and see how the derivative
        changes as the <strong><em>x</em></strong> increases: staying constant for linear functions, rising for quadratic,
        decreasing for the square root.</p>

      <div className="chart-container">
        <svg className="chart"></svg>
      </div>

      <div className="controls">
        <div className="controls-equations">
          <div id="outputGeneral"></div>
          <div id="outputSpecific"></div>
        </div>

        <div className="control-group">
          <label>Function Type:</label>
          <select className="functionType" defaultValue="quadratic">
            <option value="linear">Linear</option>
            <option value="quadratic">Quadratic</option>
            <option value="root">Square root</option>
          </select>
        </div>

        <div className="parameters">
          <div className="control-group">
            <label>a:</label>
            <input type="number" data-param="a" value={this.state.params.a} onChange={this.handleParamChange.bind(this)} />
          </div>
          <div className="control-group">
            <label>b:</label>
            <input type="number" data-param="b" value={this.state.params.b} onChange={this.handleParamChange.bind(this)} />
          </div>
        </div>

        <div className="controls-buttons">
          <button className="button-green" onClick={this.draw.bind(this)}>Rescale</button>
        </div>
      </div>
    </div>)
  }
  /**
   * Update the math equations (both or the second one only, if requested).
   */
  updateMath(secondOnly){
    if(secondOnly !== true){
      katex.render(this.currentFunction.equation(), document.getElementById("outputGeneral"), {
        displayMode: true
      });
    }
    katex.render(this.currentFunction.equation({
      a: this.state.params.a,
      b: this.state.params.b
    }), document.getElementById("outputSpecific"), {
      displayMode: true
    });
  }
  /**
   * Handle function parameter changes (a, b).
   */
  handleParamChange(e){
    var value = e.target.value;
    var float = parseFloat(value);
    var params = this.state.params;

    //invalid value, just update the input
    if(value.toString() !== float.toString()){
      params[e.target.dataset.param] = value;
      this.setState({params: params});
    }
    //real number, update the graph
    else {
      params[e.target.dataset.param] = float;
      this.setState({params: params}, () => {
        this.updateMath(true);
        this.draw(false);
      });
    }
  }
  /**
   * Get the value of the function at the given `x`.
   */
  computeFuncValue(x){
    return this.currentFunction.compute(x, [this.state.params.a, this.state.params.b]);
  }
  /**
   * Get the slope of the function at the given `x`.
   */
  computeSlope(x){
    return this.currentFunction.slope(x, [this.state.params.a , this.state.params.b]);
  }
  /**
   * Initialize the canvas.
   */
  initialize(){
    //initialize the plotter
    var plotter = this.plotter = new Plotter();
    var chart = this.chart = plotter.chart;

    //update the tangent on mouse move
    var self = this;
    this.plotter.canvas.on('mousemove', function() {
      var [cx, cy] = d3.mouse(this);
      var [ix, iy] = self.plotter.getInverted(cx, cy);

      //only valid values!
      if (!self.plotter.isInRange(ix, iy)) return;

      //draw the tangent
      self.drawTangent(ix, iy);

      //show helpers
      self.plotter.drawHelpers(ix, self.computeFuncValue(ix));
    })

    //intitialize all the potential future elements in the chart
    chart.append('path').attr("class", 'line function');
    chart.append('path').attr("class", "line tangent");
    chart.append('circle').attr('class', 'point tangent');

    // register a listener to update the graph on function type change
    d3.select('.functionType').on('change', () => {
      this.currentFunction = functions[d3.select('.functionType').node().value];
      this.updateMath();
      this.draw();
    });

    this.draw();
  }
  /**
   * (Re)draw the plot.
   */
  draw(rescale) {
    //rescale (unless told otherwise) and plot the axes
    if(rescale !== false) this.rescale();
    this.plotter.drawAxes();

    //draw the selected function
    this.chart.select('.line.function').attr('d', this.drawFunction(this.data));

    // remove the tangent for now
    this.chart.select('.line.tangent').attr('d', '');
    this.chart.select('circle').attr('r', 0);

    //remove the helpers
    this.plotter.hideHelpers();
  }
  /**
   * Draw a tangent to the curve at the given coordinates.
   */
  drawTangent(ix, iy) {
    //point where the tangent touches the curve
    this.chart.select('circle')
      .attr('cx', this.plotter.x(ix))
      .attr('cy', this.plotter.y(this.computeFuncValue(ix)))
      .attr('r', 4);

    //the tangent itself
    var tangent = d3.svg.line()
      .x(item => this.plotter.x(item))
      .y(item => this.plotter.y(this.computeSlope(ix) * (item - ix) + this.computeFuncValue(ix)));
    this.chart.select('.line.tangent').attr('d', tangent(this.data))
  }
  rescale(){
    var xMax = d3.max(this.data, d => d);
    this.plotter.rescale(0, xMax, 0, this.computeFuncValue(xMax));
  }
}
