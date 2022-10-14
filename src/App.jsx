import './App.sass';
import React from 'react';
import Navbar from './Navbar';
import Instructions from './Components/Instructions';
import Streams from './Streams';

 
class App extends React.Component  {
  constructor(props) {
    super(props);
    this.state = {
      pageRerender: false,
      currentPage: 'home',
      streamerName: '',
      getHome: false
    }
  }

  // dummyFunction = (props) => {
  //   console.log("Dummy Function in App.jsx called from NavbarComponent Props: ", this.props);
  // }

  passStreamerName = (props) => {
    this.setState({streamerName: props.searchSubmit});
    // The Streams component passes down this.state.streamerName 
    // The Streams commponent on componentDidUpdate compares the prevProps
    // with the new props and triggers api.post(/getStreamerChannel)
  }

  passGetTopGames = (currentPage) => {
    this.setState({getHome: true})
  }
  
  // NEVER DO THIS AGAIN
  // handleSetHome =() =>{
  //   this.setState({getHome: false})
  // }

  render() {
    return (
      <div className="App">
        <Instructions />
        <header className="App-header">
          <Navbar searchSubmit={this.state.searchInput} pageRerender={this.state.pageRerender} 
            handleDummyFunction={this.dummyFunction} passStreamerName={this.passStreamerName} passGetTopGames={this.passGetTopGames}/>
          <h1>State of Twitch</h1>
        </header>
        <main>
          <Streams streamername={this.state.streamerName} getHome={[this.state.getHome, this.state.currentPage]} />
          {/* <Streams streamername={this.state.streamerName} getHome={[this.state.getHome, this.state.currentPage]} setHome={this.handleSetHome()}/> */}
        </main>
      </div>
    );
  }
}

export default App;
