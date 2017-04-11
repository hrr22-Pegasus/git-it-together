import React, { PropTypes, Component } from 'react';
import { DropTarget } from 'react-dnd';
import update from 'react/lib/update';
import Deliverable from './deliverableComponent.jsx';
import { ItemTypes } from './itemTypes';

const backlogTarget = {
  drop(props, monitor, component) {

    const id = props.sectionId;
    const sourceObj = monitor.getItem();
    if (id !== sourceObj.sectionId) {
      component.pushDeliverable(sourceObj.currentDeliverable);
    }
    return {
      sectionId: id
    }

    // const currentDeliverable = monitor.getItem().currentDeliverable;
    // const newDeliverable = JSON.parse(JSON.stringify(currentDeliverable));
    // newDeliverable.status = 'complete';

    // // code to call the update function after a deliverable has been dropped into a new container
    // // monitor.getItem().updateDeliverableStatus(currentDeliverable, newDeliverable);
    // props.deliverables.push(newDeliverable);

  }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
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

  pushDeliverable(deliverable) {
    this.setState(update(this.state, {
      deliverables: {
        $push: [ deliverable ]
      }
    }));
  }

  removeDeliverable(index) {
    this.setState(update(this.state, {
      deliverables: {
        $splice: [
          [index, 1]
        ]
      }
    }));
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
      canDrop,
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
                <Deliverable
                deliverable={deliverable}
                index={index}
                id={deliverable.id}
                sectionId={this.props.sectionId}
                pushDeliverable={this.pushDeliverable.bind(this)}
                removeDeliverable={this.removeDeliverable.bind(this)}
                deleteDeliverable={deleteDeliverable.bind(this)}
                moveDeliverable={this.moveDeliverable.bind(this)}
                updateDeliverableStatus={updateDeliverableStatus.bind(this)}/>
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