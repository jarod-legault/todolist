import React, { Component } from 'react';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import * as apiCalls from './api';
import './TodoList.css';

const SortableItem = SortableElement(({value}) =>
  <li>{value}</li>
);

const SortableList = SortableContainer(({items}) => {
  return (
    <ul className='todo-list'>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </ul>
  );
});

class TodoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      priorityTodos: null,
      nonPriorityTodos: null,
      completedTodos: null,
      priorityInputChecked: false,
      titleEditable: false
    };
    this.addTodo = this.addTodo.bind(this);
    this.togglePriorityInput = this.togglePriorityInput.bind(this);
    this.deleteAllCompleted = this.deleteAllCompleted.bind(this);
    this.updateTitle = this.updateTitle.bind(this);
  }
  
  async componentDidMount() {
    try{
      let todoList = await apiCalls.getTodoList(this.props.currentUser.id, this.props.match.params.listId);
      this.setState({
        name: todoList.name,
        priorityTodos: todoList.priorityList,
        nonPriorityTodos: todoList.nonPriorityList,
        completedTodos: todoList.completedList
      });
    } catch(err) {
      console.log("Error in <TodoList>/componentDidMount: ");
      console.log(err);
      this.props.onError(err);
    }
  }
  
  async addTodo(val) {
    try{
      var priorityTodos, nonPriorityTodos;
      var newTodo = {
        name: val,
        priority: this.state.priorityInputChecked,
        listId: this.props.match.params.listId,
        completed: false
      };
      if(this.state.priorityInputChecked) {
        priorityTodos = [...this.state.priorityTodos, newTodo];
        await apiCalls.updateTodoList(this.props.currentUser.id, this.props.match.params.listId, {priorityList: priorityTodos});
        this.setState({
          priorityTodos,
          priorityInputChecked: true
        });
      } else {
        nonPriorityTodos = [...this.state.nonPriorityTodos, newTodo];
        await apiCalls.updateTodoList(this.props.currentUser.id, this.props.match.params.listId, {nonPriorityList: nonPriorityTodos});
        this.setState({
          nonPriorityTodos,
          priorityInputChecked: false
        });
      }
    } catch(err) {
      console.log("This is the error (<TodoList>(addTodo)): ");
      console.log(err);
      this.props.onError(err);
    }
  }
  
  async deleteTodo(index, completed, priority) {
    try{
      var priorityTodos, nonPriorityTodos, completedTodos, lastDeletedTodo;
      var lastDeletedTodoList = undefined;
      
      if(completed) {
        lastDeletedTodo = this.state.completedTodos[index];
        completedTodos = this.state.completedTodos.filter((t, i) => index !== i);
        await apiCalls.updateTodoList(this.props.currentUser.id, this.props.match.params.listId, {completedList: completedTodos});
        this.setState({completedTodos, lastDeletedTodo, lastDeletedTodoList});
      } else if (priority) {
        lastDeletedTodo = this.state.priorityTodos[index];
        priorityTodos = this.state.priorityTodos.filter((t, i) => index !== i);
        await apiCalls.updateTodoList(this.props.currentUser.id, this.props.match.params.listId, {priorityList: priorityTodos});
        this.setState({priorityTodos, lastDeletedTodo, lastDeletedTodoList});
      } else {
        lastDeletedTodo = this.state.nonPriorityTodos[index];
        nonPriorityTodos = this.state.nonPriorityTodos.filter((t, i) => index !== i);
        await apiCalls.updateTodoList(this.props.currentUser.id, this.props.match.params.listId, {nonPriorityList: nonPriorityTodos});
        this.setState({nonPriorityTodos, lastDeletedTodo, lastDeletedTodoList});
      }
    } catch(err) {
      console.log("This is the error (<TodoList>(deleteTodo)): ");
      console.log(err);
      this.props.onError(err);
    }
  }
  
  async deleteAllCompleted() {
    try{
      var completedTodos = [];
      var lastDeletedTodoList = [...this.state.completedTodos];
      var lastDeletedTodo = undefined;
      await apiCalls.updateTodoList(this.props.currentUser.id, this.props.match.params.listId, {completedList: completedTodos});
      this.setState({completedTodos, lastDeletedTodo, lastDeletedTodoList});
    } catch(err) {
      console.log("This is the error (<TodoList>(deleteAllCompleted)): ");
      console.log(err);
      this.props.onError(err);
    }
  }
  
  async toggleComplete(index, todo) {
    try {
      var priorityTodos, nonPriorityTodos, completedTodos;
      
      todo.completed = !todo.completed;
      if(!todo.completed) { // If this todo was just marked as not complete
        if(todo.priority){
          priorityTodos = [...this.state.priorityTodos, todo];
          completedTodos = this.state.completedTodos.filter((t, i) => index !== i);
          await apiCalls.updateTodoList(this.props.currentUser.id, this.props.match.params.listId, {priorityList: priorityTodos, completedList: completedTodos});
          this.setState({priorityTodos, completedTodos});
        } else {
          nonPriorityTodos = [...this.state.nonPriorityTodos, todo];
          completedTodos = this.state.completedTodos.filter((t, i) => index !== i);
          await apiCalls.updateTodoList(this.props.currentUser.id, this.props.match.params.listId, {nonPriorityList: nonPriorityTodos, completedList: completedTodos});
          this.setState({nonPriorityTodos, completedTodos});
        }
      } else { // If this todo was marked as complete
        if(todo.listId !== this.props.match.params.listId) {
          completedTodos = [...this.state.completedTodos];
          let otherTodoList = await apiCalls.getTodoList(this.props.currentUser.id, todo.listId);
          let otherCompletedList = [todo, ...otherTodoList.completedList];
          await apiCalls.updateTodoList(this.props.currentUser.id, todo.listId, {completedList: otherCompletedList});
        } else {
          completedTodos = [todo, ...this.state.completedTodos];
        }
        if(todo.priority) { // If this todo was marked as complete and is priority
          priorityTodos = this.state.priorityTodos.filter((t, i) => index !== i);
          await apiCalls.updateTodoList(this.props.currentUser.id, this.props.match.params.listId, {completedList: completedTodos, priorityList: priorityTodos});
          this.setState({priorityTodos, completedTodos});
        } else { // If this todo was marked as complete and is nonPriority
          // completedTodos = [todo, ...this.state.completedTodos];
          nonPriorityTodos = this.state.nonPriorityTodos.filter((t, i) => index !== i);
          await apiCalls.updateTodoList(this.props.currentUser.id, this.props.match.params.listId, {completedList: completedTodos, nonPriorityList: nonPriorityTodos});
          this.setState({nonPriorityTodos, completedTodos});
        }
      }
    } catch(err) {
      console.log("This is the error (<TodoList>(togglePriority)): ");
      console.log(err);
      this.props.onError(err);
    }
  }
    
  async togglePriority(index, todo) {
    try {
      var priorityTodos, nonPriorityTodos;
      
      todo.priority = !todo.priority;
      if(todo.priority) { // If todo was just made a priority
        priorityTodos = [...this.state.priorityTodos, todo];
        nonPriorityTodos = this.state.nonPriorityTodos.filter((t, i) => index !== i);
      } else { // If todo was just made a non-priority
        if(todo.listId === this.props.match.params.listId) {
          nonPriorityTodos = [...this.state.nonPriorityTodos, todo];
        } else {
          nonPriorityTodos = [...this.state.nonPriorityTodos];
          let otherTodoList = await apiCalls.getTodoList(this.props.currentUser.id, todo.listId);
          otherTodoList.nonPriorityList.push(todo);
          await apiCalls.updateTodoList(this.props.currentUser.id, todo.listId, {nonPriorityList: otherTodoList.nonPriorityList});
        }
        priorityTodos = this.state.priorityTodos.filter((t, i) => index !== i);
      }
      await apiCalls.updateTodoList(this.props.currentUser.id, this.props.match.params.listId, {priorityList: priorityTodos, nonPriorityList: nonPriorityTodos});
      this.setState({priorityTodos, nonPriorityTodos});
    } catch(err) {
      console.log("This is the error (<TodoList>(togglePriority)): ");
      console.log(err);
      this.props.onError(err);
    }
  }
  
  async editTodo(i, todo, newName) {
    try {
      if(todo.priority) {
        var priorityTodos = this.state.priorityTodos.map((t, index) => i === index ? {...t, name: newName} : t);
        await apiCalls.updateTodoList(this.props.currentUser.id, this.props.match.params.listId, {priorityList: priorityTodos});
        this.setState({priorityTodos});
      } else {
        var nonPriorityTodos = this.state.nonPriorityTodos.map((t, index) => i === index ? {...t, name: newName} : t);
        await apiCalls.updateTodoList(this.props.currentUser.id, this.props.match.params.listId, {nonPriorityList: nonPriorityTodos});
        this.setState({nonPriorityTodos});
      }
    } catch(err) {
      console.log("This is the error (<TodoList>(togglePriority)): ");
      console.log(err);
      this.props.onError(err);
    }
  }
  
  async togglePriorityInput() {
    this.setState((prevState, props) => {
      return {
        priorityInputChecked: !prevState.priorityInputChecked
      };
    });
  }
  
  async onSortEndPriority({oldIndex, newIndex}) {
    try {
      var priorityTodos = arrayMove(this.state.priorityTodos, oldIndex, newIndex);
      await apiCalls.updateTodoList(this.props.currentUser.id, this.props.match.params.listId, {priorityList: priorityTodos});
      this.setState({ priorityTodos });
    } catch(err) {
      console.log("This is the error (<TodoList>(onSortEndPriority)): ");
      console.log(err);
      this.props.onError(err);
    }
  }
  
  async onSortEndNonPriority({oldIndex, newIndex}) {
    try {
      var nonPriorityTodos = arrayMove(this.state.nonPriorityTodos, oldIndex, newIndex);
      await apiCalls.updateTodoList(this.props.currentUser.id, this.props.match.params.listId, {nonPriorityList: nonPriorityTodos});
      this.setState({ nonPriorityTodos });
    } catch(err) {
      console.log("This is the error (<TodoList>(onSortEndNonPriority)): ");
      console.log(err);
      this.props.onError(err);
    }
  }
  
  async onSortEndCompleted({oldIndex, newIndex}) {
    try {
      var completedTodos = arrayMove(this.state.completedTodos, oldIndex, newIndex);
      await apiCalls.updateTodoList(this.props.currentUser.id, this.props.match.params.listId, {completedList: completedTodos});
      this.setState({ completedTodos });
    } catch(err) {
      console.log("This is the error (<TodoList>(onSortEndCompleted)): ");
      console.log(err);
      this.props.onError(err);
    }
  }
  
  async undoDelete() {
    try {
      var priorityTodos, nonPriorityTodos, completedTodos;
      var lastDeletedTodo = undefined;
      var lastDeletedTodoList = undefined;
      
      if(this.state.lastDeletedTodo) {
        if(this.state.lastDeletedTodo.completed) {
          completedTodos = [...this.state.completedTodos, this.state.lastDeletedTodo];
          await apiCalls.updateTodoList(this.props.currentUser.id, this.props.match.params.listId, {completedList: completedTodos});
          this.setState({completedTodos, lastDeletedTodo, lastDeletedTodoList});
        } else if(this.state.lastDeletedTodo.priority){
          priorityTodos = [...this.state.priorityTodos, this.state.lastDeletedTodo];
          await apiCalls.updateTodoList(this.props.currentUser.id, this.props.match.params.listId, {priorityList: priorityTodos});
          this.setState({priorityTodos, lastDeletedTodo, lastDeletedTodoList});
        } else if(this.state.lastDeletedTodo.priority === false) {
          nonPriorityTodos = [...this.state.nonPriorityTodos, this.state.lastDeletedTodo];
          await apiCalls.updateTodoList(this.props.currentUser.id, this.props.match.params.listId, {nonPriorityList: nonPriorityTodos});
          this.setState({nonPriorityTodos, lastDeletedTodo, lastDeletedTodoList});
        }
      } else if (this.state.lastDeletedTodoList) {
        completedTodos = [...this.state.lastDeletedTodoList];
        await apiCalls.updateTodoList(this.props.currentUser.id, this.props.match.params.listId, {completedList: completedTodos});
        this.setState({completedTodos, lastDeletedTodo, lastDeletedTodoList});
      }
    } catch(err) {
      console.log("This is the error (<TodoList>(undoDelete)): ");
      console.log(err);
      this.props.onError(err);
    }
  }
  
  async updateTitle(e) {
    e.preventDefault();
    try {
      await apiCalls.updateTodoList(this.props.currentUser.id, this.props.match.params.listId, {name: this.state.titleText});
      this.setState({name: this.state.titleText, titleEditable: false});
    } catch(err) {
      console.log("This is the error (<TodoList>(updateTitle)): ");
      console.log(err);
      this.props.onError(err);
    }
  }
  
  handleChange = (e) => {
    // this.setState({[e.target.name]: e.target.value})
    this.setState({titleText: e.target.value});
  }
  
  render () {
    if(this.state.priorityTodos === null) {
      return(
        <div>
          <h4>Loading...</h4>
        </div>
      );
    } else {
      var title;
      if(this.state.titleEditable) {
        title = 
          <span>
          <form className='title-edit-form' onSubmit={this.updateTitle}>
            <input
              className='edit-title-input'
              id='titleInputSmall'
              type='text'
              autoFocus='autofocus'
              value={this.state.titleText}
              onChange={this.handleChange}
            />
            <button
              type='submit'
              className="far fa-check-square title-submit-check"
            ></button>
            <i className="fas fa-times cancel-title-x" onClick={() => this.setState({titleEditable: false})}></i>
          </form>
        </span>;
      } else {
        title = <h2 className='list-title'>
          {this.state.name}
          <i className="far fa-edit title-edit-icon" onClick={() => this.setState({titleText: this.state.name, titleEditable: true})}></i>
        </h2>;
      }
      const priorityTodos = this.state.priorityTodos.map((t, arrayIndex) => (
        <TodoItem
          key={arrayIndex}
          {...t}
          arrayIndex={arrayIndex}
          lastArrayIndex={this.state.priorityTodos.length - 1}
          onDelete={this.deleteTodo.bind(this, arrayIndex, t.completed, t.priority)}
          onToggleComplete={this.toggleComplete.bind(this, arrayIndex, t)}
          onTogglePriority={this.togglePriority.bind(this, arrayIndex, t)}
          onEditTodo={this.editTodo.bind(this, arrayIndex, t)}
        />
      ));
      const nonPriorityTodos = this.state.nonPriorityTodos.map((t, arrayIndex) => (
        <TodoItem
          key={arrayIndex}
          {...t}
          arrayIndex={arrayIndex}
          lastArrayIndex={this.state.nonPriorityTodos.length - 1}
          onDelete={this.deleteTodo.bind(this, arrayIndex, t.completed, t.priority)}
          onToggleComplete={this.toggleComplete.bind(this, arrayIndex, t)}
          onTogglePriority={this.togglePriority.bind(this, arrayIndex, t)}
          onEditTodo={this.editTodo.bind(this, arrayIndex, t)}
        />
      ));
      const completedTodos = this.state.completedTodos.map((t, arrayIndex) => (
        <TodoItem
          key={arrayIndex}
          {...t}
          onDelete={this.deleteTodo.bind(this, arrayIndex, t.completed, t.priority)}
          onToggleComplete={this.toggleComplete.bind(this, arrayIndex, t)}
        />
      ));
      return (
        <div className='list-container'>
          {title}
          <TodoForm addTodo={this.addTodo}
            priorityInputChecked={this.state.priorityInputChecked}
            onTogglePriorityInput={this.togglePriorityInput}
          />
          <div className='control-panel'>
            {this.state.lastDeletedTodo || this.state.lastDeletedTodoList ? 
              <i className="fas fa-undo" onClick={this.undoDelete.bind(this)}></i> 
              : null
            }
          </div>
          
          <SortableList
            items={priorityTodos}
            lockAxis='y'
            onSortEnd={this.onSortEndPriority.bind(this)}
            useDragHandle={true}
            // pressDelay={150}
          />
          <hr />
          
          <SortableList
            items={nonPriorityTodos}
            lockAxis='y'
            onSortEnd={this.onSortEndNonPriority.bind(this)}
            useDragHandle={true}
            // pressDelay={150}
          />
          <hr />
          <SortableList
            items={completedTodos}
            lockAxis='y'
            onSortEnd={this.onSortEndCompleted.bind(this)}
            useDragHandle={true}
            // pressDelay={150}
          />
          { this.state.completedTodos.length > 0 ? 
            <button className='delete-all-button' onClick={this.deleteAllCompleted}>
              <i className="far fa-trash-alt delete-all-trash-icon"></i><span> Delete all completed todos</span>
            </button>
            : null
          }
        </div>
      );
      
    }
  }
}

export default TodoList;