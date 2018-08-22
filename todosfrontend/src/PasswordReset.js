import React, { Component } from 'react';
import './Register.css';
var evaluate = require('zxcvbn');

class PasswordReset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      confirmedPassword: '',
      evResult: {}
    };
  }
  
  handleChange = e => {
    if(e.target.name === 'password') {
      const evResult = evaluate(e.target.value);
      this.setState({
        [e.target.name]: e.target.value,
        evResult
      });
    } else {
      this.setState({
        [e.target.name]: e.target.value
      });
    }
  }
  
  handleSubmit = e => {
    e.preventDefault();
    this.props.onResetSubmit(
      this.state.password,
      this.state.confirmedPassword,
      this.state.evResult.score,
      this.props.match.params.token
    );
  }
  
  render() {
    const { password, confirmedPassword, evResult } = this.state;
    const strengthText = {
      0: 'weak',
      1: 'weak',
      2: 'ok',
      3: 'good',
      4: 'strong'
    }
    var strengthMessage;
    var suggestions = '';
    if(evResult.feedback && evResult.feedback.warning){
      suggestions = evResult.feedback.warning +'. ';
    }
    if(evResult.feedback && evResult.feedback.suggestions){
      for(let i = 0; i < evResult.feedback.suggestions.length; i++) {
        suggestions += evResult.feedback.suggestions[i] +' ';
      }
    }
    if(password !== '') {
      strengthMessage = (
        <div>
          <p>Password strength: {strengthText[evResult.score]}</p>
          {(evResult.feedback.warning || evResult.feedback.suggestions) &&
            <p>{suggestions}</p>              
          }
        </div>
      )
    } else {
      strengthMessage = null;
    }
    return(
      <form onSubmit={this.handleSubmit}>
        <h2>Reset your password.</h2>
        
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text">Password</span>
          </div>
          <input
            type="password"
            className="form-control"
            aria-label="password"
            aria-describedby="basic-addon1"
            id='password'
            name='password'
            onChange={this.handleChange}
            value={password}
            required
          />
        </div>
        <div id={`strength-bar${evResult.score}`}></div>
        {strengthMessage}
        
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text">Confirm password</span>
          </div>
          <input
            type="password"
            className="form-control"
            aria-label="confirmedPassword"
            aria-describedby="basic-addon1"
            id='confirmedPassword'
            name='confirmedPassword'
            onChange={this.handleChange}
            value={confirmedPassword}
            required
          />
        </div>
        <button
          type='submit'
          className='btn btn-primary btn-block btn-lg'
          onSubmit={this.handleSubmit}
        >
          Change my password
        </button>
      </form>
    );
  }
}

export default PasswordReset;