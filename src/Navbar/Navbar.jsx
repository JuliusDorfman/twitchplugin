import React from 'react';
import './Navbar.sass';



export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        pageRender: 'home'
      }

  }


  render() {
    return(
      <div id="navbar-component">
        <div className="navbar-wrapper">
          <ul className="navbar-links">
            <li>Home</li>
            <li>Trending</li>
            <li></li>
            <li></li>
          </ul>
        </div>
      </div>
    )
  }

}