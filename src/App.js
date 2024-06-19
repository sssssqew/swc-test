import React from 'react'
import './App.css'
import logo from './logo.svg'
import logo2 from './logo-2.png'

const car = {name: 'sun', year: 2016}
const newCar = {...car, year: 2031}
const App = () => {
    console.log(REACT_APP_BASE_URL)

    return (
        <div className='App'>
            <h1>Hello, react & esbuild ! </h1>
            <img src={logo} alt="logo" width={500} height={500}/>
            <img src={logo2} alt="logo-2"/>
        </div>
    )
}
export default App