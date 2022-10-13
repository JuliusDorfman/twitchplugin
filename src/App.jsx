// import logo from './logo.svg';
import './App.sass';
import Navbar from './Navbar';
import React from 'react';
import Streams from './Streams';


class App extends React.Component  {
  constructor(props) {
    super(props);
    this.state = {
      pageRerender: false,      
      searchInput: this.props.searchInput
    }
  }

  dummyFunction = (e) => {
    console.log("Dummy Function in App.jsx called from NavbarComponent Props: ", this.props);
  }

  render() {
    return (
      <div className="App">

        <header className="App-header">
          <Navbar searchSubmit={this.state.searchInput} pageRerender={this.state.pageRerender} handleDummyFunction={this.dummyFunction}/>
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
