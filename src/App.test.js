import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the App component', () => {
    console.log(REACT_APP_BASE_URL)
    render(<App />)
    
    screen.debug(); // prints out the jsx in the App component unto the command line
  })
})