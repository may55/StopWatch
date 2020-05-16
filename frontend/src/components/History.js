import React, { Component } from 'react';

class History extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      history: [],
    }
  }
  
 
  formatter = (input) => {
    if(input===undefined){
      return '';
    }
    const time = input.toString();
    return time.length < 2 ? '0' + time : time.slice(-2);
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

  render(){
    let {history} = this.props;
    return (
      <div className="history">
          {history && history.length>0 ? (
            <h1>History</h1>
            )
            : <span> </span>
          }
          {
            history &&
            history.length > 0 ?
                (                  
                  history.map(his => {
                    return (
                      <div key={his._id}>
                      
                     <span>Total Time: {this.giveMinutes(his.timePassed)}- 
                                                          {this.giveSeconds(his.timePassed)} - 
                                                          {this.giveMilli(his.timePassed)}
                                                          </span>
                      
                        </div>
                    )  
                  })
                 
                )
                :
                (
                  <span> </span>
                )
          }
                 
      </div>
    )
  };
}

export default History;