import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import Axios from 'axios'
import main_logo from './../assets/images/main-logo.png'
import { BASE_URL, validate_email, validate_username, validate_password } from '../helpers/helper'

class Subscribe extends Component {

    constructor(props) {
        super(props)
        this.state = {
            notif: null,
            email: "",
            username: "",
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

    on_subscribe = e => {
        e.preventDefault()

        if (this.state.email === "" || this.state.password === "" || this.state.username === "") {
            this.setState({ notif: { message: "Please Fill All The Fields.", type: "error" }, looking_for_user: false }, () => {
                setTimeout(() => { this.setState({ notif: null }) }, 1700)
            })
        } else {
            this.setState({ looking_for_user: true })

            if (validate_email(this.state.email)) {
                let password_validation = validate_password(this.state.password, { "lowercase": true, "uppercase": true, "numeric": true, "symboles": false })
                if (password_validation.lowercase && password_validation.numeric && password_validation.uppercase) {
                    if (validate_username(this.state.username)) {
                        Axios.post(BASE_URL + "/subscribe", { email: this.state.email, password: this.state.password, username: this.state.username })
                            .then(res => {
                                if (res.data) {
                                    this.setState({ notif: { message: "The User Created Successfully.", type: "success" }, looking_for_user: false }, () => {
                                        setTimeout(() => {
                                            this.setState({ notif: null })
                                            this.props.history.push("/")
                                        }, 1700)
                                    })
                                } else {
                                    this.setState({ notif: { message: "Email Already Exist.", type: "error" }, looking_for_user: false }, () => {
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
                        this.setState({ notif: { message: "Unvalid Username, It Must Contains Alpha-Numeric Only.", type: "error" }, looking_for_user: false }, () => {
                            setTimeout(() => { this.setState({ notif: null }) }, 1700)
                        })
                    }
                } else {
                    this.setState({ notif: { message: "Unvalid Password, It Must Contains Lowercase, Uppercase & Numbers.", type: "error" }, looking_for_user: false }, () => {
                        setTimeout(() => { this.setState({ notif: null }) }, 1700)
                    })
                }
            } else {
                this.setState({ notif: { message: "Unvalid Email.", type: "error" }, looking_for_user: false }, () => {
                    setTimeout(() => { this.setState({ notif: null }) }, 1700)
                })
            }
        }
    }

    render = () => {
        if (localStorage.getItem("token") || this.props.auth.logged) {
            return <Redirect to="/" />
        } else {
            return (<div className="subscribe-container">
                <div className="subscribe-logo">
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
                <div className="subscribe-form">
                    <form method="post">
                        <div className="subscribe-input">
                            <label htmlFor="email">Your email:</label>
                            <input id="email" className="subscribe-input" name="email" type="email" onChange={this.on_input_change} />
                        </div>
                        <div className="subscribe-input">
                            <label htmlFor="username">Your username:</label>
                            <input id="username" className="subscribe-input" name="username" type="text" onChange={this.on_input_change} />
                        </div>
                        <div className="subscribe-input">
                            <label htmlFor="password">Your password:</label>
                            <input id="password" className="subscribe-input" name="password" type="password" onChange={this.on_input_change} />
                        </div>
                        <div className="loading-user">
                            {this.state.looking_for_user ? <div className="loading"><span>.</span><span>.</span><span>.</span></div> : null}
                        </div>
                        <div className="subscribe-foot">
                            <Link to="/login">Sign In.</Link>
                            <button type="submit" onClick={this.on_subscribe} className="subscribe-button">Subscribe</button>
                        </div>
                    </form>
                </div>
            </div>)
        }
    }
}

const map_state_to_props = (store) => ({ ...store })

export default connect(map_state_to_props)(Subscribe)