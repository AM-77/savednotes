import React, { Component } from 'react'

export default class Message extends Component {
    render() {
        return (
            <div className={`message-container ${this.props.type}`}>
                <p>{this.props.content}</p>
            </div>
        )
    }
}
