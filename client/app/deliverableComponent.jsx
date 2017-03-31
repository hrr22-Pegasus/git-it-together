import React, { Component, PropTypes } from 'react';
import { ItemTypes } from './itemTypes';
import { DragSource } from 'react-dnd';

const deliverableSource = {
  beginDrag(props) {
    return {
      //deliverableId: props.deliverable.id
    };
  }
};
function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

class Deliverable extends Component {
  render() {
    const {
      connectDragSource,
      isDragging,
      deliverable,
      deleteDeliverable
    } = this.props;
    return connectDragSource(
      <tr>
        <th scope="row">{deliverable.id}</th>
        <td>{deliverable.task}</td>
        <td>{deliverable.owner}</td>
        <td>{deliverable.points}</td>
        <td><i className="fa fa-times right" aria-hidden="true" onClick={() => deleteDeliverable(deliverable.id)}></i></td>
      </tr>
    );
  }
}
Deliverable.PropTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  deliverable: PropTypes.object.isRequired,
  deleteDeliverable: PropTypes.func.isRequired
};
// const Deliverable = ({deliverable, deleteDeliverable}) => (
//   <tr>
//     <th scope="row">{deliverable.id}</th>
//     <td>{deliverable.task}</td>
//     <td>{deliverable.owner}</td>
//     <td>{deliverable.points}</td>
//     <td><i className="fa fa-times right" aria-hidden="true" onClick={() => deleteDeliverable(deliverable.id)}></i></td>
//   </tr>
// );
// exports.Deliverable = Deliverable;
// exports.deliverableSource = deliverableSource;
export default DragSource(ItemTypes.DELIVERABLE, deliverableSource, collect)(Deliverable);



