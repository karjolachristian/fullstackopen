import { useState } from 'react'

const Statistics = ({good,neutral,bad}) => {
    const sum = good + neutral + bad
    if (sum === 0){
      return (
        <div>
          <p>No feedback given</p>
        </div>
      )
    } 
    return (
      <table>
        <tbody>
          <StatisticLine text='good' value={good} />
          <StatisticLine text='neutral' value={neutral} />
          <StatisticLine text='bad' value={bad} />
          <StatisticLine text='all' value={sum} />
          <StatisticLine text='average' value={((good * 1 + neutral * 0 + bad * (-1))/sum).toFixed(2)} />
          <StatisticLine text='positive' value={`${(parseFloat(good / sum) * 100).toFixed(2) } %`}/>
        </tbody>
      </table>
    )
}

const StatisticLine = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td> 
      <td>{value}</td>
    </tr>
  )
}

const Button = ({handleClick, text}) => {
  return (
    <>
      <button onClick={handleClick} >{text}</button>
    </>
  )
}


const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  return (
    <>
        <h1>give feedback</h1>
        <Button handleClick={() => setGood(x => x + 1)} text='good'/>
        <Button handleClick={() => setNeutral(x => x +1)} text='neutral'/>
        <Button handleClick={() => setBad(x => x + 1)} text='bad'/>
        <h1>statistics</h1>
        <Statistics good={good} neutral={neutral} bad={bad} />
    </>
  )
}

export default App
