import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import ReduxStore from './redux-store';

import Subscribe from './pages/Subscribe';
import Login from './pages/Login';
import Home from './pages/Home';
import Logged from './components/Logged';

export default function App() {
  return (
    <ReduxStore>
      <div className="app-container">
        <Router>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/subscribe" component={Subscribe} />
            <Logged>
              <Route exact path="/" component={Home} />
              <Redirect to="/" />
            </Logged>
          </Switch>
        </Router>
      </div>
    </ReduxStore>
  );
}
