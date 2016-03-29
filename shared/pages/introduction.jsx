import Markdown from 'react-remarkable';
import React from 'react';

/**
 * Introduction page. Text only.
 */

export default class Introduction extends React.Component {
  render() {
    return(<div>
      <h1>Basics mathematical principles behind machine learning</h1>

      <p>
        This is a short visualization demo of the most basic mathematical
        principles behind machine learning. I wrote it tu support my 15-minute
        talk during a <em>competence day</em> at <a href="http://jayway.com" target="_blank">Jayway</a> in March, 2016.
        While it&apos;s not the most organised demo in the world, not to mention it&apos;s not even close to being responsive or anything
        like that, it fulfills its purpose:
        it <strong>visualizes cost function</strong> and <strong>gradient descent</strong> principles.
      </p>

      <p>
        It&apos;s written in <a href="http://isomorphic.net" target="_blank">isomorphic</a> <a href="https://facebook.github.io/react/" target="_blank">React</a>. I wanted
        to give that a try and I am fairly happy with
        the setup and results. I wrote the visualization itself in pure <a href="https://d3js.org/" target="_blank">d3</a> which
        was fun since I had never used the library before. It&apos;s pretty awesome.
      </p>
    </div>)
  }
}
