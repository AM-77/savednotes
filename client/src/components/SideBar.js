import React, { Component } from 'react'
import savednotes_logo from '../assets/images/logo.png'

export default class SideBar extends Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    active_folder = folder_name => {
        let folders = document.querySelectorAll(".folder")
        let clicked_folder = document.querySelector(".folder." + folder_name)

        if (!clicked_folder.classList.contains("active")) {
            folders.forEach(folder => { if (folder.classList.contains("active")) { folder.classList.remove("active") } })
            clicked_folder.classList.add("active")
            this.props.get_notes(folder_name)
        }
    }

    add_note = () => {
        this.active_folder("add-new")
        this.props.add_new_note()
    }

    render() {
        return (
            <div className="sidebar-container">
                <div className="logo">
                    <div className="logo-img"><img src={savednotes_logo} alt="Savednotes logo" /></div>
                    <div className="logo-name"><span>Savednotes</span></div>
                </div>
                <div className="folders">
                    <button onClick={() => this.active_folder("all")} className="folder all active"><span className="fa fa-globe"></span> Public Notes</button>
                    <div className="divider"></div>
                    <button onClick={() => this.active_folder("my_all")} className="folder my_all"><span className="fa fa-sticky-note"></span> My Notes</button>
                    <button onClick={() => this.active_folder("public")} className="folder public"><span className="fa fa-unlock"></span> My Public Notes</button>
                    <button onClick={() => this.active_folder("private")} className="folder private"><span className="fa fa-lock"></span> My Private Notes</button>
                    <button onClick={() => this.active_folder("archived")} className="folder archived"><span className="fa fa-archive"></span> My Archived Notes</button>
                    <button onClick={() => this.active_folder("trashed")} className="folder trashed"><span className="fa fa-trash"></span> My Trashed Notes</button>
                    <button onClick={this.add_note} className="folder add-new"><span className="fa fa-plus"></span> Add New Note</button>
                    <div className="divider"></div>
                </div>

            </div>)
    }
}
