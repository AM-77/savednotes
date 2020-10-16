import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../helpers/helper';

export default class DisplayNote extends Component {
  constructor(props) {
    super(props);
    this.noteContentRef = React.createRef();
  }

  componentDidMount() {
    const { note } = this.props;
    this.noteContentRef.current.innerHTML = note.content;
  }

  render() {
    const { returnBack, note } = this.props;
    return (
      <>
        <div className="editing-note global-note">
          <div className="title">
            <h4>Global Note:</h4>
            <button type="button" onClick={returnBack}>
              <span className="icon icon-arrow-left">
                <svg viewBox="0 0 492 492">
                  <g>
                    <path d="M464.344,207.418l0.768,0.168H135.888l103.496-103.724c5.068-5.064,7.848-11.924,7.848-19.124 c0-7.2-2.78-14.012-7.848-19.088L223.28,49.538c-5.064-5.064-11.812-7.864-19.008-7.864c-7.2,0-13.952,2.78-19.016,7.844 L7.844,226.914C2.76,231.998-0.02,238.77,0,245.974c-0.02,7.244,2.76,14.02,7.844,19.096l177.412,177.412 c5.064,5.06,11.812,7.844,19.016,7.844c7.196,0,13.944-2.788,19.008-7.844l16.104-16.112c5.068-5.056,7.848-11.808,7.848-19.008 c0-7.196-2.78-13.592-7.848-18.652L134.72,284.406h329.992c14.828,0,27.288-12.78,27.288-27.6v-22.788 C492,219.198,479.172,207.418,464.344,207.418z" />
                  </g>
                </svg>
              </span>
            </button>
          </div>
          <div className="head">
            <div className="input-element">
              <label htmlFor="title">Title: </label>
              <input
                id="title"
                type="text"
                placeholder="Enter The Note Title"
                readOnly
                defaultValue={note.title}
              />
            </div>
          </div>
          <div className="body">
            <div ref={this.noteContentRef} className="content" />
          </div>
          <div className="foot">
            <div className="infos">
              <span className="icon icon-clock" title="Last update">
                <svg viewBox="0 0 512 512">
                  <path d="M437.02,74.98C388.667,26.629,324.38,0,256,0S123.333,26.629,74.98,74.98C26.629,123.333,0,187.62,0,256 s26.629,132.667,74.98,181.02C123.333,485.371,187.62,512,256,512c46.813,0,92.617-12.757,132.461-36.893 c9.448-5.723,12.468-18.021,6.745-27.468c-5.722-9.449-18.022-12.468-27.468-6.745C334.143,461.244,295.505,472,256,472 c-119.103,0-216-96.897-216-216S136.897,40,256,40s216,96.897,216,216c0,42.589-12.665,84.044-36.627,119.885 c-6.139,9.182-3.672,21.603,5.511,27.742c9.183,6.139,21.603,3.671,27.742-5.511C497.001,355.674,512,306.531,512,256 C512,187.62,485.371,123.333,437.02,74.98z" />
                  <path d="M256,76c-11.046,0-20,8.954-20,20v151.716l-73.338,73.338c-7.811,7.81-7.811,20.473,0,28.284 c3.905,3.905,9.023,5.858,14.142,5.858s10.237-1.953,14.142-5.858l79.196-79.196c3.751-3.75,5.858-8.838,5.858-14.142V96 C276,84.954,267.046,76,256,76z" />
                </svg>
              </span>
              <span className="title">
                <span>Last update at:</span>
                <span>{formatDate(note.lastUpdate)}</span>
              </span>
            </div>
          </div>
        </div>
      </>
    );
  }
}

DisplayNote.propTypes = {
  returnBack: PropTypes.func.isRequired,
  note: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    lastUpdate: PropTypes.string,
  }).isRequired,
};
