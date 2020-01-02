import React, { Component } from 'react'
import savednotes_logo from '../assets/images/main-logo.png'

export default class Loading extends Component {
    render() {
        return (
            <div className="laoding-container">
                <div className="loading">
                    <div className="lds-spinner">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <img src={savednotes_logo} alt="saved notes logo" />
                    </div>
                </div>
            </div>
        )
    }
}
