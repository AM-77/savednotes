import React, { Component } from 'react'

export default class Notes extends Component {

    format_note_content = content => {
        let note_content = content.replace(/<[^>]*>?/gm, "")
        if (note_content.length > 50)
            return note_content.slice(0, 50) + "..."
        return note_content
    }

    format_date = date => {
        let d = new Date(date);
        if (d.toString() !== "Invalid Date") return `${d.toLocaleDateString()}-${d.toLocaleTimeString()}`
        else return "Unknown Date"
    }

    render() {
        return (
            <div className="notes-container">
                {
                    this.props.notes.length > 0
                        ?
                        <React.Fragment>
                            <h4>{this.props.msg}</h4>
                            <div className="notes">
                                {
                                    this.props.notes.map((note, index) => (
                                        this.props.user_id === note.user_id ?
                                            <div className="my-note single-note" key={index}>
                                                <div className="head">
                                                    <div className="clock">
                                                        <span className="fa fa-clock" title="Creation Time"> {this.format_date(note.created_at)}</span>
                                                    </div>
                                                    <div className="title">
                                                        <div className="privacy">
                                                            {note.privacy === "private" ? <span className="fa fa-lock" title="Private Note"></span> : <span className="fa fa-unlock" title="Public Note"></span>}
                                                            {note.archived ? <span className="fa fa-archive" title="Aechived Note"></span> : null}
                                                        </div>
                                                        <h4 onClick={() => this.props.update_note(note)}>{note.title}</h4>
                                                        <span onClick={() => this.props.update_note(note)} className="edit fa fa-book-reader" title="Open Note"></span>
                                                    </div>
                                                </div>
                                                <div className="content">
                                                    <p>{this.format_note_content(note.content)}</p>
                                                </div>
                                                <div className="foot">
                                                    <div className="tarsh">
                                                        {this.props.user_id === note.user_id ? <button className="delete" title={note.trashed ? "Restore Note" : "Trash Note"} onClick={() => this.props.trash_note(note.id, note.trashed)}><span className={`fa ${note.trashed ? "fa-trash-restore" : "fa-trash"}`}></span></button> : null}
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            <div className="others-note single-note" key={index}>
                                                <div className="head">
                                                    <div className="clock" title="Creation Time">
                                                        <span className="fa fa-clock"> {this.format_date(note.created_at)}</span>
                                                    </div>
                                                    <div className="title">
                                                        <div className="privacy">
                                                            {note.privacy === "private" ? <span className="fa fa-lock" title="Private Note"></span> : <span className="fa fa-globe" title="Public Note"></span>}
                                                            {note.archived ? <span className="fa fa-archive" title="Archived Note"></span> : null}
                                                        </div>
                                                        <h4 onClick={() => this.props.show_note(note)}>{note.title}</h4>
                                                        <span onClick={() => this.props.show_note(note)} className="edit fa fa-book-reader" title="Open Note"></span>
                                                    </div>
                                                </div>
                                                <div className="content">
                                                    <p>{this.format_note_content(note.content)}</p>
                                                </div>
                                            </div>
                                    ))
                                }
                            </div>
                        </React.Fragment>
                        :
                        <div className="empty-notes">
                            <h4>Can't Find Any Note.</h4>
                            <button onClick={this.props.add_new_note}>Add A New Note</button>
                        </div>
                }
            </div>
        )
    }
}
