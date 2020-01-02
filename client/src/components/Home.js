import React, { Component } from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import { logout } from '../redux-store/action-creators/authenticationActionCreator'
import NavBar from './NavBar'
import SideBar from './SideBar'
import Notes from './Notes'
import AddingNewNote from './AddNote'
import EditingNote from './EditNote'
import DisplayNote from './DisplayNote'

const BASE_URL = "http://localhost:3300/sn-api"

class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            found_notes: [],
            folder: "all"
        }
    }

    componentDidMount() {
        this.get_notes(this.state.folder)
    }

    search = (find) => {
        if (find === "") find = "*"
        Axios.get(BASE_URL + "/search/" + find, { headers: { authorization: "Bearer " + this.props.auth.token } })
            .then(res => this.setState({ found_notes: res.data.result }))
            .catch(err => console.log(err))

    }

    get_notes = (folder) => {
        this.setState({ folder, display: "notes" })
        Axios.get(BASE_URL + "/notes/" + folder + "/" + this.props.auth.user.id, { headers: { authorization: "Bearer " + this.props.auth.token } })
            .then(res => {
                this.setState({ found_notes: res.data, folder })
            })
            .catch(err => console.log(err))
    }

    add_new_note = () => this.setState({ display: "add_new" })

    show_note = note => this.setState({ note, display: "show_note" })

    update_note = note_to_update => this.setState({ note_to_update, display: "edit_note" })


    save_note = (note) => {
        if (note.note_title !== "" && note.note_content !== "") {
            let new_note = {
                user_id: this.props.auth.user.id,
                title: note.note_title,
                content: note.note_content,
                privacy: note.note_privacy ? 'private' : 'public'
            }

            Axios.post(BASE_URL + "/note", new_note, { headers: { authorization: "Bearer " + this.props.auth.token } })
                .then(res => {
                    if (res.status === 200) {
                        this.setState({ display: "notes", notif: { message: "The New Note Has Been Added Successfully.", type: "success" } }, () => {
                            this.get_notes(this.state.folder)
                            setTimeout(() => { this.setState({ notif: null }) }, 1700)
                        })
                    }
                })
                .catch(err => this.setState({ notif: { message: "An Error Occured While Adding The New Note.", type: "error" } }, () => {
                    setTimeout(() => { this.setState({ notif: null }) }, 1700)
                }))
        } else {
            this.setState({ notif: { message: "Please Fill Empty Fields.", type: "error" } }, () => {
                setTimeout(() => { this.setState({ notif: null }) }, 1700)
            })
        }
    }

    save_edited_note = (edited_note) => {
        Axios.patch(BASE_URL + "/note", edited_note, { headers: { authorization: "Bearer " + this.props.auth.token } })
            .then(res => {
                this.setState({ notif: { message: "The Note Has Been Updated Successfully.", type: "success" } }, () => {
                    setTimeout(() => { this.setState({ notif: null }) }, 1700)
                })
                this.get_notes(this.state.folder)
            })
            .catch(err => this.setState({ notif: { message: "An Error Occured While Updating The Note.", type: "error" } }, () => {
                setTimeout(() => { this.setState({ notif: null }) }, 1700)
            }))
    }

    trash_note = (note_id, _trashed) => {
        let trashed = 0
        _trashed === 0 ? trashed = 1 : trashed = 0

        Axios.patch(BASE_URL + "/note/" + note_id, { trashed }, { headers: { authorization: "Bearer " + this.props.auth.token } })
            .then(res => {
                this.setState({ notif: { message: `The Note Has Been ${trashed === 1 ? "Trashed" : "Restored"} Successfully.`, type: "success" } }, () => {
                    setTimeout(() => { this.setState({ notif: null }) }, 1700)
                })
                this.get_notes(this.state.folder)
            })
            .catch(err => this.setState({ notif: { message: "An Error Occured While Trashing The Note.", type: "error" } }, () => {
                setTimeout(() => { this.setState({ notif: null }) }, 1700)
            }))
    }

    logout = () => {
        this.props.logout()
        this.props.history.push("/login")
    }

    return_back = (folder) => {
        if (folder === "add-new") this.setState({ folder: "all" }, () => this.get_notes(this.state.folder))
        else this.get_notes(this.state.folder)
    }

    render() {
        return <div className="home-container">
            <div className="sidebar"><SideBar add_new_note={this.add_new_note} get_notes={this.get_notes} /></div>
            <div className="editor-container">
                <div className="navbar"><NavBar search={this.search} user={this.props.auth.user} logout={this.logout} /></div>
                <div className="notes-editor">
                    {
                        this.state.notif ?
                            <div className={`notify-user ${this.state.notif.type}`}>
                                <p>{this.state.notif.message}</p>
                            </div>
                            :
                            null
                    }
                    {
                        this.state.display === "add_new" ?
                            <AddingNewNote
                                save_note={this.save_note}
                                return_back={this.return_back}
                            />
                            : this.state.display === "edit_note"
                                ?
                                <EditingNote
                                    note={this.state.note_to_update}
                                    save_edited_note={this.save_edited_note}
                                    return_back={this.return_back}
                                />
                                : this.state.display === "show_note"
                                    ?
                                    <DisplayNote
                                        note={this.state.note}
                                        return_back={this.return_back}
                                    />
                                    : <Notes
                                        add_new_note={this.add_new_note}
                                        folder={this.state.folder}
                                        notes={this.state.found_notes}
                                        update_note={this.update_note}
                                        show_note={this.show_note}
                                        user_id={this.props.auth.user.id}
                                        trash_note={this.trash_note}
                                        return_back={this.return_back}
                                    />

                    }
                </div>
            </div>
        </div>
    }
}

const map_state_to_props = (store) => ({ ...store })
const dispatch_state_to_props = (dispatch) => ({
    logout: () => dispatch(logout())
})

export default connect(map_state_to_props, dispatch_state_to_props)(Home)