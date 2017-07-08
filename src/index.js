import React from 'react';
import ReactDOM from 'react-dom';
import App from 'components/app';
import $ from "jquery";

ReactDOM.render(<h1 className="white-text text-center container-fluid">Getting Data From Server..</h1>, document.getElementById('app'))
$.getJSON('/getall',function(data)
{
  var characters = [];
  for(var i=0;i<data.length;i++)
  {
    characters.push(data[i]);
  }
  ReactDOM.render(<App toons={characters}/>, document.getElementById('app'));
});
