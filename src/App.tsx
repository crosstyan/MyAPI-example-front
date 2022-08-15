import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import * as signalR from "@microsoft/signalr"

const url = "http://localhost:5269/signal"

const connection = new signalR.HubConnectionBuilder()
    .withUrl(url)
    .build();

function App() {
  const [count, setCount] = useState(0)
  const [userId, _setUserId] = useState(Math.floor(Math.random() * 1000))
  useEffect(()=>{
    if (connection.state == signalR.HubConnectionState.Disconnected) {
      connection.start()
    }
    // use small camal case for methodName
    connection.on("receiveMessage", 
    (user: string, msg: string)=>{
      console.log(user, msg)
    })
    return ()=>{
      connection.off("receiveMessage")
    }
  }, [])

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={() => {
          setCount((c) => c + 1)
          // use small camal case for methodName
          connection.send("sendToAll", `vitejs ${userId}`, `hello ${count}`)
        }}>
          send message
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
