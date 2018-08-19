import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as apiCalls from './api';
import './TodoLists.css';

class TodoLists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todoLists: null,
      newListName: '',
      lastDeletedTodoList: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteList = this.deleteList.bind(this);
    this.undoDeletedList = this.undoDeletedList.bind(this);
  }
  
  async componentDidMount() {
    try{
      let todoLists = await apiCalls.getTodoLists(this.props.currentUser.id);
      this.setState({todoLists});
    } catch(err) {
      console.log("Error in <TodoLists>/componentDidMount: ");
      console.log(err);
      this.props.onError(err);
    }
  }
  
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  
  async handleSubmit(e) {
    e.preventDefault();
    try {
      let newList = await apiCalls.createTodoList(this.props.currentUser.id, this.state.newListName);
      let todoLists = [...this.state.todoLists, {name: newList.name, _id: newList._id}];
      let newListName = '';
      this.setState({todoLists, newListName});
    } catch(err) {
      console.log("Error in <TodoLists>/handleSubmit: ");
      console.log(err);
      this.props.onError(err);
    }
  }
  
  async deleteList(listId){
    try {
      const lastDeletedTodoList = await apiCalls.getTodoList(this.props.currentUser.id, listId);
      await apiCalls.removeTodoList(this.props.currentUser.id, listId);
      const todoLists = this.state.todoLists.filter((list) => list._id !== listId);
      this.setState({todoLists, lastDeletedTodoList});
    } catch(err) {
      console.log("Error in <TodoLists>/deleteList: ");
      console.log(err);
      this.props.onError(err);
    }
  }
  
  async undoDeletedList(){
    try {
      await apiCalls.insertTodoList(this.props.currentUser.id, this.state.lastDeletedTodoList);
      const todoLists = [...this.state.todoLists, {
        name: this.state.lastDeletedTodoList.name,
        _id: this.state.lastDeletedTodoList._id
      }];
      const lastDeletedTodoList = null;
      this.setState({todoLists, lastDeletedTodoList});
    } catch(err) {
      console.log("Error in <TodoLists>/undoDeleteList: ");
      console.log(err);
      this.props.onError(err);
    }
  }
  
  render() {
    if(this.state.todoLists === null) {
      return null;
    } else {
      const todoLists = this.state.todoLists.map((list) => (
          <li className='list-link-li' key={list._id}>
            <i className="far fa-trash-alt hidden-icon"></i>
            <Link className='list-link-a' to={`/${this.props.currentUser.username}/mylists/${list._id}`}>{list.name}</Link>
            <i onClick={() => {this.deleteList(list._id)}} className="far fa-trash-alt"></i>
          </li>
        ));
      return(
        <div className='my-lists-container'>
          <h2>My Lists</h2>
          {this.state.lastDeletedTodoList && 
            <i className="fas fa-undo" onClick={this.undoDeletedList}></i> 
          }
          <ul>{todoLists}</ul>
          <form
            onSubmit={this.handleSubmit}
            className='form-inline new-list-form'
          >
            <div className="form-group mx-sm-3">
              <input
                type="text"
                placeholder="New list name"
                className="form-control"
                aria-label="newListName"
                aria-describedby="basic-addon1"
                id='newListName'
                name='newListName'
                onChange={this.handleChange}
                value={this.state.newListName}
              />
            </div>
            <button
              type='submit'
              className='btn btn-primary btn-sm'
              onSubmit={this.handleSubmit}
            >
              Create New List
            </button>
          </form>
        </div>
      );
    }
  }
}

export default TodoLists;