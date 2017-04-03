import React, { Component, PropTypes } from 'react';
import { ItemTypes } from './itemTypes';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import flow from 'lodash/flow';

const deliverableSource = {
  beginDrag(props) {
    //console.log('state from devSource', this.state);
    //console.log('props', props, 'id', props.id)
    //this.state.deliverables.splice(props.index, 1);
    return {
      id: props.id,
      currentDeliverable: props.deliverable,
      updateDeliverableStatus: props.updateDeliverableStatus,
      index: props.index
    };
  }

};

const deliverableTarget = {
  hover(props, monitor, component) {
    console.log('hover devComp', props)
    console.log('hover component', component)
    console.log('hover monitor', monitor.getItem());
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
//
class Deliverable extends Component {


  render() {
    const {
      connectDragSource,
      connectDropTarget,
      isDragging,
      deliverable,
      updateDeliverableStatus,
      deleteDeliverable
    } = this.props;
    //console.log('updateDeliverableStatus',updateDeliverableStatus);
    return connectDragSource(connectDropTarget(
      <tr>
        <th scope="row">{deliverable.id}</th>
        <td>{deliverable.task}</td>
        <td>{deliverable.owner}</td>
        <td>{deliverable.points}</td>
        <td>{deliverable.startDate.substring(0,10)}</td>
        <td>{deliverable.dueDate.substring(0,10)}</td>
        <td><i className="fa fa-times right" aria-hidden="true" onClick={() => deleteDeliverable(deliverable.id)}></i></td>
      </tr>
    ));
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
export default flow(
  DragSource(ItemTypes.DELIVERABLE, deliverableSource, collect),
  DropTarget(ItemTypes.DELIVERABLE, deliverableTarget, connect => ({connectDropTarget: connect.dropTarget()}))
  )(Deliverable);



