import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import ReduxStore from './redux-store'

import Subscribe from './components/Subscribe'
import Login from './components/Login'
import Home from './components/Home'
import Logged from './components/Logged'

export default class App extends Component {
    render() {
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
        )
    }
}
