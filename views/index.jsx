import React from 'react';

export default class DefaultLayout extends React.Component {
  render () {
    return (
      <html>
        <head>
          <title>Photographer Referral</title>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" />
          <link rel="stylesheet" href="/static/style.css"/>
        </head>
        <body>
        	<div id="app" dangerouslySetInnerHTML={{__html: this.props.content}}></div>
          <script src="http://localhost:8080/js/app.js"/>
        </body>
      </html>
    );
  }	
}