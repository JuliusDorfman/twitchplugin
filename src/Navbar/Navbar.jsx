import React from 'react';
import './Navbar.sass';
import chatting from '../Assets/chatting.gif'
export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        currentPage: 'home',
        pageRerender: false,
        searchInput: '',
        searchSubmit: '',
      }
      // this.handleEnter = this.handleEnter.bind(this)
  }

  handleSearchInput = (e) => {
    e.preventDefault();
    // todo on keydown dont accept special characters
    let searchInput = e.target.value.replace(/[^a-zA-Z0-9]/gi, '')
    this.setState({searchInput: searchInput}, ()=> {
      
    })
  }

  handler = (e) => {
    e.preventDefault();
  }


  handleSubmit = (e) => {
    if (this.state.searchInput === '') {
      return null;
    }
    this.setState({searchSubmit: this.state.searchInput.toLowerCase()}, () => {
      this.setState({searchInput: ''});
      this.props.passStreamerName({searchSubmit: this.state.searchSubmit});
    });
  }

  handleEnter = (e) =>{
    if (e.keyCode === 13) {
      this.handleSubmit(e);
    }
  }




  render() {
    const navWrapper = this.props.navWrapper;
    let bgmShift = this.props.bgmShift;
    return(
      <div id="navbar-component" className={`navbar-component-${bgmShift}`}>
        
        <div className="navbar-wrapper">
          <ul className="navbar-links">
            <li id="home-button"></li>
            <li>
              <form id="search-form" onSubmit={this.handler}>
                <label>Search: </label>                
                <input id="search-input" type="text" className="search" 
                  name="search" value={this.state.searchInput} 
                  onChange={this.handleSearchInput} onKeyDown={(e) => this.handleEnter(e)} placeholder='e.g. xQc, pokimane...' 
                  autoComplete='off' />
                <div id="search-submit" onClick={this.handleSubmit}>Submit</div>
              </form>
            </li>
            <li></li>
          </ul>
          {/* <div id={`display-${navWrapper}`} className={`nav-title-wrapper`}>
            <h1 className="nav-title"><span className="italicized">Art of Twitch Chat</span></h1>
          </div> */}
          {/* <img className="nav-pepe"src={chatting} alt="pepe-typing" /> */}
          {/* <p className="sub-header">Art Generated by the chat contributions of your peers!</p> */}
        </div>
      </div>
    )
  }

}