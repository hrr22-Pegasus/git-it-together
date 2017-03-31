// Resources http://beatscodeandlife.ghost.io/react-socket-io-part-i-real-time-chat-application/
// http://danialk.github.io/blog/2013/06/16/reactjs-and-socket-dot-io-chat-application/

// Insert into outer componenet to render:   <DrawCanvas user={this.state.profile.nickname} room={this.state.}></DrawCanvas>

//TO DO: Set limit on number of messages to display

import React from 'react';
import ReactDom from 'react-dom';
var PropTypes = React.PropTypes;
var socket = io('/io/drawroom');
console.log(socket);

var DrawCanvas = React.createClass({
  propTypes: {
    brushColor: PropTypes.string,
    lineWidth: PropTypes.number,
    canvasStyle: PropTypes.shape({
      backgroundColor: PropTypes.string,
      cursor: PropTypes.string
    }),
    clear: PropTypes.bool
  },
  getDefaultProps() {
    return {
      brushColor: '#000000',
      lineWidth: 4,
      canvasStyle: {
        backgroundColor: '#FFFFFF',
        cursor: 'pointer'
      },
      clear: false
    };
  },
  getInitialState(){
    return {
      canvas: null,
      context: null,
      drawing: false,
      lastX: 0,
      lastY: 0,
      history: []
    };
  },
  componentDidMount(){
    var canvas = ReactDom.findDOMNode(this);

    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    var ctx = canvas.getContext('2d');

    this.setState({
      canvas: canvas,
      context: ctx
    });

    socket.on('init', this._initialize);
    socket.emit('room', 'DrawingRoom');
    socket.on('drawing', this._onDrawingEvent);

  },

  _onDrawingEvent: function(data){
    console.log("data from _onDrawingEvent", data);
    // var w = canvas.width;
    // var h = canvas.height;
    this.draw(data.lX, data.lY, data.cX, data.cY);
  },

  throttle: function(callback, delay) {
    var previousCall = new Date().getTime();
    return function() {
      var time = new Date().getTime();

      if ((time - previousCall) >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  },

  componentWillReceiveProps: function(nextProps) {
    if(nextProps.clear){
      this.resetCanvas();
    }
  },
  handleOnMouseDown(e){
    var rect = this.state.canvas.getBoundingClientRect();
    this.state.context.beginPath();
    if(this.isMobile()){
      this.setState({
        lastX: e.targetTouches[0].pageX - rect.left,
        lastY: e.targetTouches[0].pageY - rect.top
      });
    }
    else{
      this.setState({
        lastX: e.clientX - rect.left,
        lastY: e.clientY - rect.top
      });
    }

    this.setState({
      drawing: true
    });


    var w = this.state.context.canvas.width
    var h = this.state.context.canvas.height
    console.log("on mouse down event")

    // socket.emit('drawing', e)

  },
  handleOnMouseMove(e){

    if(this.state.drawing){
      var rect = this.state.canvas.getBoundingClientRect();
      var lastX = this.state.lastX;
      var lastY = this.state.lastY;
      var currentX;
      var currentY;
      if(this.isMobile()){
        currentX =  e.targetTouches[0].pageX - rect.left;
        currentY = e.targetTouches[0].pageY - rect.top;
      }
      else{
        currentX = e.clientX - rect.left;
        currentY = e.clientY - rect.top;
      }


      this.draw(lastX, lastY, currentX, currentY);
      this.setState({
        lastX: currentX,
        lastY: currentY
      });
    }
  },
  handleonMouseUp(){
    this.setState({
      drawing: false
    });
  },
  draw(lX, lY, cX, cY){
    console.log("drawing......")
    // console.log("lX: ", lX);
    // console.log("ly: ", lY);
    // console.log("cX: ", cX);
    // console.log("cy: ", cY);
    // console.log("emit: ", emit);


    this.state.context.strokeStyle = this.props.brushColor;
    this.state.context.lineWidth = this.props.lineWidth;
    this.state.context.moveTo(lX,lY);
    this.state.context.lineTo(cX,cY);
    this.state.context.stroke();


    socket.emit("drawing", {
      lX: lX,
      lY: lY,
      cX: cX,
      cY: cY

    })

  },
  resetCanvas(){
    var width = this.state.context.canvas.width;
    var height = this.state.context.canvas.height;
    this.state.context.clearRect(0, 0, width, height);
  },
  getDefaultStyle(){
    return {
      backgroundColor: '#FFFFFF',
      cursor: 'pointer'
    };
  },
  canvasStyle(){
    var defaults =  this.getDefaultStyle();
    var custom = this.props.canvasStyle;
    return Object.assign({}, defaults, custom);
  },
  isMobile(){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      return true;
    }
    return false;
  },
  render() {
    return (
      <canvas style = {this.canvasStyle()}
        onMouseDown = {this.handleOnMouseDown}
        onTouchStart = {this.handleOnMouseDown}
        onMouseMove = {this.handleOnMouseMove}
        onTouchMove = {this.handleOnMouseMove}
        onMouseUp = {this.handleonMouseUp}
        onTouchEnd = {this.handleonMouseUp}
      >
      </canvas>
    );
  }

});


module.exports = DrawCanvas;