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
    lineWidth: PropTypes.number,
    canvasStyle: PropTypes.shape({
      backgroundColor: PropTypes.string,
      cursor: PropTypes.string
    }),
    clear: PropTypes.bool
  },
  getDefaultProps() {
    return {
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
      history: [],
      brushColor: '#0000ff'
    };
  },

  handleOnClickChangeColorYellow() {
    console.log("coming in brush color: ", this.props.brushColor)

    this.setState({
      brushColor: '#FFFF00',
      clear: false
    });
    // this.props.brushColor = '#FFFF00'

    console.log("setting color to yellow")
    console.log("State: ", this.state);
    console.log("Props: ", this.props);

  },

  handleOnClickChangeColorBlack() {

    console.log("coming in brush color: ", this.props.brushColor)

    this.setState({
      brushColor: '#000000',
      clear: false
    });
    // this.props.brushColor = '#000000'

    console.log("setting color to black")
    console.log("State: ", this.state);
    console.log("Props: ", this.props);
  },

  componentDidMount(){
    // var canvas = ReactDom.findDOMNode(this);
    var canvas = this.refs.canvas;
    console.log("canvas", canvas)
    console.log("this...being used as canvase", this);

    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    var ctx = canvas.getContext('2d');
    console.log("ctx", ctx.getImageData(0,0, canvas.width, canvas.height));



    console.log("canvas width", canvas.width);
    console.log("canvas height", canvas.height);
    //getImageData(x,y,width,height);

    this.setState({
      canvas: canvas,
      context: ctx
    });
    console.log("Initialized prios: ", this.props);
    console.log("Initialized state: ", this.state);
    console.log("Initialized canvas: ", canvas);
    console.log("Initialized context: ", ctx);

    socket.on('init', this._initialize);
    socket.emit('room', 'DrawingRoom');
    socket.on('drawing', this._onDrawingEvent);

  },

  _onDrawingEvent: function(data){
    console.log("data from _onDrawingEvent", data);
    // var w = canvas.width;
    // var h = canvas.height;
    var w = this.state.context.canvas.width
    var h = this.state.context.canvas.height
    this.draw(data.lX*w, data.lY*h, data.cX*w, data.cY*h, data.brushColor);
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

    console.log("on mouse down event")


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


      this.draw(lastX, lastY, currentX, currentY, this.state.brushColor, true);
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
  draw(lX, lY, cX, cY, brushColor, emit){
    console.log("drawing......")

    // this.state.context = {
    //   strokeStyle: "blue",
    //   lineWidth: "3px",
    // }

    this.state.context.strokeStyle = brushColor;
    this.state.context.lineWidth = this.props.lineWidth;
    this.state.context.moveTo(lX,lY);
    this.state.context.lineTo(cX,cY);
    this.state.context.stroke();

    if (!emit) {
      console.log("no emit... exiting draw function without emitting")
      return;
    }

    var w = this.state.context.canvas.width
    var h = this.state.context.canvas.height
    socket.emit("drawing", {
      lX: lX/w,
      lY: lY/h,
      cX: cX/w,
      cY: cY/h,
      brushColor: this.state.brushColor
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
      <div>
        <h2>Drawing Canvas </h2>
        <div className='button-bar'>
          <button onClick={this.handleOnClickChangeColorYellow}>Set color to yellow</button>
          <button onClick={this.handleOnClickChangeColorBlack}>Set color to black</button>
        </div>


        <canvas ref='canvas'
          style = {this.canvasStyle()}
          onMouseDown = {this.handleOnMouseDown}
          onTouchStart = {this.handleOnMouseDown}
          onMouseMove = {this.handleOnMouseMove}
          onTouchMove = {this.handleOnMouseMove}
          onMouseUp = {this.handleonMouseUp}
          onTouchEnd = {this.handleonMouseUp}
        >
        </canvas>
      </div>
    );
  }

});


module.exports = DrawCanvas;