import React from 'react';

const Flashmessages = (props) => {
    return (
        <div className="container floating-alerts ">
          {props.messages.map((msg, index) => {
            return (
              <div key={index} className="alert alert-success text-center floating-alert shadow-sm tp">
                {msg}
              </div>
            )
          })}
        </div>
      )
    }
    

export default Flashmessages;
