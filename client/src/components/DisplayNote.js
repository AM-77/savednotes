import React, { Component } from 'react'
import JoditEditor from 'jodit-react'
import { format_date } from './../helpers/helper'

export default class DisplayNote extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="editing-note global-note">
                    <div className="title">
                        <h4>Global Note:</h4>
                        <button onClick={this.props.return_back}>
                            <span className="fa fa-arrow-left"></span>
                        </button>
                    </div>
                    <div className="head">
                        <div className="input-element">
                            <label htmlFor="title">Title: </label>
                            <input id="title" type="text" placeholder="Enter The Note Title" readOnly defaultValue={this.props.note.title} />
                        </div>
                    </div>
                    <div className="body">
                        <h4>Content: </h4>
                        <JoditEditor value={this.props.note.content} config={{ readonly: true }} />
                    </div>
                    <div className="foot">
                        <div className="infos">
                            <p><span className="fa fa-clock"></span> <span className="title">Last update at:</span> {format_date(this.props.note.last_update)}</p>
                            <p><span className="fa fa-clock"></span> <span className="title">Created at:</span> {format_date(this.props.note.created_at)}</p>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
