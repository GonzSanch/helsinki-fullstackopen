import React from 'react';
import ReactDOM from 'react-dom';

const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}

const Content = (props) => {
  const elements = []
  props.part.forEach(part => {
    var pos = props.part.indexOf(part)
    elements.push(<p>{part} {props.exercises[pos]}</p>)
  })
  return (
  <>
    {elements}
  </>
  )
}

const Total = (props) => {
  var total = 0;
  for (var i in props.exercises) {
    total += props.exercises[i]
  }
  return (
    <p> Number of exercises {total}</p>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header course={course}/>
      <Content part={[part1, part2, part3]} exercises={[exercises1, exercises2, exercises3]} />
      <Total exercises={[exercises1, exercises2, exercises3]} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))