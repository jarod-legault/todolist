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
            name: 'High priority items go here',
            priority: true,
            completed: false
          },
          {
            name: 'Click on an item to mark it as complete',
            priority: true,
            completed: false
          }
        ];
        todoList.nonPriorityList = [
          {
            name: 'Low priority items go here',
            priority: false,
            completed: false
          },
          {
            name: 'Drag items to reorder them in the list',
            priority: false,
            completed: false
          },
          {
            name: 'Click the star to toggle the priority status of a task',
            priority: false,
            completed: false
          },
        ];
        todoList.completedList = [
          {
            name: 'Completed items go here',
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
            />
          </div>
        </div>
      );
    }
  }
}

export default withRouter(App);
