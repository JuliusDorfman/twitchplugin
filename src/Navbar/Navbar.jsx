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
        currentPage: 'home',
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

  handler = (e) => {
    e.preventDefault();
  }


  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.searchInput === '') {
      return null;
    }
    this.setState({searchSubmit: this.state.searchInput.toLowerCase()}, () => {
      this.setState({searchInput: ''});
      this.props.passStreamerName({searchSubmit: this.state.searchSubmit});
    });
  }


  render() {
    
    return(
      <div id="navbar-component">
        <div className="navbar-wrapper">
          <ul className="navbar-links">
            <li id="home-button"></li>
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