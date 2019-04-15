import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { addFlashMessages } from '../../../../../actions/flashMessages';
import { saveEvent, fetchEvent, updateEvent } from '../../../../../actions/eventsSchedulersAction';
// import Calendar from '../../../../calendar/calendar';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class SchedulersForm extends Component {
    state = {
        _id: this.props.event ? this.props.event._id : null,
        title: this.props.event ? this.props.event.title : '',
        desc: this.props.event ? this.props.event.desc : '',
        // eventDone: this.props.event ? this.props.event.eventDone: false,
        eventDone: this.props.event ? this.props.event.eventDone: 'false',
        eventErrorMsg: '',



        month: '',
        day: '',

        startDateTime: '',
        endDateTime: '',

        startDate: new Date(),
        endDate: new Date(),
        showMonthDropdown: true,
        value: '',
        dateFormat: "MMMM d, yyyy h:mm aa",
        allDay: 'false',


        loading: false,
        done: false,
        errors: {}
    }

    componentWillReceiveProps = (nextProps) => {
        this.setState({
            _id: nextProps.event._id,
            title: nextProps.event.title,
            desc: nextProps.event.desc,
            eventDone: nextProps.event.eventDone
        })
    }

    componentDidMount = () => {
        if(this.props.params) {
            this.props.fetchEvent(this.props.params._id);
        }
    }

    handleChange = (e) => {
        if(!!this.state.errors[e.target.name]) {

            let errors = Object.assign({}, this.state.errors);
            delete errors[e.target.name];
    
            this.setState({ 
                [e.target.name]: e.target.value,
                errors
            })
        } else {
            this.setState({ [e.target.name]: e.target.value })
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();

        let errors = {}
        if(this.state.title === '') errors.title = 'Title cannot be empty';
        if(this.state.desc === '') errors.desc = 'Note cannot be empty';
        if(this.state.eventDone === '') errors.eventErrorMsg = 'Is it finisheded?';
        if(this.state.startDate === '') errors.startDate = 'Start date cannot be empty';
        if(this.state.endDate === '') errors.endDate = 'End date cannot be empty';

        this.setState({ errors })
        const isValid = Object.keys(errors).length === 0;

        if(isValid) {
            const { _id, title, desc, eventDone, startDate, endDate, allDay } = this.state;

            if(_id) {
                this.props.updateEvent({
                    _id,
                    title,
                    desc,
                    eventDone,
                    startDate,
                    endDate,
                    allDay
                })
                .then( () => {
                    this.props.addFlashMessages({
                        type: 'success',
                        text: 'You have successful updated the event'
                    });
                    this.setState({ done: true });
                },
                (err) => {
                    err.response.json()
                    .then(({ errors }) => this.setState({ errors, loading: false }))
                })
            } else {

                this.props.saveEvent({
                    title,
                    desc,
                    eventDone,
                    startDate,
                    endDate,
                    allDay
                })
                .then( () => {
                    this.props.addFlashMessages({
                        type: 'success',
                        text: 'You have successful added the event'
                    });
                    this.setState({ done: true });
                },
                (err) => {
                    err.response.json()
                    .then(({ errors }) => this.setState({ errors, loading: false }))
                })
            }
        }
    }

    handleStartDateChange = (date) => {
        console.log(typeof(date))
        this.setState({ startDate: date });
    }

    handleEndDateChange = (date) => {
        this.setState({ endDate: date });
    }

    render() {
        // console.log(this.state.startDate)

        const form = (
            <div className="schedulers-form-container">
                <div className="ui container">

                    <form className={classnames('ui', 'form', { loading: this.state.loading })} onSubmit={this.handleSubmit}>
                        <div className="ui raised segment">
                            <div className="ui blue ribbon label">Events</div>

                            {!!this.state.errors.global && <div className="ui negative message"><p>{this.state.errors.global}</p></div>}

                            <h4 className="ui dividing header">New Events Information</h4>

                            <div className={classnames('field', { error: !!this.state.errors.title })}>
                                <label htmlFor="firstname">Title *</label>
                                <input
                                    id="title"
                                    value={this.state.title}
                                    name="title"
                                    onChange={this.handleChange}
                                />
                                <span className="error-msg">{this.state.errors.title}</span>
                            </div>

                            <div className="two fields">

                                <div className={classnames('field', { error: !!this.state.errors.startDateTime })}>

                                    <label>Start Time *</label>
                                    <DatePicker
                                        selected={this.state.startDate}
                                        selectsStart
                                        startDate={this.state.startDate}
                                        endDate={this.state.endDate}
                                        onChange={this.handleStartDateChange}
                                        timeIntervals={15}
                                        dateFormat={this.state.dateFormat}
                                        showTimeSelect
                                        showMonthDropdown={this.state.showMonthDropdown}
                                    />
                                </div>

                                <div className={classnames('field', { error: !!this.state.errors.endDateTime })}>

                                    <label>End Time *</label>
                                    <DatePicker
                                        selected={this.state.endDate}
                                        selectsEnd
                                        startDate={this.state.startDate}
                                        endDate={this.state.endDate}
                                        onChange={this.handleEndDateChange}
                                        timeIntervals={15}
                                        dateFormat={this.state.dateFormat}
                                        showMonthDropdown={this.state.showMonthDropdown}
                                        showTimeSelect
                                    />
                                </div>
                            </div>

                            {/* <div className="field">
                                <label htmlFor="start">Start Date</label>
                                <input 
                                    id="start"
                                    type="date" 
                                    value={this.state.start}
                                    name="start"
                                    onChange={this.handleStartDateChange}
                                />
                                <label htmlFor="end">End Date</label>
                                <input
                                    id="end"
                                    type="date"
                                    value={this.state.end}
                                    name="end"
                                    onChange={this.handleEndDateChange}
                                />
                            </div> */}

                            <div className="field">
                                <label htmlFor="allday">Is it all day event?</label>
                                <select
                                    className="ui fluid search dropdown"
                                    onChange={this.handleChange}
                                    name="allday"
                                    id="allday"
                                    value={this.state.allDay}
                                >
                                    <option value=""></option>
                                    <option value="false">No</option>
                                    <option value="true">Yes</option>
                                </select>
                            </div>

                            <div className="field">
                                <label htmlFor="eventDone">Is it finished?</label>
                                <select 
                                    className="ui fluid search dropdown"
                                    onChange={this.handleChange}
                                    name="eventDone"
                                    id="eventDone"
                                    value={this.state.eventDone}
                                >
                                    <option value=""></option>
                                    <option value="false">No</option>
                                    <option value="true">Yes</option>
                                </select>
                                <span className="error-msg">{this.state.errors.eventErrorMsg}</span>
                            </div>



                            {/* <Calendar
                                onDayClick={this.onDayClick(this.state.month, this.state.day)}
                            /> */}

                            <div className={classnames('field', { error: !!this.state.errors.desc })}>
                                <label htmlFor="firstname">desc *</label>
                                <textarea
                                    id="desc"
                                    value={this.state.desc}
                                    name="desc"
                                    onChange={this.handleChange}
                                />
                                <span className="error-msg">{this.state.errors.desc}</span>
                            </div>

                            <div className="field">
                                <button className="ui primary button">Save</button>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        )
        return (
            <div className="schedulers-form">
                {this.state.done ? <Redirect to="/admins/events/current-events" /> : form }
            </div>
        )
    }
}

SchedulersForm.propTypes = {
    saveEvent: PropTypes.func
}

const mapStateToProps = (state, props) => {
    if(props.params) {
        return {
            event: state.events.find(item => item._id === props.params._id)
        }
    }
    return { event: null }
}

export default connect(mapStateToProps, {
    saveEvent,
    fetchEvent,
    updateEvent,
    addFlashMessages
})(SchedulersForm);