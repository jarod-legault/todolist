import React, { Component } from 'react';
import { SortableHandle } from 'react-sortable-hoc';
import './TodoItem.css';

const DragHandle = SortableHandle(() => <i className='fas fa-arrows-alt'></i>); // This can be any component you want

class TodoItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditable: false,
      inputValue: ''
    }
  }
  
  toggleEdit(){
    this.setState((prevState, props) => {
      return {
        isEditable: !prevState.isEditable,
        todoText: this.props.name
      };
    });
  }
  
  cancelEdit(){
    this.setState({
      isEditable: false
    });
  }
  
  handleChange = (e) => {
    // this.setState({[e.target.name]: e.target.value})
    this.setState({todoText: e.target.value});
  }
  
  async handleSubmit(e) {
    e.preventDefault();
    this.props.onEditTodo(this.state.todoText);
    this.setState({isEditable: false});
  }
  
  render() {
    const {
      name,
      _id,
      completed,
      priority,
      onDelete,
      onTogglePriority,
      onToggleComplete,
    } = this.props;
  
    var starIcon = null;
    if(!completed && priority) starIcon = <i className="fas fa-star" onClick={onTogglePriority}></i>;
    if(!completed && !priority) starIcon = <i className="far fa-star" onClick={onTogglePriority}></i>;
    var editIcon = !completed && !this.state.isEditable ? <i className="far fa-edit" onClick={this.toggleEdit.bind(this, _id)}></i> : null;
    
    
    var todoBody;
    if(!this.state.isEditable){
      todoBody = 
        <span className='todo-text'
          style={{ textDecoration: completed ? 'line-through' : 'none' }}
          onClick={onToggleComplete}
        >
          {name}
        </span>;
    } else {
      todoBody =
        <form className='todo-edit-form' onSubmit={this.handleSubmit.bind(this)}>
          <input
            className='edit-input'
            id='todoInputSmall'
            type='text'
            autoFocus='autofocus'
            value={this.state.todoText}
            onChange={this.handleChange}
          />
          <button
            type='submit'
            className="far fa-check-square edit-submit-check"
          ></button>
          <i className="fas fa-times cancel-edit-x" onClick={this.cancelEdit.bind(this, _id)}></i>
        </form>
    }
    
    return (
      <div className='todo-item item-container'>
        <div className='left-items'>
          <DragHandle />
          {starIcon}
          {todoBody}
          {editIcon}
        </div>
        <div className='right-items'>
          <i onClick={onDelete} className="far fa-trash-alt"></i>
        </div>
      </div>
    );
  }
}

export default TodoItem;