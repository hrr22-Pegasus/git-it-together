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


    eventStyleGetter(event, start, end, isSelected) {
      console.log("HERE IS THE EVENT", event.status);
      var today = moment().add(10, 'days').calendar();

      var eventStatus = event.status;
      var eventEndDate = event.end.getDate();
      var eventEndMonth = event.end.getMonth();
      var splitToday = today.toString().split('/');
      var todayMonth = splitToday[0]-1;
      var todayDate = splitToday[1];


      var custombackgroundColor = '#a641f4';

      if (eventStatus === "current") {
        custombackgroundColor = '#f4eb42';
        if (eventEndDate<todayDate && eventEndMonth<=todayMonth) {
          console.log("LATE");
          custombackgroundColor = '#cc0000';
        }
      }

      if (eventStatus === "icebox") {
        custombackgroundColor = '#00ffff';
      }

      if (eventStatus === "complete") {
        custombackgroundColor = '#1ca428';
      }

      if (eventStatus === "backlog") {
        custombackgroundColor = '#ffa500';
      }

      var style = {
        backgroundColor: custombackgroundColor,
        borderRadius: '0px',
        opacity: 0.8,
        color: 'black',
        border: '0px',
        display: 'block'
    };
    return {
        style: style
     };
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
            'end': new Date(year2, month2-1, day2),
            'status': deliverable.status
          };
        if (deliverable.status === 'complete') {
          deliverables.complete.push(deliverable);
        } else if (deliverable.status === 'backlog') {
          deliverables.backlog.push(deliverable);
        } else if (deliverable.status === 'icebox') {
          deliverables.icebox.push(deliverable);
        } else if (deliverable.status === 'current') {
          deliverables.current.push(deliverable);
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
        eventPropGetter={(this.eventStyleGetter)}
        // defaultDate={new Date(2017, 3, 31)}
      />
    )
  }
}

export default Schedule;