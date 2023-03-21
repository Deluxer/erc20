import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Metamask } from './components/Metamask'

function App() {
  const [count, setCount] = useState(0)




  return (
    <div className="App">
      <Metamask/>
    </div>
  )
}

export default App
