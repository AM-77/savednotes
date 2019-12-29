import React, { Component } from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import TheReducer from './reducers'

const store = createStore(TheReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

export default class ReduxStore extends Component {
    render = () => <Provider store={store}>{this.props.children}</Provider>
}