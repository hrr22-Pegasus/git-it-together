import React, { Component, PropTypes } from 'react';
import { ItemTypes } from './itemTypes';
import { DragSource, DropTarget } from 'react-dnd';

const deliverableSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index
    };
  }

};

const deliverableTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }
    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    // Determine mouse position
    const clientOffset = monitor.getClientOffset();
    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;
    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }
    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }
    // Time to actually perform the action
    props.moveDeliverable(dragIndex, hoverIndex);
    monitor.getItem().index = hoverIndex;
  },
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
        <td>{deliverable.startDate.substring(0,10)}</td>
        <td>{deliverable.dueDate.substring(0,10)}</td>
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



