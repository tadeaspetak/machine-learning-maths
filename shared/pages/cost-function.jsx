import d3 from 'd3';
import _ from 'lodash';
import katex from 'katex';
import React from 'react';

import equations from 'maths/equations';
import functions from 'maths/functions';
import Plotter from 'maths/plotter';

/**
 * The wrapper for the 2 charts.
 */

export default class CostFunction extends React.Component {
  constructor(props){
    super(props);
  }
  plotCost(param, cost){
      this.costChart.plotCost(param, cost);
  }
  componentDidMount(){
    this.updateMath();
  }
  render() {
    return(<div>
      <h1>Hypothesis & Cost Functions</h1>
      <div>
        <div className="column left">
          <h2>Hypothesis</h2>
          <p>In general, a hypothesis function has the following form:</p>
          <div className="equation-block" id="hypothesisEquation"></div>
          <p>Hypothesis function strives to reliably map inputs to outputs.
            Since none of the hypothesis functions are likely to be <em>perfect</em>, there needs to be a means
            of evaluating the accuracy of a hypothesis. That&apos;s where a <strong>cost function</strong> comes in.</p>
          <p><em>(Since the visualization of the cost associated with a hypothesis dependent on two parameters is much less
            straightforward than that with a single parameter, let's suppose that <strong>&theta;<sub>0</sub> = 0</strong>.)</em></p>
        </div>
        <div className="column right">
          <h2>Cost Function</h2>
          <p>As mentioned before, a cost function measures the accuracy of a hypothesis.
            It's no dragon magic, it quite simply calculates a fancier version of an average of differences
            between known outputs and results predicted by our hypothesis function.</p>
          <div className="equation-block" id="costEquation"></div>
          <p>The lower the better, naturally. Which means that suddenly, our previously elusive search for the best
            possible hypothesis function has been transformed into a much more easily definable
            task: <strong>finding the minimum of the cost function</strong>. Once we have identified that point,
            it is guaranteed to correspond to the optimal hypothesis (for the given function type, of course).</p>
        </div>

        <div>
          <div className="column left">
            <ValueChart plotCost={this.plotCost.bind(this)} />
          </div>
          <div className="column right">
            <CostChart ref={ref => this.costChart = ref} />
          </div>
        </div>
      </div>
    </div>)
  }
  updateMath(){
    katex.render(equations.hypothesis, document.getElementById("hypothesisEquation"));
    katex.render(equations.cost, document.getElementById("costEquation"));
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
      }
    };

    this.drawFunction = d3.svg.line()
      .interpolate('basis')
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
    if(value.toString() !== float.toString()){
      this.setState({params:{b: value}});
    }
    //real number, update the graph
    else {
      this.setState({params:{b: float}}, () => {
        this.draw(false);
      });
    }
  }
  render() {
    return(<div>
      <div className="chart-container">
        <svg className="chart"></svg>
      </div>

      <div className="controls">
        <div className="control-group">
          <label>Parameter &theta;<sub>1</sub>: </label>
          <input type="number" step="0.01" value={this.state.params.b} onChange={this.handleParamChange.bind(this)} />
        </div>

      <div className="controls-buttons">
        <button className="button-green" onClick={this.draw.bind(this)}>Rescale</button>
        <button className="button-green" onClick={this.plotCost.bind(this)}>Plot Cost</button>
      </div>
    </div>
    </div>)
  }
  //get the cost of the current hypothesis
  getCost(){
    return this.data.reduce((res, v) => res + Math.pow(this.computeFuncValue(v.size) - v.price, 2), 0);
  }
  //call the function on the parent to get the cost plotted
  plotCost(){
    this.props.plotCost(this.state.params.b, this.getCost());
  }
  //compute the function value for the given x
  computeFuncValue(x){
    return this.currentFunction.compute(x, [0, this.state.params.b]);
  }
  paint(){
    var plotter = this.plotter = new Plotter();
    this.chart = plotter.chart;

    //intitialize the line for the function to be drawn
    this.chart.append('path').attr("class", 'line function');

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

    //load the data
    d3.csv("data/data.csv", v => {
      //`cast` the values to numbers
      v.size = +v.size;
      v.price = +v.price;
      return v;
    }, (error, data) => {
      this.data = data;
      //make sure the function curve stretches a bit further than the points
      this.xRange = _.range(0, d3.max(this.data, d => d.size) + 10, 10);

      this.draw();
    });
  }
  //draw the plot
  draw(rescale) {
    //rescale the axes unless told otherwise & plot the graph
    if(rescale !== false) this.rescale();
    this.plotter.drawAxes();

    //draw the selected function
    this.chart.select('.line.function').attr("d", this.drawFunction(this.xRange));

    //plot the values
    var setPoints = points => points
      .attr('cx', v => this.plotter.x(v.size))
      .attr('cy', v => this.plotter.y(v.price))
    var points = setPoints(this.chart.selectAll('.point.value').data(this.data));
    setPoints(points.enter().append('circle').attr('class', 'point value').attr('r', 4));

    //plot the distances (=cost) between the known and hypothesized values
    var setDistances = distances => distances
        .attr('x1', v => this.plotter.x(v.size))
        .attr('y1', v => this.plotter.y(v.price))
        .attr('x2', v => this.plotter.x(v.size))
        .attr('y2', v => this.plotter.y(this.computeFuncValue(v.size)));

    var distances = setDistances(this.chart.selectAll('.line.distance').data(this.data));
    setDistances(distances.enter().append('line').attr('class', 'line distance'));
  }
  //rescale the plotter (y maximum can be either price or function value)
  rescale(){
    var xMax = d3.max(this.data, d => d.size);
    this.plotter.rescale(0, xMax, 0, Math.max(
      d3.max(this.data, v => v.price),
      this.computeFuncValue(xMax)
    ));
  }
}

/**
 * Cost-plotting chart.
 *
 * Plot a point by calling the `plotCost()` function.
 */

class CostChart extends React.Component{
  constructor(props){
    super(props);
    this.data = [];
  }
  render(){
    return <div>
      <div className="chart-container">
        <svg className="chart-cost"></svg>
      </div>
    </div>;
  }
  componentDidMount(){
    this.plotter = new Plotter({
      selector: '.chart-cost'
    });
    this.draw();
  }
  //plot a point representing the cost for the given parameter value
  plotCost(param, cost){
    this.data.push([param, cost]);
    this.draw();
  }
  //draw the plotter
  draw(){
    //rescale the plotter
    this.plotter.rescale(0, d3.max(this.data, d => d[0]), 0, d3.max(this.data, d => d[1]));

    //draw the axes
    this.plotter.drawAxes();

    //plot the points (create new ones as neccessary)
    var setPointPosition = points => points
      .attr('cx', v => this.plotter.x(v[0]))
      .attr('cy', v => this.plotter.y(v[1]))
      .on('mouseover', v => {
        this.plotter.drawHelpers(v[0], v[1]);
      }).on('mouseout', v => {
        this.plotter.hideHelpers();
      });

    var points = setPointPosition(this.plotter.chart.selectAll('.cost.point').data(this.data));
    setPointPosition(points.enter().append('circle').attr('class', 'cost point').attr('r', 6));
  }
}
