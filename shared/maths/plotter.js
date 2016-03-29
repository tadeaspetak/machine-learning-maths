import _ from 'lodash';
import d3 from 'd3';

/**
 * Base class implementing the fundametal functionality
 * needed in order to plot a chart.
 */

export default class Plotter {
  constructor(properties) {
    var props = this.props = _.defaults({}, properties, {
      margin: {
        top: 30,
        right: 20,
        bottom: 30,
        left: 100
      },
      selector: '.chart'
    });

    // set the dimensions of the canvas / graph
    var margin = this.margin = props.margin;
    var width = this.width = 500 - margin.left - margin.right;
    var height = this.height = 500 - margin.top - margin.bottom;

    // set the ranges appropriately
    var x = this.x = d3.scale.linear().range([0, width]);
    var y = this.y = d3.scale.linear().range([height, 0]);

    // define the axes
    var xAxis = this.xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(5);
    var yAxis = this.yAxis = d3.svg.axis().scale(y).orient("left").ticks(5);

    // initialize the SVG object
    this.initialize();
  }
  /**
   * Draw the x and y axes.
   */
  drawAxes(){
    // add the x-axis
    this.chart.select('.x.axis').call(this.xAxis);

    // add the y-axis
    this.chart.select('.y.axis').call(this.yAxis);
  }
  /**
   * Draw helpers for a specific point on the chart.
   */
  drawHelpers(ix, iy){
    var x = this.x(ix);
    var y = this.y(iy);

    //draw the lines
    this.chart.select('.line.helper.helper-x').attr('x1', x).attr('y1', this.y(0)).attr('x2', x).attr('y2', this.y(this.getMaxY()));
    this.chart.select('.line.helper.helper-y').attr('x1', this.x(0)).attr('y1', y).attr('x2', this.x(this.getMaxX())).attr('y2', y);

    //show the label
    this.chart.select('.helper.label').text(`[${ix.toFixed(2)}, ${iy.toFixed(2)}]`);
  }
  /**
   * Hide helpers for a specific point.
   */
  hideHelpers(){
    this.chart.select('.helper-x').attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', 0);
    this.chart.select('.helper-y').attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', 0);
    this.chart.select('.helper.label').text('');
  }
  /**
   * Initialize the SVG object.
   */
  initialize(){
    var canvas = this.canvas = d3.select(this.props.selector)
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom);

    var chart = this.chart = this.canvas.append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    chart.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0,${this.height})`);
    chart.append('g')
      .attr('class', 'y axis');

    //helpers
    chart.append('line').attr('class', 'line helper helper-x');
    chart.append('line').attr('class', 'line helper helper-y');
    chart.append('text').attr('class', 'helper label')
      .attr('x', this.margin.left + this.width - 140)
      .attr('y', this.margin.top + this.height - 40)
      .attr('font-family', 'sans-serif')
      .attr('font-size', '14px')
      .attr('text-anchor', 'middle');
  }
  /**
   * Rescale the plotter.
   */
  rescale(xMin, xMax, yMin, yMax){
    this.x.domain([xMin, xMax]);
    this.y.domain([yMin, yMax]);
  }
  /**
   * Get the maximum value of the x-asix.
   */
  getMaxX(){
    return this.x.domain()[1];
  }
  /**
   * Get the maximum value on the y-axis.
   */
  getMaxY(){
    return this.y.domain()[1];
  }
  /**
   * Get inverted values for the given coordinates.
   */
  getInverted(cx, cy){
    var ix = this.x.invert(cx - this.margin.left);
    var iy = this.y.invert(cy - this.margin.top);
    return [ix, iy];
  }
  /**
   * True if the given (inverted) values are in the range of the graph.
   */
  isInRange(ix, iy){
    return ix >= 0 && iy >= 0 && ix <= this.getMaxX() && iy <= this.getMaxY();
  }
}
