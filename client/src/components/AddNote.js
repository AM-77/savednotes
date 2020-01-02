import React, { Component } from 'react'
import JoditEditor from 'jodit-react'

export default class AddingNewNote extends Component {

    constructor(props) {
        super(props)
        this.state = {
            note_title: null,
            note_privacy: false,
            note_content: ""
        }
    }

    on_input_change = e => {
        let name = e.target.name, value
        if (name === 'note_privacy') {
            e.target.checked ? value = "private" : value = "public"
        }
        else value = e.target.value
        this.setState({ [name]: value })
    }

    save_note = () => {
        this.props.save_note({
            note_title: this.state.note_title,
            note_privacy: this.state.note_privacy,
            note_content: this.state.note_content
        })
    }

    render() {
        return (
            <React.Fragment>
                <div className="editing-note">
                    <div className="title">
                        <h4>Creating New Note:</h4>
                        <button onClick={this.props.return_back}>
                            <span className="fa fa-arrow-left"></span>
                        </button>
                    </div>
                    <div className="head">
                        <div className="input-element">
                            <label htmlFor="title">Title: </label>
                            <input id="title" name="note_title" type="text" placeholder="Enter The Note Title" onChange={this.on_input_change} />
                        </div>
                        <div className="input-element">
                            <label htmlFor="privacy">Private: </label>
                            <input id="privacy" type="checkbox" name="note_privacy" onChange={this.on_input_change} />
                        </div>
                    </div>
                    <div className="body">
                        <JoditEditor value={this.state.note_content} onBlur={new_content => this.setState({ note_content: new_content })} />
                    </div>
                    <div className="foot">
                        <button onClick={this.save_note}>Save Note</button>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
