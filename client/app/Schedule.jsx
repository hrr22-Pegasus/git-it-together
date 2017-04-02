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
        this.state = {project: props.project, deliverables: null};
        this.state.events = [{
    'title': "Jesse's Birthday",
    'start': new Date(2017, 2, 31),
    'end': new Date(2017, 2, 31)
  }];

        this.getDeliverables();
        console.log(this.state.deliverables);
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
      deliverables.dates = [];
      response.data.forEach(function(deliverable) {
        if (deliverable.status === 'complete') {
          deliverables.complete.push(deliverable);
        } else if (deliverable.status === 'backlog') {
          deliverables.backlog.push(deliverable);
        } else if (deliverable.status === 'icebox') {
          deliverables.icebox.push(deliverable);
        } else if (deliverable.status === 'current') {
          deliverables.current.push(deliverable);

          // var year = deliverables.current.startDate.substring(0,4);
          // var day = deliverables.current.startDate.substring(5,7);
          // var month = deliverables.current.startDate.substring(8,10);

          // console.log("Here samy!", year, day, month);


        }
      });
      context.forceUpdate();
    });
  }



  render(){
    return (
      <BigCalendar
        {...this.props}
        events={this.state.events}
        // defaultDate={new Date(2017, 3, 31)}
      />
    )
  }
}

export default Schedule;