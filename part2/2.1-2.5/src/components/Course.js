import React from 'react'

const Part = ({ part }) => (
    <p>{part.name} {part.exercises}</p>
)

const Header = ({ course }) => (
    <h1>{course}</h1>
  )
  
  const Content = ({ parts }) => (
  <>
    {parts.map(part =>
      <Part key={part.id} part={part} />
      )}
  </>
  )

const Total = ({ parts }) => (
    <b> total of exercises {parts.reduce((sum, part) => sum + part.exercises, 0)}</b>
  )

const Course = ( { course }) => (
  <div>
    <Header course={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>
)
 export default Course