import React, { PropTypes, Component } from 'react';
import { DropTarget } from 'react-dnd';
import update from 'react/lib/update';
import Deliverable from './deliverableComponent.jsx';
import { ItemTypes } from './itemTypes';

const backlogTarget = {
  drop(props, monitor) {

    const currentDeliverable = monitor.getItem().currentDeliverable;
    const newDeliverable = JSON.parse(JSON.stringify(currentDeliverable));
    newDeliverable.status = 'backlog';

    // monitor.getItem().updateDeliverableStatus(currentDeliverable, newDeliverable);
    props.deliverables.push(newDeliverable);

  }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

class Backlog extends Component {
  constructor(props) {
    super(props);
    this.moveDeliverable = this.moveDeliverable.bind(this);
    this.state = {
      deliverables: props.deliverables
    };
  }
  moveDeliverable(dragIndex, hoverIndex) {
    let context = this;
    const deliverables = this.state.deliverables;
    const dragDeliverable = deliverables[dragIndex];
    this.setState(update(this.state, {
      deliverables: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragDeliverable]
        ]
      }
    }));
    context.forceUpdate();
  }
  render() {
    const {
      connectDropTarget,
      isOver,
      updateDeliverableStatus,
      deleteDeliverable
    } = this.props;
    const { deliverables } = this.state;
    return connectDropTarget(
      <div>
        <div className="deliverables-section-header">
            <h3 id="backlog">Backlog</h3>
          </div>
          <div className="deliverables-section-body">
            <table className="table table-hover table-bordered table-sm">
              <thead className="hideMe">
                <tr>
                  <th>ID</th>
                  <th>Description</th>
                  <th>Asignee</th>
                  <th>Complexity</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {deliverables.map((deliverable, index) =>
                <Deliverable deliverable={deliverable} index={index} id={deliverable.id} deleteDeliverable={deleteDeliverable.bind(this)} moveDeliverable={this.moveDeliverable.bind(this)} updateDeliverableStatus={updateDeliverableStatus.bind(this)}/>
              )}
              </tbody>
            </table>
          </div>
      </div>
    );
  }
}
Backlog.PropTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  deliverables: PropTypes.object.isRequired,
  deleteDeliverable: PropTypes.func.isRequired
};
export default DropTarget(ItemTypes.DELIVERABLE, backlogTarget, collect)(Backlog);