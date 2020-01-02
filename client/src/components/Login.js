import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import Axios from 'axios'
import { login } from './../redux-store/action-creators/authenticationActionCreator'
import main_logo from './../assets/images/main-logo.png'
import { BASE_URL, validate_email } from '../helpers/helper'

class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            notif: null,
            email: "",
            password: "",
            logged: false,
            looking_for_user: false
        }
    }

    on_input_change = e => {
        let name = e.target.name
        let value = e.target.value
        this.setState(({ [name]: value }))
    }

    on_login = e => {
        e.preventDefault()

        if (this.state.email === "" || this.state.password === "") {
            this.setState({ notif: { message: "Please Enter Your Email & Password.", type: "error" }, looking_for_user: false }, () => {
                setTimeout(() => { this.setState({ notif: null }) }, 1700)
            })
        } else {
            this.setState({ looking_for_user: true })
            if (validate_email(this.state.email)) {
                Axios.post(BASE_URL + "/login", { email: this.state.email, password: this.state.password })
                    .then(res => {
                        if (res.data) {
                            this.props.login(res.data.token, res.data.user)
                            localStorage.setItem("token", res.data.token)
                            this.setState({ logged: true })
                        } else {
                            this.setState({ notif: { message: "User Does Not Exist.", type: "error" }, looking_for_user: false }, () => {
                                setTimeout(() => { this.setState({ notif: null }) }, 1700)
                            })
                        }
                    })
                    .catch(err => {
                        this.setState({ notif: { message: err.response.data.message, type: "error" }, looking_for_user: false }, () => {
                            setTimeout(() => { this.setState({ notif: null }) }, 1700)
                        })
                    })
            } else {
                this.setState({ notif: { message: "Please Enter A Valid Email.", type: "error" }, looking_for_user: false }, () => {
                    setTimeout(() => { this.setState({ notif: null }) }, 1700)
                })
            }
        }
    }

    render = () => {
        if (localStorage.getItem("token") || this.props.auth.logged) {
            return <Redirect to="/" />
        } else {
            return (<div className="login-container">
                <div className="login-logo">
                    <img src={main_logo} alt="The saved notes logo" />
                    <h2 className="title">Saved Notes</h2>
                </div>
                {
                    this.state.notif ?
                        <div className={`notify-user ${this.state.notif.type}`}>
                            <p>{this.state.notif.message}</p>
                        </div>
                        :
                        null
                }
                <div className="login-form">
                    <form method="post">
                        <div className="login-input">
                            <label htmlFor="email">Your email:</label>
                            <input id="email" className="login-input" name="email" type="email" onChange={this.on_input_change} />
                        </div>
                        <div className="login-input">
                            <label htmlFor="password">Your password:</label>
                            <input id="password" className="login-input" name="password" type="password" onChange={this.on_input_change} />
                        </div>
                        <div className="loading-user">
                            {this.state.looking_for_user ? <div className="loading"><span>.</span><span>.</span><span>.</span></div> : null}
                        </div>
                        <div className="login-foot">
                            <Link to="/subscribe">Subscribe now.</Link>
                            <button type="submit" onClick={this.on_login} className="login-button">Sign In</button>
                        </div>
                    </form>
                </div>
            </div>)
        }
    }
}

const map_state_to_props = (store) => ({ ...store })
const dispatch_state_to_props = (dispatch) => ({
    login: (token, user) => dispatch(login(token, user))
})

export default connect(map_state_to_props, dispatch_state_to_props)(Login)