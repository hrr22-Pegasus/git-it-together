import React from 'react';
import BigCalendar from 'react-big-calendar';
// import events from './events.jsx';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'

BigCalendar.setLocalizer(
  BigCalendar.momentLocalizer(moment)
);


// console.log(this.props.project);

class Schedule extends React.Component {
  constructor(props){
        super(props);
        console.log("Here is the project", props.project);
        this.state = {project: props.project, deliverables: {
          dates:[{
            'title': "Jesse's Birthday",
            'start': new Date(2017, 2, 31),
            'end': new Date(2017, 2, 31)
          }]
        }};


        this.getDeliverables();
    }

    getDeliverables(cb) {
    var context = this;
    var project = this.state.project;
    axios.get('/api/deliverables?id=' + project.id)
    .then(function(response) {
      context.state.deliverables = {};
      var deliverables = context.state.deliverables;
      deliverables.current = [];
      deliverables.backlog = [];
      deliverables.icebox = [];
      deliverables.complete = [];
      deliverables.dates = [{
    'title': "Jesse's Birthday",
    'start': new Date(2017, 2, 31),
    'end': new Date(2017, 2, 31)
  }]
    var events = [];
      response.data.forEach(function(deliverable) {
        if (deliverable.status === 'complete') {
          deliverables.complete.push(deliverable);
        } else if (deliverable.status === 'backlog') {
          deliverables.backlog.push(deliverable);
        } else if (deliverable.status === 'icebox') {
          deliverables.icebox.push(deliverable);
        } else if (deliverable.status === 'current') {
          deliverables.current.push(deliverable);
          var title = deliverable.task + "-" + deliverable.owner;
          var year = parseInt(deliverable.startDate.substring(0,4));
          var month = parseInt(deliverable.startDate.substring(5,7));
          var day = parseInt(deliverable.startDate.substring(8,10));
          var year2 = parseInt(deliverable.dueDate.substring(0,4));
          var month2 = parseInt(deliverable.dueDate.substring(5,7));
          var day2 = parseInt(deliverable.dueDate.substring(8,10));
          var eventToPush = {
            'title': title,
            'start': new Date(year, month-1, day),
            'end': new Date(year2, month2-1, day2)
          };
        }
          deliverables.dates.push(eventToPush);
          // console.log(eventToPush);
      });
      context.forceUpdate();
    });
  }

  render(){
    return (
      <BigCalendar
        {...this.props}
        events={this.state.deliverables.dates}
        // defaultDate={new Date(2017, 3, 31)}
      />
    )
  }
}

export default Schedule;