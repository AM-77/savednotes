import React, { Component } from 'react'
import JoditEditor from 'jodit-react'
import { format_date } from './../helpers/helper'
export default class EditingNote extends Component {

    constructor(props) {
        super(props)
        this.state = {
            note_title: this.props.note.title,
            note_privacy: this.props.note.privacy,
            note_archived: this.props.note.archived,
            note_content: this.props.note.content
        }
    }

    on_input_change = e => {
        let name = e.target.name, value

        if (name === 'note_privacy') e.target.checked ? value = "private" : value = "public"
        else
            if (name === 'note_archived') e.target.checked ? value = "1" : value = "0"
            else value = e.target.value

        this.setState({ [name]: value })
    }

    save_edited_note = () => {
        this.props.save_edited_note({
            id: this.props.note.id,
            title: this.state.note_title,
            privacy: this.state.note_privacy,
            archived: this.state.note_archived,
            content: this.state.note_content
        })
    }

    render() {
        return (
            <React.Fragment>
                <div className="editing-note">
                    <div className="title">
                        <h4>Editing Note:</h4>
                        <button onClick={this.props.return_back}>
                            <span className="fa fa-arrow-left"></span>
                        </button>
                    </div>
                    <div className="head">
                        <div className="input-element">
                            <label htmlFor="title">Title: </label>
                            <input id="title" type="text" name="note_title" placeholder="Enter The Note Title" onChange={this.on_input_change} defaultValue={this.props.note.title} />
                        </div>
                        <div className="input-element">
                            <label htmlFor="privacy">Private: </label>
                            <input id="privacy" type="checkbox" name="note_privacy" onChange={this.on_input_change} defaultChecked={this.props.note.privacy === "private"} />
                        </div>
                        <div className="input-element">
                            <label htmlFor="archived">Archived: </label>
                            <input id="archived" type="checkbox" name="note_archived" onChange={this.on_input_change} defaultChecked={this.props.note.archived === 1} />
                        </div>
                    </div>
                    <div className="body">
                        <JoditEditor
                            value={this.props.note.content}
                            onBlur={new_content => this.setState({ note_content: new_content })} />
                    </div>
                    <div className="foot">
                        <div className="infos">
                            <p><span className="fa fa-clock"></span> <span className="title">Last update at:</span> {format_date(this.props.note.last_update)}</p>
                        </div>
                        <button onClick={this.save_edited_note}>Update Note</button>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
