import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { Redirect } from 'react-router';
import Homepage from './Homepage';
import Register from './Register';
import TodoLists from './TodoLists';
import TodoList from './TodoList';
import './Main.css';

const Main = props => {
  const { onAuth, currentUser, onError, onClearError } = props;
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