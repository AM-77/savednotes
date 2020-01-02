import React, { Component } from 'react'

export default class NavBar extends Component {
    render() {
        return (
            <div className="navbar-container">
                <div className='search'>
                    <span className="fa fa-search"></span>
                    <input type="text" name="search_for" onChange={(e) => this.props.search(e.target.value)} placeholder="Search" />
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
