import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import LoginForm from './LoginForm';
import './Navbar.css';

class Navbar extends Component {
  render(){
    const { currentUser, onLogout, onAuth } = this.props;
    return(
      <nav className='navbar'>
        <div className='navbar-left'>
          { currentUser.isLoggedIn && 
            <button
              className='btn btn-primary btn-block btn-sm btn-nav'
              id='nav-my-lists-button'
              onClick={() => this.props.history.push(`/${currentUser.username}/mylists`)}
            >
              My Lists
            </button>
          }
        </div>
        <div className='navbar-center'>
          <header>
            <h1>todo<span>list</span></h1>
          </header>
        </div>
        <div className='navbar-right'>
          { currentUser.isLoggedIn && 
            <div className='logged-in-msg'>
              <div className='logged-in-as-text'>Logged in as {currentUser.username}</div>
              <button
                className='btn btn-primary btn-block btn-sm btn-nav'
                id='nav-logout-button'
                onClick={onLogout}
              >
                Log out
              </button>
            </div>
          }
          { !currentUser.isLoggedIn &&
            <LoginForm
            onAuth={onAuth}
          />
          }
        </div>
      </nav>
    );
  }
}

export default withRouter(Navbar);