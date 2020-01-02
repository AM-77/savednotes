import React, { Component } from 'react'

export default class NavBar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            search_all: false,
            username: "",
            password: "",
            repassword: "",
            show_profile_update: false
        }
    }

    onInputChange = e => {
        let name = e.target.name
        let value = e.target.value

        this.setState({ [name]: value })
    }

    onSearchChange = e => {
        this.props.search(e.target.value)
    }

    show_p_update = () => {
        this.setState({ show_profile_update: !this.state.show_profile_update })
    }

    render() {
        return (
            <div className="navbar-container">
                <div className='search'>
                    <span className="fa fa-search"></span>
                    <input type="text" name="search_for" onChange={this.onSearchChange} placeholder="Search" />
                </div>
                <div className='profile'>
                    <div className="user-pic"><span className="fa fa-user"></span></div>
                    <p className="user-name">{this.props.user.username}</p>
                    <button onClick={this.props.logout} title="Logout"><span className="fa fa-sign-out-alt"></span></button>
                </div>
            </div>
        )
    }
}
