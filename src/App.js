import React, { Component } from 'react';

import {
  HashRouter as Router,
  Route
} from "react-router-dom";

import Home from './page/home';
import login_tty from './page/login_tty';
import lcxx1 from './page/lcxx1';
import lcxx2 from './page/lcxx2';
import lcxx3 from './page/lcxx3';
import lcxx4 from './page/lcxx4';
import lcxx5 from './page/lcxx5';
import Result from './page/result';

import './css/App.css';

class App extends Component {
  render() {
    return (
      <Router>
      <div>
         <Route path="/" exact component={Home} />
         <Route path="/login_tty"  component={login_tty} />
         <Route path="/lcxx1"  component={lcxx1} />
         <Route path="/lcxx2"  component={lcxx2} />
         <Route path="/lcxx3"  component={lcxx3} />
         <Route path="/lcxx4"  component={lcxx4} />
         <Route path="/lcxx5"  component={lcxx5} />
         <Route path="/result"  component={Result} />
      </div>
      </Router>
    );
  }
}

export default App;
