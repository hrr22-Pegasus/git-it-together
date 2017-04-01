import React, { PropTypes, Component } from 'react';
import { DropTarget } from 'react-dnd';
import Deliverable from './deliverableComponent.jsx';
import { ItemTypes } from './itemTypes';

const iceboxTarget = {
  drop(props, monitor) {
    // logic for updating the deliverables status
    console.log('dropped props', props);
  }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

class Icebox extends Component {
  constructor(props) {
    super(props);
    this.deliverables = props.deliverables;
    this.deleteDeliverable = props.deleteDeliverable;
    // this.connectDropTarget = connectDropTarget;
    // this.isOver = isOver;
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
            <h3 id="icebox">Icebox</h3>
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
Icebox.PropTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  deliverables: PropTypes.object.isRequired,
  deleteDeliverable: PropTypes.func.isRequired
};
export default DropTarget(ItemTypes.DELIVERABLE, iceboxTarget, collect)(Icebox);