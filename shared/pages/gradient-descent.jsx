import d3 from 'd3';
import katex from 'katex';
import _ from 'lodash';
import React from 'react';

import equations from 'maths/equations';
import functions from 'maths/functions';
import Plotter from 'maths/plotter';

/**
 * The wrapper for the 2 charts.
 */

export default class GradientDescent extends React.Component {
  constructor(props){
    super(props);
  }
  plotCost(param, cost){
      this.costChart.plotCost(param, cost);
  }
  componentDidMount(){
    this.updateMath();
  }
  updateMath(){
    katex.render(equations.gradientDescent, document.getElementById("gradientDescentEquation"));
  }
  render() {
    return(<div>
      <h1>Gradient Descent</h1>
      <p>Gradient descent is a way to <strong>automatically improve our hypothesis.</strong> Which is,
      incidentally, exaclty what we need in order for machine learning to occurr. Who would have guessed, huh?</p>

    <p>Again, it&apos;s no rocket science. First, we plot the cost for a random value of an argument. Then, we take the <strong>derivative</strong> at
      that point, adjust the argument using the following formula, rinse and repeat. Should the formula seem a bit scary to you, take another look:</p>

    <div className="equation-block" id="gradientDescentEquation"></div>

    <ul>
      <li><strong>&theta;<sub>1</sub></strong> is the argument we are adjusting.</li>
      <li><strong>&alpha;</strong> is the learning rate. Experiment with adjusting it, it determines how quickly the gradient descent converges,
        to the minimum. Careful though, if it is too large, it might fail to ever converge, diverging instead!</li>
      <li>The rest of the formula is the derivative, which is the slope of the cost function at that point. If you are interested in its origins,
      check <a href="http://math.stackexchange.com/questions/70728/partial-derivative-in-gradient-descent-for-two-variables/189792#189792">this answer on
      Math Stackexchange</a>, I have never seen a more concise explanation.</li>
    </ul>

    <p><strong>Plot the cost</strong> of the current hypothesis, let the algorithm <strong>suggest</strong> the next step and then
    simply let it <strong>perform</strong> the suggested step. If you are only interested in the results, you can omit the <em>suggest</em> step.</p>

      <div className="column left">
        <h2>Values</h2>
        <ValueChart plotCost={this.plotCost.bind(this)} />
      </div>
      <div className="column right">
        <h2>Costs</h2>
        <CostChart ref={ref => this.costChart = ref}/>
      </div>
    </div>)
  }
}

/**
 * Value chart.
 *
 * .......
 */

class ValueChart extends React.Component{
  constructor(props){
    super(props);

    //initialize the state
    this.state = {
      params: {
        b: 10
      },
      alpha: 0.01,
      costGradient: 0,
      nextSuggested: 0
    };

    this.drawFunction = d3.svg.line().interpolate('basis')
      .x(v => this.plotter.x(v))
      .y(v => this.plotter.y(this.computeFuncValue(v)));
  }
  componentDidMount(){
    this.currentFunction = functions['linear'];
    this.paint();
  }
  handleParamChange(e){
    var value = e.target.value;
    var float = parseFloat(value);

    //invalid value, just update the input
    if(value.toString() != float.toString()){
      this.setState({params:{b: value}});
    }
    //real number, update the graph
    else {
      this.setState({params:{b: float}}, () => this.draw(false));
    }
  }
  handleAlphaChange(e){
    this.setState({
      alpha: e.target.value
    })
  }
  render() {
    return(<div>
      <div className="chart-container"><svg className="chart"></svg></div>

      <div className="controls">

        <div className="control-group">
          <label>Parameter &theta;<sub>1</sub>: </label>
          <input type="text" value={this.state.params.b} onChange={this.handleParamChange.bind(this)} />
        </div>
        <div className="control-group">
          <label>Learning Rate &alpha;: </label>
          <input type="text" value={this.state.alpha} onChange={this.handleAlphaChange.bind(this)} />
        </div>

        <div className="controls-buttons">
          <button className="button" onClick={this.draw.bind(this)}>Rescale</button>
          <button className="button-green" onClick={this.plotCost.bind(this)}>Plot Cost</button>
          <button className="button-green" onClick={this.suggestNextStep.bind(this)}>Suggest</button>
          <button className="button-blue" onClick={this.performNextStep.bind(this)}>Perform</button>
        </div>
      </div>

      <div className="suggestions-info">
        <h3>Info</h3>
        <div>
          <label>Current value of parameter <strong>&theta;<sub>1</sub></strong>:</label>
          <span>{this.state.params.b}</span>
        </div>
        <div>
          <label>Current gradient of the cost function:</label>
          <span>{this.state.costGradient.toFixed(2)}</span>
        </div>
        <div>
          <label>Next suggested vlaue of parameter a:</label>
          <span>{this.state.nextSuggested.toFixed(2)}</span>
        </div>
      </div>
    </div>)
  }
  getCost(){
    return this.data.reduce((sum, v) => {
      return sum + Math.pow(this.computeFuncValue(v.size) - v.price, 2);
    }, 0) / (2 * this.data.length);
  }
  getCostGradient(){
    return this.data.reduce((sum, v) => {
      return sum + (this.computeFuncValue(v.size) - v.price) * v.size;
    }, 0) / (this.data.length);
  }
  plotCost(){
    this.props.plotCost(this.state.params.b, this.getCost());
  }
  suggestNextStep(){
    var costGradient = this.getCostGradient();
    var nextSuggested = this.state.params.b - this.state.alpha * costGradient;

    this.setState({
      costGradient: costGradient,
      nextSuggested: nextSuggested
    });
  }
  performNextStep(){
    var costGradient = this.getCostGradient();
    var nextSuggested = this.state.params.b - this.state.alpha * costGradient;

    this.setState({
      params: {
        b: nextSuggested
      }
    }, state => {
      this.draw(false);
    });
  }
  computeFuncValue(x){
    return this.currentFunction.compute(x, [0, this.state.params.b]);
  }
  paint(){
    var plotter = this.plotter = new Plotter();
    var chart = this.chart = plotter.chart;

    //intitialize all the potential elements
    chart.append('path').attr("class", 'line function');

    //show helpers on mousemove
    var self = this;
    this.plotter.canvas.on('mousemove', function() {
      var [cx, cy] = d3.mouse(this);
      var [ix, iy] = self.plotter.getInverted(cx, cy);

      //only valid values!
      if (!self.plotter.isInRange(ix, iy)) return;

      //print the label
      self.plotter.drawHelpers(ix, self.computeFuncValue(ix));
    })

    // get the data
    d3.csv("data/data.csv", v => {
      //make sure we are working with numbers
      v.size = +v.size;
      v.price = +v.price;
      return v;
    }, (error, data) => {
      this.data = data;
      //make sure the hypothesis function is drawn a bit further than the data points
      this.xRange = _.range(0, d3.max(this.data, d => d.size) + 10, 10);

      this.draw();
    });
  }
  draw(rescale) {
    //rescale (unless told otherwise) and draw the axes
    if(rescale !== false) this.rescale();
    this.plotter.drawAxes();

    //draw the selected function
    this.chart.select('.line.function')
      .attr("d", this.drawFunction(this.xRange));

    //plot the points
    var setPoints = points => points
      .attr('cx', v => this.plotter.x(v.size))
      .attr('cy', v => this.plotter.y(v.price))

    var points = setPoints(this.chart.selectAll('.point.value').data(this.data));
    setPoints(points.enter().append('circle').attr('class', 'point value').attr('r', 4));

    //draw the distance lines between actual & hypothesized values
    var setDistanceLine = distances => distances
        .attr('x1', v => this.plotter.x(v.size))
        .attr('y1', v => this.plotter.y(v.price))
        .attr('x2', v => this.plotter.x(v.size))
        .attr('y2', v => this.plotter.y(this.computeFuncValue(v.size)));

    var existing = setDistanceLine(this.chart.selectAll('.line.distance').data(this.data));
    setDistanceLine(existing.enter().append('line').attr('class', 'line distance'));
  }
  //rescale the chart
  rescale(){
    var xMax = d3.max(this.data, d => d.size);
    this.plotter.rescale(0, xMax, 0, Math.max(
      d3.max(this.data, d => d.price),
      this.computeFuncValue(xMax))
    );
  }
}

/**
 * Cost-plotting chart.
 *
 * Communicates with the value-plotting chart via calling the `plotCost` function.
 */

class CostChart extends React.Component{
  constructor(props){
    super(props);
    this.data = [];
  }
  render(){
    return <div><div className="chart-container"><svg className="chart-cost"></svg></div></div>;
    }
  componentDidMount(){
    var plotter = this.plotter = new Plotter({
      selector: '.chart-cost'
    });

    this.draw();
  }
  plotCost(param, cost){
    this.data.push([param, cost]);
    this.draw();
  }
  draw(){
    //rescale & draw the x-axis and y-axis
    this.plotter.rescale(0, d3.max(this.data, d => d[0]), 0, d3.max(this.data, d => d[1]));
    this.plotter.drawAxes();

    //plot the points
    var setPointPosition = points => points
      .attr('cx', v => this.plotter.x(v[0]))
      .attr('cy', v => this.plotter.y(v[1]))
      .on('mouseover', v => {
        this.plotter.drawHelpers(v[0], v[1]);
      }).on('mouseout', v => {
        this.plotter.hideHelpers();
      });

    var points = setPointPosition(this.plotter.chart.selectAll('.cost.point').data(this.data));
    setPointPosition(points.enter().append('circle').attr('class', 'cost.point').attr('r', 6));
  }
}
