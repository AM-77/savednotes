import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import Subscribe from './components/Subscribe'
import Login from './components/Login'
import Home from './components/Home'

export default class App extends Component {
    render() {
        return (
            <div className="app-container">
                <Router>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/login" component={Login} />
                        <Route path="/subscribe" component={Subscribe} />
                        <Redirect to="/" />
                    </Switch>
                </Router>
            </div>
        )
    }
}
