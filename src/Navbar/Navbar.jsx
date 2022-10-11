import React from 'react';
import './Navbar.sass';

import axios from 'axios';
const api = axios.create({
  baseURL: `http://localhost:7000/` || process.env.PORT
});
export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        pageRerender: false,
        searchInput: '',
        searchSubmit: ''
      }
  }

  handleSearchInput = (e) => {
    e.preventDefault();
    // todo on keydown dont accept special characters
    let searchInput = e.target.value.replace(/[^a-zA-Z0-9]/gi, '')
    this.setState({searchInput: searchInput}, ()=> {
      
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({searchSubmit: this.state.searchInput.toLowerCase()}, () => {
      console.log("searchSubmit State: ", this.state.searchSubmit);
      this.setState({searchInput: ''})
    });
  }

  handleGetTopGames = (e) => {
    e.preventDefault();
    api.get('/getTopGames').then(res => {
        console.log('HandleTopGames', res)
        let games = [];
        for (let i = 0; i < res.data.Message.length; i++) {
            games.push(res.data.Message[i].name)
        }
        this.setState({games: [...games]});
    }).catch((exception) => {
        console.log(exception);
    })
}    

handler = (e) => {
  e.preventDefault();
}

  render() {
    
    return(
      <div id="navbar-component">
        <div className="navbar-wrapper">
          <ul className="navbar-links">
            <li id="home-button" onClick={((e) => {
              this.props.handleDummyFunction(e)
              this.handleGetTopGames(e)
            })}>Home</li>
            <li>
              <form id="search-form" onSubmit={this.handler}>
                <label>Search: </label>                
                <input id="search-input" type="text" className="search" 
                  name="search" value={this.state.searchInput} 
                  onChange={this.handleSearchInput} placeholder='e.g. xQc, pokimane, non-case-sensative' 
                  autoComplete='off'/>
                <div id="search-submit" onClick={(e)=>{this.handleSubmit(e)}}>Submit</div>
              </form>
            </li>
            <li></li>
          </ul>
        </div>
      </div>
    )
  }

}