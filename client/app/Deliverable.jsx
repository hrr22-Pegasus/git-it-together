import React from 'react';
import $ from 'jquery';
import Deliverable from './deliverableComponent.jsx';
import {CurrentTasks} from './currentTask.jsx';
import {Icebox} from './icebox.jsx';
import {Backlog} from './backlog.jsx';
import {CompletedTasks} from './completedTasks.jsx';
//import { DragDropContext } from 'react-dnd';
//import HTML5Backend from 'react-dnd-html5-backend';

var socket = io.connect('/io/deliverables');

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {id: props.projectid, task: null, owner: null, points: null, status: 'current'}
  }

  componentDidMount() {
    // Tell other clients a change occured
    socket.emit('room', this.props.room);
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.task && this.state.owner && this.state.points && this.state.status) {
      axios.post('/api/deliverables', {
        projectID: this.state.id,
        task: this.state.task,
        owner: this.state.owner,
        points: this.state.points,
        status: this.state.status
      }).then(function(response) {
        socket.emit('change', 'post');
      });
      this.setState({task: null, owner: null, points: null, status: 'current'});
      document.getElementById('deliverableForm').reset();
      $('#deliverableForm').css('border', 'none');
    } else {
      $('#deliverableForm').css('border', '2px solid red');
    }
  }

  render() {
    return (
      <form id="deliverableForm" className="form" onSubmit={this.handleSubmit.bind(this)}>
        <div className="col-12">
          <label className="sr-only" htmlFor="deliverable-input-task">Task</label>
          <input type="text" className="form-control" id="deliverable-input-task" placeholder="Task"
            onChange={(event) => this.setState({task: event.target.value})} />
        </div>
        <div className="col-12">
          <label className="sr-only" htmlFor="deliverable-input-assignment">Assigned To</label>
          <input type="text" className="form-control" id="deliverable-input-assignment" placeholder="Team Member"
            onChange={(event) => this.setState({owner: event.target.value})} />
        </div>
        <div className="col-12">
          <label className="sr-only" htmlFor="deliverable-input-fibbonaci">Task Complexity</label>
          <select className="custom-select" id="deliverable-input-fibbonaci"
            onChange={(event) => this.setState({points: event.target.value})}>
            <option>Complexity</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="5">5</option>
            <option value="8">8</option>
          </select>
          <label className="sr-only" htmlFor="deliverable-input-status">Status</label>
          <select className="custom-select" id="deliverable-input-status"
            onChange={(event) => this.setState({status: event.target.value})}>
            <option value="current">Current Tasks</option>
            <option value="backlog">Backlog</option>
            <option value="icebox">Icebox</option>
            <option value="complete">Completed Tasks</option>
          </select>
          <button type="submit" className="btn btn-primary">Add</button>
        </div>
      </form>
    );
  };
};

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {project: props.project, deliverables: null};

    this.getDeliverables();
  }

  componentDidMount() {
    // Listen for a call to rerender the list
    socket.on('reload', this.getDeliverables.bind(this));
  }

  getDeliverables() {
    var context = this;
    var project = this.state.project;
    axios.get('/api/deliverables?id=' + project.id)
    .then(function(response) {
      context.state.deliverables = {};
      var deliverables = context.state.deliverables;
      deliverables.current = [];
      deliverables.backlog = [];
      deliverables.icebox = [];
      deliverables.complete = [];
      response.data.forEach(function(deliverable) {
        if (deliverable.status === 'complete') {
          deliverables.complete.push(deliverable);
        } else if (deliverable.status === 'backlog') {
          deliverables.backlog.push(deliverable);
        } else if (deliverable.status === 'icebox') {
          deliverables.icebox.push(deliverable);
        } else if (deliverable.status === 'current') {
          deliverables.current.push(deliverable);
        }
      });
      context.forceUpdate();
    });
  }

  deleteDeliverable(deliverableID) {
    axios.delete('/api/deliverables?id=' + deliverableID)
    .then(function(response) {
      // Tell other clients a change occured
      socket.emit('change', 'delete');
    });
  }

  render() {
    if (this.state.deliverables === null) {
      return (
        <div><i className="fa fa-spinner fa-pulse fa-5x fa-fw"></i></div>
      );
    } else {
      return (
        <div id="deliverables">
          <CurrentTasks deliverables={this.state.deliverables.current} deleteDeliverable={this.deleteDeliverable}/>
          <Backlog deliverables={this.state.deliverables.backlog} deleteDeliverable={this.deleteDeliverable}/>
          <Icebox deliverables={this.state.deliverables.icebox} deleteDeliverable={this.deleteDeliverable}/>
          <CompletedTasks deliverables={this.state.deliverables.complete} deleteDeliverable={this.deleteDeliverable}/>
        </div>
      );
    }
  }
}

exports.Form = Form;
exports.List = List;
//exports.DragDropContext = DragDropContext(HTML5Backend)(List);
