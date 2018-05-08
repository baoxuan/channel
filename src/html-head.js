import React, { Component } from 'react';
import { Helmet } from 'react-helmet';

class _Header extends Component {
  render(){
    return(
      <div>
        <Helmet>
          <meta charSet="utf-8"/>
          <meta name="theme-color" content="#000000"/>
        </Helmet>
      </div>
      )
  }
}

export default _Header;