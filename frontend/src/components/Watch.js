import React, { Component } from 'react';
import axios from 'axios';
import History from './History';

class Watch extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      started: false,
      isPaused: false,
      isStop: false,
      timePassed: 0,
      milliseconds: '00',
      seconds: '00',
      minutes: '00',
      laps : [],
      history : [],
    }
  }

  delHistory = () => {
    axios.delete('/api/watch')
    .then(res => {
        this.getHistory()
      }
      )
  }

  getHistory = (data) => {
    axios.get('/api/watch')
      .then(res => {
        if(res.data){
          this.setState({
            history: res.data,
          })
        }
      })
      .catch(err => console.log(err))
  }

  postTime = () => {
    const task = {  timePassed: this.state.timePassed,
                    laps: this.state.laps,
                }
    if(task.timePassed && task.timePassed > 0){
      axios.post('/api/watch', task)
        .then(res => {
          if(res.data){
            console.log("Written to database")
          }
        })
        .catch(err => console.log(err))
    }else {
      console.log('Time is zero')
    }
  }

  formatter = (input) => {
    const time = input.toString();
    return time.length < 2 ? '0' + time : time.slice(-2);
  }

  formatTime = () => {
    this.setState({
      milliseconds: this.formatter(this.state.timePassed),
      seconds: this.formatter(Math.floor((this.state.timePassed / 100) % 60)),
      minutes: this.formatter(Math.floor((this.state.timePassed / (100 * 60)) % 60))
    });
  }

  giveSeconds = (lapTimePassed) => {
    return this.formatter(Math.floor((lapTimePassed / 100) % 60));
  }

  giveMinutes = (lapTimePassed) => {
    return this.formatter(Math.floor((lapTimePassed / (100 * 60)) % 60));
  }

  giveMilli = (lapTimePassed) => {
    return this.formatter(lapTimePassed);
  }

  timeNow = () => {
    let seconds = parseInt(this.state.timePassed, 10) + 1;
    this.setState({ timePassed: seconds });
    this.formatTime();
  }

  resetTime = () => {
    window.clearInterval(this.interval);
    this.setState({
      timePassed: 0,
      milliseconds: '00',
      seconds: '00',
      minutes: '00',
      isStop: false,
      started: false,
      isPaused: false,
      laps: [],
    });
  }

  startTime = () => {
    if(this.state.isStop){ return; }
    if(this.state.isPaused === false && this.state.started === true){ return; }
    this.interval = setInterval(this.timeNow, 10);
    this.setState({ started: true,
                    isPaused: false,  
    });
  }

  lapTime = () => {
    if(this.state.started===false || this.state.pauseTime===true || this.state.isStop===true){return;}
    let currLap = this.state.laps;
    currLap.push(this.state.timePassed);
    this.setState({
      laps: currLap,
    });
    console.log(this.state.laps);
  }

  pauseTime = () => {
    if(this.state.isStop===true){return;}
    window.clearInterval(this.interval);
    this.setState({ isPaused: true });
  }

  stopTime = () => {
    this.postTime();
    this.getHistory();
    window.clearInterval(this.interval);
    this.setState({ started: false,
                    isStop: true,            
    });
  }

  componentDidMount(){
    this.getHistory();
  }

  componentWillUnmount = () => {
    window.clearInterval(this.interval);
  }

  render(){
    let {laps} = this.state;
    return (
      <div className="watch">
        <div className="stopwatch">
          <div className="stopwatch__screen">
            {this.state.minutes}<span className="stopwatch__colon">:</span>
            {this.state.seconds}<span className="stopwatch__colon">:</span>
            {this.state.milliseconds}</div>
          <div className="stopwatch__button" onClick={ this.startTime.bind(this) }>Start</div>
          <div className="stopwatch__button" onClick={ this.pauseTime.bind(this) }>Pause</div>
          <div className="stopwatch__button" onClick={ this.stopTime.bind(this) }>Stop</div>
          <div className="stopwatch__button" onClick={ this.resetTime.bind(this) }>Reset</div>
          <div className="stopwatch__button" onClick={ this.lapTime.bind(this) }>Lap</div>
        </div>
        <div className="laps">
          {laps.length > 0 ? laps.map((lapTimePassed,index)=>{
            return  (
            <span className="stopwatch__lap">Lap {index+1} : 
              {this.giveMinutes(lapTimePassed)}MM- 
              {this.giveSeconds(lapTimePassed)}SS - 
              {this.giveMilli(lapTimePassed)}mS
            </span>
              )
          })  : ""} 
        </div>
        {this.state.history===undefined && this.state.history.length===0 ?
          this.getHistory()
          : ""
        }
        <History history={this.state.history}/>
        
      </div>
    )
  };
}

export default Watch;