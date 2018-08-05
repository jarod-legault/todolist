import React, { Component } from 'react';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      confirmedEmail: '',
      username: '',
      emailOrUsername: '',
      password: '',
      confirmedPassword: ''
    };
  }
  
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  
  handleSubmit = e => {
    e.preventDefault();
    this.props.onAuth('signup', this.state);
  }
  
  render() {
    const { email, confirmedEmail, username, password, confirmedPassword } = this.state;
    return(
      <form onSubmit={this.handleSubmit}>
        <h2>Register for a todolist account.</h2>
          
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">Username</span>
            </div>
            <input
              type="text"
              autoFocus
              className="form-control"
              aria-label="username"
              aria-describedby="basic-addon1"
              id='username'
              name='username'
              onChange={this.handleChange}
              value={username}
            />
          </div>
          
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
            // pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{7,10}"
          />
          <span>7-10 characters: one uppercase, one lowercase, one number, one special character, no spaces</span>
        </div>
        
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
            // pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{7,10}"
          />
        </div>
        <button
          type='submit'
          className='btn btn-primary btn-block btn-lg'
          onSubmit={this.handleSubmit}
        >
          Sign me up!
        </button>
      </form>
    );
  }
}

export default Register;