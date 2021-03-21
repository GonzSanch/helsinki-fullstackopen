import React, { useState } from 'react'

const Button = ({handleClick, text}) => (
    <button onClick={handleClick}>
        {text}
    </button>
)

const Feedback = ({ feedback }) => (
    <div>
        <h1>give feedback</h1>
        <Button handleClick={feedback.good.handleClick} text={feedback.good.text}/>
        <Button handleClick={feedback.neutral.handleClick} text={feedback.neutral.text}/>
        <Button handleClick={feedback.bad.handleClick} text={feedback.bad.text}/>
    </div>
    )

const Statistics = ({ statistics }) => {
    let good = statistics.good;
    let neutral = statistics.neutral;
    let bad = statistics.bad;
    return (
        <div>
            <h1>statistics</h1>
            <p>
                good: {good} <br></br>
                neutral: {neutral} <br></br>
                bad: {bad} <br></br>
                total: {good + neutral + bad}<br></br>
            </p>
        </div>
    )
}

const App = () => {
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)
    const feedback = {
        button: {
            good: {
                handleClick: () => setGood(good + 1),
                text: 'good'
            },
            neutral: {
                handleClick: () => setNeutral(neutral + 1),
                text: 'neutral'
            },
            bad: {
                handleClick: () => setBad(bad + 1),
                text: 'bad'
            }
        },
        statistics: {
            good: good,
            neutral: neutral,
            bad: bad
        }
    }

    return (
        <div>
            <Feedback feedback={feedback.button} />
            <Statistics statistics={feedback.statistics} />
        </div>
    )
}

export default App