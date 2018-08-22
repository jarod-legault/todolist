import React, { Component } from 'react';
import './Register.css';

class Forgot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      confirmedEmail: ''
    };
  }
  
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  
  handleSubmit = e => {
    e.preventDefault();
    this.props.onResetRequest(this.state.email, this.state.confirmedEmail);
  }
  
  render() {
    const { email, confirmedEmail } = this.state;
    return(
      <form onSubmit={this.handleSubmit}>
        <h2>Password Reset</h2>
          
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">Email</span>
            </div>
            <input
              type="email"
              className="form-control"
              aria-label="email"
              aria-describedby="basic-addon1"
              id='email'
              name='email'
              onChange={this.handleChange}
              value={email}
            />
          </div>
          
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">Confirm email</span>
            </div>
            <input
              type="email"
              className="form-control"
              aria-label="confirmedEmail"
              aria-describedby="basic-addon1"
              id='confirmedEmail'
              name='confirmedEmail'
              onChange={this.handleChange}
              value={confirmedEmail}
            />
          </div>
        
        <button
          type='submit'
          className='btn btn-primary btn-block btn-lg'
          onSubmit={this.handleSubmit}
        >
          Reset my password
        </button>
      </form>
    );
  }
}

export default Forgot;