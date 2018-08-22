import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { Redirect } from 'react-router';
import Register from './Register';
import TodoLists from './TodoLists';
import TodoList from './TodoList';
import Forgot from './Forgot';
import PasswordReset from './PasswordReset';
import './Main.css';

const Main = props => {
  const { onAuth, currentUser, onError, onClearError, onResetRequest, onResetSubmit } = props;
  return(
    <div>
      <Switch>
        <Route exact path='/' render={() => (
          currentUser.isLoggedIn ? (
            <Redirect to={`/${currentUser.username}/mylists`} />
          ) : (
            <Redirect to={`/signup`} />
          )
        )}/>
        <Route exact path='/signup' render={props => {
          return(
            <Register
              onAuth={onAuth}
              {...props}
            />
          );
        }}/>
        <Route exact path='/forgot' render={props => {
          return(
            <Forgot
              onResetRequest={onResetRequest}
              {...props}
            />
          );
        }}/>
        <Route exact path='/resetRequestSent' render={props => {
          return(
            <h4>An email has been sent to the address provided. Please follow the instructions in the email to complete the password reset.</h4>
          );
        }}/>
        <Route exact path='/reset/:token' render={props => {
          return(
            <PasswordReset
              onResetSubmit={onResetSubmit}
              {...props}
            />
          );
        }}/>
        <Route exact path='/:username/mylists' render={props => {
          return(
            <TodoLists
              {...props}
              currentUser={currentUser}
              onError={onError}
              onClearError={onClearError}
            />
          );
        }}/>
        <Route exact path='/:username/mylists/:listId' render={props => {
          return(
            <TodoList
              {...props}
              currentUser={currentUser}
              onError={onError}
              onClearError={onClearError}
            />
          );
        }}/>
      </Switch>
    </div>
  );
};

export default withRouter(Main);