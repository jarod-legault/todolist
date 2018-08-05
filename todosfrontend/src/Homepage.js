import React from 'react';
import TodoList from './TodoList';
import { Redirect } from 'react-router';
import './Homepage.css';

const Homepage = props => {
  const { currentUser, updateDefaultList, onError, onClearError } = props;
  if(!currentUser.isLoggedIn) {
    return <Redirect to={`/signup`} />;
  } else {
  
    return(
      <div className='home-hero'>
        { currentUser.isLoggedIn && (
            <TodoList 
              currentUser={currentUser}
              updateDefaultList={updateDefaultList}
              onError={onError}
              onClearError={onClearError}
              listId={currentUser.defaultTodoList}
            />
        )}
      </div>
    );
  }
};

export default Homepage;