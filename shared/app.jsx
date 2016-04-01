import React from 'react';
import {Link, IndexLink} from 'react-router';

/**
 * Main class of the app.
 */

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }
  //render the component
  render() {
    return (
      <div>
        <div className="page">
            <div className="pane-left">
              <h2><i className="fa fa-magic"></i>Basic mathematics behind machine learning</h2>
              <nav>
                <ul role="nav">
                  <li><IndexLink activeClassName="active" to="/">Introduction</IndexLink></li>
                  <li><Link activeClassName="active" to="/derivative">Derivative</Link></li>
                  <li><Link activeClassName="active" to="/cost-function">Cost Function</Link></li>
                  <li><Link activeClassName="active" to="/gradient-descent">Gradient Descent</Link></li>
                </ul>
              </nav>

              <footer>
                <p>Created by <a href="mailto:tadeaspetak@gmail.com">Tadeáš Peták</a> as a demo for a short competence
                  day talk at <a href="http://jayway.com" target="_bank">Jayway</a> in March 2016.</p>

                <p><i className="fa fa-github"></i> Check out the source on <a href="https://github.com/tadeaspetak/machine-learning-maths" target="_blank">GitHub</a>.</p>
              </footer>
            </div>
          <main><div className="content-wrapper">{this.props.children}</div></main>
        </div>

      </div>
    )
  }
}
