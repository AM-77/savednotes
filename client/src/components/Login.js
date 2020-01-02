import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import Axios from 'axios'
import { login } from './../redux-store/action-creators/authenticationActionCreator'
import Message from './Message'

import { BASE_URL } from '../helpers/helper'

class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            message: null,
            email: null,
            password: null,
            logged: false,
            looking_for_user: false
        }
    }

    onInputChange = e => {
        let name = e.target.name
        let value = e.target.value
        this.setState(({ [name]: value }))
    }

    onLogin = e => {
        e.preventDefault()

        // Do some inputs validations

        if (this.state.email === "" || this.state.password === "") {
            this.show_message({ type: "error", content: "Please Enter Your Email & Password." })
        } else {
            this.setState({ looking_for_user: true })
            Axios.post(BASE_URL + "/login", { email: this.state.email, password: this.state.password })
                .then(res => {
                    if (res.data) {
                        this.props.login(res.data.token, res.data.user)
                        localStorage.setItem("token", res.data.token)
                        this.setState({ logged: true })
                    } else {
                        this.show_message({ type: "error", content: "User Does Not Exist. Please Create An Account, and Retry." })
                    }
                })
                .catch(err => this.show_message({ type: "error", content: err.message }))
        }
    }

    show_message = message => this.setState(({ message }), () => { setTimeout(() => { this.setState(({ message: null })) }, 3000) })


    render = () => {
        console.log(this.props)
        if (localStorage.getItem("token") || this.props.auth.logged) {
            return <Redirect to="/" />
        } else {
            return (<div className="login-container">
                <div className="login-logo">
                    <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="The saved notes logo" />
                    <h2 className="title">Saved Notes</h2>
                </div>
                <div className="login-form">
                    <form method="post">
                        {this.state.message ? <Message {...this.state.message} /> : null}
                        <div className="login-input">
                            <label htmlFor="email">Your email</label>
                            <input id="email" className="login-input" name="email" type="email" onChange={this.onInputChange} />
                        </div>
                        <div className="login-input">
                            <label htmlFor="password">Your password</label>
                            <input id="password" className="login-input" name="password" type="password" onChange={this.onInputChange} />
                            {this.state.looking_for_user ? <div>loading ...</div> : null}
                        </div>
                        <button type="submit" onClick={this.onLogin} className="login-button">Sign In</button>
                        <Link to="/subscribe">Subscribe now.</Link>
                    </form>
                </div>
            </div>)
        }
    }
}

const mapStateToProps = (store) => ({ ...store })
const dispatchStateToProps = (dispatch) => ({
    login: (token, user) => dispatch(login(token, user))
})

export default connect(mapStateToProps, dispatchStateToProps)(Login)