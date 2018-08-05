import React, { Component } from 'react';
import './LoginForm.css';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailOrUsername: '',
      password: ''
    };
  }
  
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  
  handleSubmit = e => {
    e.preventDefault();
    this.props.onAuth('signIn', this.state);
  }
  
  render() {
    const { emailOrUsername, password } = this.state;
    return(
      <form className='submit-form nav-form' onSubmit={this.handleSubmit}>
        
        <input
          type="text"
          className="form-control nav-input"
          placeholder='email or username'
          aria-label="emailOrUsername"
          aria-describedby="basic-addon1"
          id='emailOrUsername'
          name='emailOrUsername'
          onChange={this.handleChange}
          value={emailOrUsername}
        />
      
        <input
          type="password"
          className="form-control nav-input"
          placeholder='password'
          aria-label="navPassword"
          aria-describedby="basic-addon1"
          id='navPassword'
          name='password'
          onChange={this.handleChange}
          value={password}
        />
        
        <button
          type='submit'
          className='btn btn-primary btn-block btn-sm btn-nav'
          id='nav-login-button'
        >
          login
        </button>
      </form>
    );
  }
}

export default LoginForm;