import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import Axios from 'axios'
import { load_user, logout } from './../redux-store/action-creators/authenticationActionCreator'

const token = localStorage.getItem("token")

class Logged extends Component {
    render() {
        if (this.props.auth.user) {
            return <React.Fragment>{this.props.children}</React.Fragment>
        } else {
            if (token) {
                Axios.get("http://localhost:3300/sn-api/user", { headers: { authorization: "Bearer " + token } })
                    .then(res => { this.props.load_user(token, res.data.result) })
                    .catch(err => {
                        this.props.logout()
                        return <Redirect to="/login" />
                    })
                return <p>loading ...</p>
            } else {
                return <Redirect to="/login" />
            }
        }
    }
}

const mapStateToProps = (store) => ({ ...store })
const dispatchStateToProps = (dispatch) => ({
    load_user: (token, user) => dispatch(load_user(token, user)),
    logout: () => dispatch(logout())
})

export default connect(mapStateToProps, dispatchStateToProps)(Logged)