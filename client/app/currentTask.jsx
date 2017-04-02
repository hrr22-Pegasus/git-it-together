import React, { PropTypes, Component } from 'react';
import { DropTarget } from 'react-dnd';
import Deliverable from './deliverableComponent.jsx';
import { ItemTypes } from './itemTypes';

const currentTaskTarget = {
  drop(props, monitor) {
    // logic for updating the deliverables status
    console.log('dropped props', props);
  }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

class CurrentTasks extends Component {
  constructor(props) {
    super(props);
    this.deliverables = props.deliverables;
    this.deleteDeliverable = props.deleteDeliverable;
  }
  render() {
    const {
      connectDropTarget,
      isOver,
      deliverables,
      deleteDeliverable
    } = this.props;
    return connectDropTarget(
      <div>
        <div className="deliverables-section-header">
          <h3 id="current">Current Tasks</h3>
        </div>
        <div className="deliverables-section-body">
          <table className="table table-hover table-bordered table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Description</th>
                <th>Assignee</th>
                <th>Complexity</th>
                <th>Start Date</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {this.deliverables.map((deliverable) =>
                <Deliverable deliverable={deliverable} deleteDeliverable={this.deleteDeliverable.bind(this)} />
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
CurrentTasks.PropTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  deliverables: PropTypes.object.isRequired,
  deleteDeliverable: PropTypes.func.isRequired
};
export default DropTarget(ItemTypes.DELIVERABLE, currentTaskTarget, collect)(CurrentTasks);