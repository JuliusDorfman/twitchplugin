import logo from './logo.svg';
import './App.css';
import Navbar from './Navbar';
import React from 'react';

class App extends React.Component  {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Navbar />
   
        </header>
      </div>
    );
  }
}

export default App;
