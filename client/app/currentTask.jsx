import React, { PropTypes, Component } from 'react';
import { DropTarget } from 'react-dnd';
import update from 'react/lib/update';
import Deliverable from './deliverableComponent.jsx';
import { ItemTypes } from './itemTypes';

const currentTaskTarget = {
  drop(props, monitor) {
    // logic for updating the deliverables status
    console.log('dropped props', props, 'dropped monitor', monitor);
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
    this.moveDeliverable = this.moveDeliverable.bind(this);
    this.state = {
      deliverables: props.deliverables
    };
  }

  moveDeliverable(dragIndex, hoverIndex) {
    const { deliverables } = this.state;
    const { dragDeliverable } = deliverables[dragIndex];
    console.log('moveDeliverable is called');
    console.log(this);
    this.setState(update(this.state, {
      deliverables: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragDeliverable]
        ]
      }
    }));
  }

  render() {
    console.log('state in currentTask', this.state);
    const {
      connectDropTarget,
      isOver,
      deleteDeliverable
    } = this.props;
    const { deliverables } = this.state;
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
              {deliverables.map((deliverable, index) =>
                <Deliverable deliverable={deliverable} index={index} id={deliverable.id} deleteDeliverable={deleteDeliverable.bind(this)} moveDeliverable={this.moveDeliverable} />
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