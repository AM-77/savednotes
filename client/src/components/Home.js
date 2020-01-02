import React, { Component } from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import { logout } from '../redux-store/action-creators/authenticationActionCreator'
import NavBar from './NavBar'
import SideBar from './SideBar'
import Notes from './Notes'
import JoditEditor from 'jodit-react'

const BASE_URL = "http://localhost:3300/sn-api"

class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            found_notes: [],
            msg: "",
            note_title: "",
            note_content: "",
            note_privacy: false,
            note_archived: 0,
            editor_config: { readonly: true },
            adding_note: false,
            editing_note: false,
            showing_note: false,
            folder: "all"
        }
    }

    componentDidMount() {
        this.get_notes(this.state.folder)
    }

    search = (find) => {
        if (find === "") find = "*"
        Axios.get(BASE_URL + "/search/" + find, { headers: { authorization: "Bearer " + this.props.auth.token } })
            .then(res => this.setState({ found_notes: res.data.result, msg: res.data.result.length + " Note Was Found" }))
            .catch(err => console.log(err))

    }

    get_notes = (folder) => {
        this.setState({ folder, adding_note: false, editing_note: false, showing_note: false })
        Axios.get(BASE_URL + "/notes/" + folder + "/" + this.props.auth.user.id, { headers: { authorization: "Bearer " + this.props.auth.token } })
            .then(res => {
                this.setState({ found_notes: res.data, msg: "This message needs to be handeled" })
            })
            .catch(err => console.log(err))
    }

    add_new_note = () => this.setState({ adding_note: true, editor_config: { readonly: false }, editing_note: false, showing_note: false })

    note_title = e => this.setState({ note_title: e.target.value })

    note_privacy = e => this.setState({ note_privacy: e.target.checked ? "private" : "public" })

    note_archived = e => this.setState({ note_archived: e.target.checked ? 1 : 0 })

    save_note = () => {
        console.log(this.state)
        if (this.state.note_title !== "" && this.state.note_content !== "") {
            let new_note = {
                user_id: this.props.auth.user.id,
                title: this.state.note_title,
                content: this.state.note_content,
                privacy: this.state.note_privacy ? 'private' : 'public'
            }

            Axios.post(BASE_URL + "/note", new_note, { headers: { authorization: "Bearer " + this.props.auth.token } })
                .then(res => {
                    if (res.data.status === 200) {
                        this.setState({ adding_note: false, editing_note: false, showing_note: false }, () => this.get_notes(this.state.folder))
                    }
                })
                .catch(err => console.log(err))
        }
    }

    show_note = note => {
        this.setState({
            note_title: note.title,
            note_content: note.content,
            note_archived: note.archived,
            adding_note: false,
            editing_note: false,
            showing_note: true,
            editor_config: { readonly: true }
        })
    }

    update_note = note => {
        this.setState({
            updated_note_id: note.id,
            note_title: note.title,
            note_content: note.content,
            note_archived: note.archived,
            note_privacy: note.privacy,
            editing_note: true,
            showing_note: false,
            adding_note: false,
            editor_config: { readonly: false },
            note_last_update: note.last_update,
            note_created_at: note.created_at
        })
    }

    save_edited_note = () => {
        let new_note = {
            id: this.state.updated_note_id,
            title: this.state.note_title,
            content: this.state.note_content,
            archived: this.state.note_archived,
            privacy: this.state.note_privacy,
        }

        Axios.patch(BASE_URL + "/note", new_note, { headers: { authorization: "Bearer " + this.props.auth.token } })
            .then(res => this.get_notes(this.state.folder))
            .catch(err => console.log(err))

    }

    trash_note = (note_id, _trashed) => {
        let trashed = _trashed === 0 ? 1 : 0
        Axios.patch(BASE_URL + "/note/" + note_id, { trashed }, { headers: { authorization: "Bearer " + this.props.auth.token } })
            .then(res => this.get_notes(this.state.folder))
            .catch(err => console.log(err))
    }

    format_date = date => {
        let d = new Date(date);
        if (d.toString() !== "Invalid Date") return `${d.toLocaleDateString()}-${d.toLocaleTimeString()}`
        else return "Unknown Date"
    }
    logout = () => {
        this.props.logout()
        this.props.history.push("/login")
    }

    render() {
        return <div className="home-container">
            <div className="sidebar"><SideBar add_new_note={this.add_new_note} get_notes={this.get_notes} /></div>
            <div className="editor-container">
                <div className="navbar"><NavBar search={this.search} user={this.props.auth.user} logout={this.logout} /></div>
                <div className="notes-editor">
                    {
                        this.state.adding_note
                            ?
                            <div className="editing-note">
                                <div className="title">
                                    <h4>Creating New Note:</h4>
                                </div>
                                <div className="head">
                                    <div className="input-element">
                                        <label htmlFor="title">Title: </label>
                                        <input id="title" type="text" placeholder="Enter The Note Title" onChange={this.note_title} />
                                    </div>
                                    <div className="input-element">
                                        <label htmlFor="privacy">Private: </label>
                                        <input id="privacy" type="checkbox" onChange={this.note_privacy} defaultChecked={this.state.note_privacy === "private"} />
                                    </div>
                                </div>
                                <div className="body">
                                    <JoditEditor
                                        value={this.state.note_content}
                                        config={this.state.editor_config}
                                        onBlur={new_content => this.setState({ note_content: new_content })} />
                                </div>
                                <div className="foot">
                                    <button onClick={this.save_note}>Save Note</button>
                                </div>
                            </div>
                            :
                            this.state.editing_note
                                ?
                                <div className="editing-note">
                                    <div className="title">
                                        <h4>Editing Note:</h4>
                                    </div>
                                    <div className="head">
                                        <div className="input-element">
                                            <label htmlFor="title">Title: </label>
                                            <input id="title" type="text" placeholder="Enter The Note Title" onChange={this.note_title} defaultValue={this.state.note_title} />
                                        </div>
                                        <div className="input-element">
                                            <label htmlFor="privacy">Private: </label>
                                            <input id="privacy" type="checkbox" onChange={this.note_privacy} defaultChecked={this.state.note_privacy === "private"} />
                                        </div>
                                        <div className="input-element">
                                            <label htmlFor="archived">Archived: </label>
                                            <input id="archived" type="checkbox" onChange={this.note_archived} defaultChecked={this.state.note_archived === 1} />
                                        </div>
                                    </div>
                                    <div className="body">
                                        <JoditEditor
                                            value={this.state.note_content}
                                            config={this.state.editor_config}
                                            onBlur={new_content => this.setState({ note_content: new_content })} />
                                    </div>
                                    <div className="foot">
                                        <div className="infos">
                                            <p><span className="fa fa-clock"></span> <span className="title">Last update at:</span> {this.format_date(this.state.note_last_update)}</p>
                                        </div>
                                        <button onClick={this.save_edited_note}>Update Note</button>
                                    </div>
                                </div>
                                :
                                this.state.showing_note
                                    ?
                                    <div className="editing-note global-note">
                                        <div className="title">
                                            <h4>Global Note:</h4>
                                        </div>
                                        <div className="head">
                                            <div className="input-element">
                                                <label htmlFor="title">Title: </label>
                                                <input id="title" type="text" placeholder="Enter The Note Title" readOnly defaultValue={this.state.note_title} />
                                            </div>
                                        </div>
                                        <div className="body">
                                            <h4>Content: </h4>
                                            <JoditEditor value={this.state.note_content} config={this.state.editor_config} />
                                        </div>
                                        <div className="foot">
                                            <div className="infos">
                                                <p><span className="fa fa-clock"></span> <span className="title">Last update at:</span> {this.format_date(this.state.note_last_update)}</p>
                                                <p><span className="fa fa-clock"></span> <span className="title">Created at:</span> {this.format_date(this.state.note_created_at)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <Notes
                                        add_new_note={this.add_new_note}
                                        msg={this.state.msg}
                                        notes={this.state.found_notes}
                                        update_note={this.update_note}
                                        show_note={this.show_note}
                                        user_id={this.props.auth.user.id}
                                        trash_note={this.trash_note}
                                    />

                    }
                </div>
            </div>
        </div>
    }
}

const mapStateToProps = (store) => ({ ...store })
const dispatchStateToProps = (dispatch) => {
    return {
        logout: () => dispatch(logout())
    }
}
export default connect(mapStateToProps, dispatchStateToProps)(Home)