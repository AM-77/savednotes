import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Axios from 'axios';
import { BASE_URL } from '../helpers/helper';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Notes from '../components/Notes';
import AddNote from '../components/AddNote';
import EditNote from '../components/EditNote';
import DisplayNote from '../components/DisplayNote';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      foundNotes: [],
      folder: 'all',
    };
  }

  componentDidMount() {
    const { folder } = this.state;
    this.getNotes(folder);
  }

  search = (find) => {
    const {
      auth: { token },
    } = this.props;
    Axios.get(`${BASE_URL}/notes/search/${find === '' ? '*' : find}`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((res) => {
        this.setState({ foundNotes: res.data.result });
      })
      .catch(() => {
        this.displayMessage({
          message: 'Sorry! somthing went worng. Please report this issue.',
          type: 'error',
        });
      });
  };

  getNotes = (folder) => {
    const {
      auth: {
        token,
        user: { id },
      },
    } = this.props;
    this.setState({ folder, display: 'notes' });
    Axios.get(`${BASE_URL}/notes/${folder}/${id}`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((res) => {
        this.setState({ foundNotes: res.data, folder });
      })
      .catch(() => {
        this.displayMessage({
          message: 'Something went wrong, please report this issue.',
          type: 'error',
        });
      });
  };

  addNewNote = () => this.setState({ display: 'addNew' });

  showNote = (note) => this.setState({ note, display: 'showNote' });

  updateNote = (noteToUpdate) => {
    this.setState({ noteToUpdate, display: 'editNote' });
  };

  saveNote = (note) => {
    const { auth } = this.props;
    const { noteTitle, noteContent, notePrivacy } = note;
    if (noteTitle !== '' && noteContent !== '') {
      const newNote = {
        userId: auth.user.id,
        title: noteTitle,
        content: noteContent,
        privacy: notePrivacy ? 'private' : 'public',
      };
      Axios.post(`${BASE_URL}/notes/`, newNote, {
        headers: { authorization: `Bearer ${auth.token}` },
      })
        .then((res) => {
          if (res.status === 200) {
            this.setState(
              {
                display: 'notes',
                notif: {
                  message: 'A new note has been added successfully.',
                  type: 'success',
                },
              },
              () => {
                const { folder } = this.state;
                this.getNotes(folder);
                setTimeout(() => {
                  this.setState({ notif: null });
                }, 3000);
              }
            );
          }
        })
        .catch(() => {
          this.displayMessage({
            message: 'Somthing went worng, please report this issue.',
            type: 'error',
          });
        });
    } else {
      this.displayMessage({
        message: 'Please fill all the empty fields.',
        type: 'error',
      });
    }
  };

  saveEditedNote = (editedNote) => {
    const {
      auth: { token },
    } = this.props;
    Axios.patch(`${BASE_URL}/notes`, editedNote, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then(() => {
        const { folder } = this.state;
        this.getNotes(folder);
        this.displayMessage({
          message: 'The note has been updated successfully.',
          type: 'success',
        });
      })
      .catch(() => {
        this.displayMessage({
          message: 'Something went wrong, please report this issue.',
          type: 'error',
        });
      });
  };

  trashNote = (note) => {
    let trashed;
    if (note.trashed === 0) {
      trashed = 1;
    } else {
      trashed = 0;
    }
    const {
      auth: { token },
    } = this.props;
    const { folder } = this.state;
    Axios.patch(
      `${BASE_URL}/notes`,
      { ...note, trashed },
      { headers: { authorization: `Bearer ${token}` } }
    )
      .then(() => {
        this.displayMessage({
          message: `The note has been ${
            trashed === 1 ? 'trashed' : 'restored'
          } successfully.`,
          type: 'success',
        });
        this.getNotes(folder);
      })
      .catch(() => {
        this.displayMessage({
          message: 'Somthing went worng, please report this issue.',
          type: 'error',
        });
      });
  };

  displayMessage = (notif) => {
    this.setState({ notif }, () => {
      setTimeout(() => {
        this.setState({ notif: null });
      }, 3000);
    });
  };

  returnBack = () => {
    const { folder } = this.state;
    this.setState({ folder: 'all' }, () => this.getNotes(folder));
  };

  renderDisplay = () => {
    const { auth } = this.props;
    const { display, noteToUpdate, note, folder, foundNotes } = this.state;
    switch (display) {
      case 'addNew':
        return (
          <AddNote saveNote={this.saveNote} returnBack={this.returnBack} />
        );

      case 'editNote':
        return (
          <EditNote
            note={noteToUpdate}
            saveEditedNote={this.saveEditedNote}
            returnBack={this.returnBack}
          />
        );

      case 'showNote':
        return <DisplayNote note={note} returnBack={this.returnBack} />;
      default:
        return (
          <Notes
            addNewNote={this.addNewNote}
            folder={folder}
            notes={foundNotes}
            updateNote={this.updateNote}
            showNote={this.showNote}
            userId={auth.user.id}
            trashNote={this.trashNote}
            returnBack={this.returnBack}
          />
        );
    }
  };

  render() {
    const { auth } = this.props;
    const { notif } = this.state;
    return (
      <div className="home-container">
        <div className="sidebar">
          <SideBar addNewNote={this.addNewNote} getNotes={this.getNotes} />
        </div>
        <div className="editor-container">
          <div className="navbar">
            <NavBar search={this.search} user={auth.user} />
          </div>
          <div className="notes-editor">
            {notif && (
              <div className={`notify-user ${notif.type}`}>
                <p>{notif.message}</p>
              </div>
            )}
            {this.renderDisplay()}
          </div>
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  auth: PropTypes.shape({
    token: PropTypes.string,
    user: PropTypes.shape({
      id: PropTypes.number,
      username: PropTypes.string,
      email: PropTypes.string,
    }),
  }).isRequired,
};

const mapStateToProps = (store) => ({ ...store });
export default connect(mapStateToProps)(Home);
