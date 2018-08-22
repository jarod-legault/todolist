import React, { Component } from 'react';
import './App.css';
import { withRouter } from 'react-router-dom';
import Navbar from './Navbar';
import Main from './Main';
import * as apiCalls from './api';

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      currentUser: {
        isLoggedIn: null,
        username: '',
        id: '',
        token: ''
      },
      error: null
    };
    this.authUser = this.authUser.bind(this);
    this.logout = this.logout.bind(this);
    this.addError = this.addError.bind(this);
    this.clearError = this.clearError.bind(this);
    this.resetRequest = this.resetRequest.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
  }
  
  componentDidMount() {
    this.props.history.listen(() => {
    	this.clearError();
    });
    const userData = JSON.parse(localStorage.getItem('currentUser') || JSON.stringify({token: ''}));
    if(userData.token === '') {
      apiCalls.setTokenHeader(false);
      this.setState({
        currentUser: {
          isLoggedIn: false,
          username: '',
          id: '',
          token: ''
        }
      });
    } else {
      apiCalls.setTokenHeader(userData.token);
      this.setState({
        currentUser: {
          isLoggedIn: true,
          username: userData.username,
          id: userData.id,
          token: userData.token
          // defaultTodoList: userData.defaultTodoList
        }
      });
    }
  }
  
  async authUser(authType, data) {
    try {
      const userData = await apiCalls.authUser(authType, data);
      apiCalls.setTokenHeader(userData.token);
      if(authType === 'signup') {
        var todoList = await apiCalls.createTodoList(userData.id, 'My first list');
        todoList.priorityList = [
          {
            name: 'High priority items from all your lists go here.',
            priority: true,
            completed: false
          }
        ];
        todoList.nonPriorityList = [
          {
            name: 'Low priority items go here.',
            priority: false,
            completed: false
          },
          {
            name: 'Use drag handle left of the star to reorder items in the list.',
            priority: false,
            completed: false
          },
          {
            name: 'Click the star to toggle the priority status of a task and click on the item text to mark it as complete.',
            priority: false,
            completed: false
          }
        ];
        todoList.completedList = [
          {
            name: 'Completed items for this list go here.',
            priority: false,
            completed: true
          },
          {
            name: 'Click on the item text to mark it as not complete.',
            priority: false,
            completed: true
          }
        ];
        await apiCalls.updateTodoList(userData.id, todoList._id, todoList);
        // await apiCalls.editUser(userData.id, {defaultTodoList: todoList._id});
        // userData.defaultTodoList = todoList._id;
      }
      localStorage.setItem('currentUser', JSON.stringify(userData));
      this.setState({
        currentUser: {
          isLoggedIn: true,
          username: userData.username,
          id: userData.id,
          token: userData.token
          // defaultTodoList: userData.defaultTodoList
        },
        error: null
      });
      this.props.history.push(`/${this.state.currentUser.usernam}/mylists`);
    } catch(err) {
      console.log('Error authorizing user (/app.js/authUser): ');
      console.log(`error status: ${err.status}`);
      console.log(`error message: ${err.message}`);
      this.addError(err);
      // this.props.history.push('/');
    }
  }
  
  logout() {
    localStorage.setItem('currentUser', '');
    apiCalls.setTokenHeader(false);
    this.setState({
      currentUser: {
        isLoggedIn: false,
        username: '',
        id: '',
        token: ''
        // defaultTodoList: ''
      }
    });
      this.props.history.push('/signup');
  }

  async resetRequest(email, confirmedEmail) {
    try{
      await apiCalls.requestReset(email, confirmedEmail);
      this.props.history.push('/resetRequestSent');
    } catch(err) {
      console.log('Error in password reset request (/app.js/resetRequest): ');
      console.log(`error status: ${err.status}`);
      console.log(`error message: ${err.message}`);
      this.addError(err);
    }
  }

  async resetPassword(password, confirmedPassword, pwScore, token) {
    try{
      let userData = await apiCalls.resetPassword(password, confirmedPassword, pwScore, token);
      apiCalls.setTokenHeader(userData.token);localStorage.setItem('currentUser', JSON.stringify(userData));
      this.setState({
        currentUser: {
          isLoggedIn: true,
          username: userData.username,
          id: userData.id,
          token: userData.token
          // defaultTodoList: userData.defaultTodoList
        },
        error: null
      });
      this.props.history.push('/');
    } catch(err) {
      console.log('Error in password reset (/app.js/resetPassword): ');
      console.log(`error status: ${err.status}`);
      console.log(`error message: ${err.message}`);
      this.addError(err);
    }
  }
  
  addError(err) {
    this.setState({
      error: err
    });
  }
  
  clearError(err) {
    this.setState({
      error: null
    });
  }

  render() {
    if(this.state.currentUser.isLoggedIn === null) {
      return(<div></div>);
    } else {
      return (
        <div className='onboarding'>
          <Navbar
            currentUser={this.state.currentUser}
            onLogout={this.logout}
            onAuth={this.authUser}
          />
          
          <div className='container'>
            {this.state.error && 
              <div className='alert alert-danger'>{this.state.error.message}</div>
            }
            
            <Main
              currentUser={this.state.currentUser}
              onAuth={this.authUser}
              onError={this.addError}
              onClearError={this.clearError}
              onResetRequest={this.resetRequest}
              onResetSubmit={this.resetPassword}
            />
          </div>
        </div>
      );
    }
  }
}

export default withRouter(App);
