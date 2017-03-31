import React, { PropTypes, Component } from 'react';
import { DropTarget } from 'react-dnd';
import Deliverable from './deliverableComponent.jsx';

// const currentTaskTarget = {
//   drop(props, monitor) {
//     // logic for updating the deliverables status
//     console.log('dropped props', props);
//   }
// }

class Icebox extends Component {
  constructor(props) {
    super(props);
    this.deliverables = props.deliverables;
    this.deleteDeliverable = props.deleteDeliverable;
  }
  render() {
    // const {
    //   deliverable,
    //   deleteDeliverable
    // } = this.props;
    return (
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
exports.Icebox = Icebox;