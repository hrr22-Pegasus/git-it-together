import React from 'react';
import { ItemTypes } from './itemTypes';
import { DragSource } from 'react-dnd';

const deliverableSource = {
  beginDrag(props) {
    return {
      deliverableId: props.deliverable.id
    };
  }
};
function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}
const Deliverable = ({deliverable, deleteDeliverable}) => (
  <tr>
    <th scope="row">{deliverable.id}</th>
    <td>{deliverable.task}</td>
    <td>{deliverable.owner}</td>
    <td>{deliverable.points}</td>
    <td><i className="fa fa-times right" aria-hidden="true" onClick={() => deleteDeliverable(deliverable.id)}></i></td>
  </tr>
);
exports.Deliverable = Deliverable;
exports.deliverableSource = deliverableSource;