import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import Axios from 'axios'
import Loading from './Loading'
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
                return <Loading />
            } else {
                return <Redirect to="/login" />
            }
        }
    }
}

const map_state_to_props = (store) => ({ ...store })
const dispatch_state_to_props = (dispatch) => ({
    load_user: (token, user) => dispatch(load_user(token, user)),
    logout: () => dispatch(logout())
})

export default connect(map_state_to_props, dispatch_state_to_props)(Logged)