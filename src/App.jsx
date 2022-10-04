// import logo from './logo.svg';
import './App.sass';
import Navbar from './Navbar';
import React from 'react';
import Streams from './Streams';


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
          <div>State of Twitch</div>
        </header>
        <main>
          <Streams />
        </main>
      </div>
    );
  }
}

export default App;
