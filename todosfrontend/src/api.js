import axios from 'axios';

export function setTokenHeader(token) {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
}

export async function authUser(authType, data) {
  const authUrl = '/api/auth/' + authType;
  return axios.post(authUrl, data)
  .then(response => {
    return response.data;
  })
  .catch(error => {
    // Error
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      // console.log('Axios response error:');
      // console.log(error.response);
      // console.log(error.response.data);
      // console.log(error.response.status);
      // console.log(error.response.headers);
      throw new Error(error.response.data.error.message);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      // console.log('Axios request error:');
      // console.log(error.request);
      throw new Error(error.request.data.error.message);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Axios error, neither request nor response');
      console.log('Error', error.message);
      throw new Error('Error authorizing user');
    }
    // console.log('Error.config:');
    // console.log(error.config);
    
    
    // console.log('Error.response in api.js/authUser(): ');
    // console.log(error.response);
    // console.log('Error response in api.js/authUser(): ');
    // console.log(error.response.data.error.message);
    // return error.response.data.error;
  });
}

export async function requestReset(email, confirmedEmail) {
  const authUrl = '/api/auth/forgot';
  return axios.post(authUrl, {email, confirmedEmail})
  .then(response => {
    return response.data;
  })
  .catch(error => {
    // Error
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(error.response.data.error.message);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      throw new Error(error.request.data.error.message);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Axios error, neither request nor response');
      console.log('Error', error.message);
      throw new Error('Error authorizing user');
    }
  });
}

export async function resetPassword(password, confirmedPassword, passwordScore, token) {
  const authUrl = `/api/auth/reset/${token}`;
  return axios.post(authUrl, {password, confirmedPassword, passwordScore, token})
  .then(response => {
    return response.data;
  })
  .catch(error => {
    // Error
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(error.response.data.error.message);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      throw new Error(error.request.data.error.message);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Axios error, neither request nor response');
      console.log('Error', error.message);
      throw new Error('Error authorizing user');
    }
  });
}

export async function editUser(userId, data) {
  const editUrl = `/api/auth/${userId}`;
  return axios.put(editUrl, data)
  .then(response => {
    return response.data;
  })
  .catch(error => {
    if (error.response) {
      throw new Error(error.response.data.error.message);
    } else if (error.request) {
      throw new Error(error.request.data.error.message);
    } else {
      console.log('Axios error, neither request nor response');
      console.log('Error', error.message);
      throw new Error('Error editing user');
    }
  });
}

export async function getTodoList(userId, listId) {
  const url = `/api/users/${userId}/todoLists/${listId}`;
  return axios.get(url)
  .then(response => {
    return response.data;
  })
  .catch(error => {
    if (error.response) {
      throw new Error(error.response.data.error.message);
    } else if (error.request) {
      throw new Error(error.request.data.error.message);
    } else {
      console.log('Axios error, neither request nor response');
      console.log('Error', error.message);
      throw new Error('Error getting todo list');
    }
  });
}

export async function getTodoLists(userId) {
  const url = `/api/users/${userId}/todoLists`;
  return axios.get(url)
  .then(response => {
    return response.data;
  })
  .catch(error => {
    if (error.response) {
      throw new Error(error.response.data.error.message);
    } else if (error.request) {
      throw new Error(error.request.data.error.message);
    } else {
      console.log('Axios error, neither request nor response');
      console.log('Error', error.message);
      throw new Error('Error getting todo lists');
    }
  });
}

export async function createTodoList(userId, listName) {
  const url = `/api/users/${userId}/todoLists`;
  return axios.post(url, { 
    name: listName,
    priorityList: [],
    nonPriorityList: [],
    completedList: []
  })
  .then(response => {
    return response.data;
  })
  .catch(error => {
    if (error.response) {
      throw new Error(error.response.data.error.message);
    } else if (error.request) {
      throw new Error(error.request.data.error.message);
    } else {
      console.log('Axios error, neither request nor response');
      console.log('Error', error.message);
      throw new Error('Error creating todo list');
    }
  });
}

export async function insertTodoList(userId, todoList) {
  const url = `/api/users/${userId}/todoLists`;
  return axios.post(url, todoList)
  .then(response => {
    return response.data;
  })
  .catch(error => {
    if (error.response) {
      throw new Error(error.response.data.error.message);
    } else if (error.request) {
      throw new Error(error.request.data.error.message);
    } else {
      console.log('Axios error, neither request nor response');
      console.log('Error', error.message);
      throw new Error('Error creating todo list');
    }
  });
}

export async function removeTodoList(userId, listId) {
  const url = `/api/users/${userId}/todolists/${listId}`;
  return axios.delete(url)
  .then(response => {
    return response.data;
  })
  .catch(error => {
    if (error.response) {
      throw new Error(error.response.data.error.message);
    } else if (error.request) {
      throw new Error(error.request.data.error.message);
    } else {
      console.log('Axios error, neither request nor response');
      console.log('Error', error.message);
      throw new Error('Error removing todo list');
    }
  });
}

export async function updateTodoList(userId, listId, data) {
  const url = `/api/users/${userId}/todoLists/${listId}`;
  return axios.put(url, data)
  .then(response => {
    return response.data;
  })
  .catch(error => {
    if (error.response) {
      throw new Error(error.response.data.error.message);
    } else if (error.request) {
      throw new Error(error.request.data.error.message);
    } else {
      console.log('Axios error, neither request nor response');
      console.log('Error', error.message);
      throw new Error('Error updating todo list');
    }
  });
}