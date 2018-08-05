import React, { Component } from 'react';
import './TodoForm.css';

class TodoForm extends Component {
  constructor(props) {
    super(props);
    this.state = {inputValue: ''};
  }
  
  handleChange = (e) => {
    this.setState({
      inputValue: e.target.value
    });
  }
  
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.addTodo(this.state.inputValue);
    this.setState({inputValue: ''});
  }
  
  render() {
    const { priorityInputChecked, onTogglePriorityInput } = this.props;
    var inputStar;
    if(priorityInputChecked) inputStar = <i className="fas fa-star inputStar" onClick={onTogglePriorityInput}></i>;
    else inputStar = <i className="far fa-star inputStar" onClick={onTogglePriorityInput}></i>;
    
    return (
      <form className='todo-input-form' onSubmit={this.handleSubmit}>
        {inputStar}
        <input
          id='todoInput'
          type='text'
          placeholder='Add new todo...'
          value={this.state.inputValue}
          onChange={this.handleChange}
        />
        <button
          type='submit'
          className="far fa-plus-square"
        ></button>
      </form>
    );
  }
}

export default TodoForm;