import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Login extends Component {
    render() {
        return (
            <div className="login-container">
                <div className="login-logo">
                    <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="The saved notes logo" />
                    <h2 className="title">Saved Notes</h2>
                </div>
                <div className="login-form">
                    <form>
                        <div className="login-input">
                            <label htmlFor="email">Your email</label>
                            <input id="email" className="login-input" name="email" type="email" onChange={this.onInputChange} />
                        </div>
                        <div className="login-input">
                            <label htmlFor="password">Your password</label>
                            <input id="password" className="login-input" name="password" type="password" onChange={this.onInputChange} />
                        </div>
                        <button type="submit" onClick={this.onLogin} className="login-button">Sign In</button>
                        <Link to="/subscribe">Subscribe now.</Link>
                    </form>
                </div>
            </div>
        )
    }
}
