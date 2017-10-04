import React from "react";

import {Card, CardText} from 'material-ui/Card';
import {Table, TableBody, TableRow, TableRowColumn, TableHeader, TableHeaderColumn} from 'material-ui/Table';

import * as Color from 'material-ui/styles/colors';

import * as PatientActions from "../actions/PatientActions";
import * as CaseActions from "../actions/CaseActions";


import dispatcher from "../dispatcher";

import {CardTitle, Checkbox, MenuItem, SelectField, TextField, RaisedButton, DatePicker} from "material-ui";
import {Redirect} from "react-router";
import {Cell, Grid, Spinner} from "react-mdl";

const styles = {
    title: {
        backgroundColor: Color.blueGrey700
    },
    block: {
        maxWidth: "50%",
    },
    button: {
        margin: 12,
        color: Color.greenA400
    },
    filterLineInput: {
        verticalAlign: "text-bottom"
    },
    td: {
        fontSize: '15px'
    },
    checkbox: {
        marginBottom: 16,
    },
    paper: {
        display: 'inline-block',
        padding: '20px',
        margin: '20px'
    },
    patientIcon: {
        fontSize: 18
    },
    floatRight: {
        float: 'right'
    },
    th: {
        fontSize: '14px'
    },
    tr: {
        cursor: 'pointer'
    }
};

const present = function(text, before = '', after = '', no = '') {
    return text ? before + text + after : no;
};

const timeStampToDate = function(mysqlTimestamp) {
    return new Date(Date.parse(mysqlTimestamp));
};

Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h*60*60*1000));
    return this;
};

export default class Case extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(props.match.params.id),
            patient: {},
            sendDisabled: true
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        Case.handleButton = Case.handleButton.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleRecievePatientUpdate = this.handleRecievePatientUpdate.bind(this);
        this.handleBirthDateChange = this.handleBirthDateChange.bind(this);
        this.form = {};
    }

    componentWillMount() {
        let id = this.state.id;
        let apiUrl;
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            apiUrl = "http://localhost:3000/api/patients/" + id;
        } else {
            apiUrl = "/api/patients/" + id;
        }
        let component = this;
        fetch(apiUrl)
            .then((resp) => resp.json())
            .then(function (data) {
                component.onDataLoaded(data['content']);
            });

        this.dispatcherToken = dispatcher.register(this.handleRecievePatientUpdate.bind(this));
    }

    componentWillUnmount() {
        dispatcher.unregister(this.dispatcherToken);
    }

    handleRecievePatientUpdate = (action) => {
        self = this;
        setTimeout(function() { // Run after dispatcher has finished
            switch(action.type) {
                case "RECEIVE_PATIENT_UPDATE": {
                    if (action.data.content) {
                        PatientActions.reloadPatients();
                        dispatcher.dispatch({
                            type: "FIRE_SNACKBAR",
                            message: "Modifications saved."
                        });
                        self.setState({
                            redirect: <Redirect push to="/patients"/>
                        });
                    } else {
                        dispatcher.dispatch({
                            type: "FIRE_SNACKBAR",
                            message: "Error during save. See the developer console for more informations."
                        });
                        console.error("Eror during save : ");
                        console.error(JSON.stringify(action.data.error));
                    }
                    break;
                }
            }
        }, 0);
    };

    handleRowSelection = (selectedRows) => {
        console.log("CLICK !?");
        const idToPush = this.state.caseList[parseInt(selectedRows[0])]['sCase_id'];
        this.setState({
            redirect: <Redirect push to={"/cases/" + idToPush} />
        });
    };

    handleRowSelect = this.handleRowSelection.bind(this);

    handleTextChange = (event, value) => {
        name = event.target.name;
        event.target.classList.add("formInputChanged");
        this.form[name] = value;
        this.setState({
            sendDisabled: false
        });
    };

    handleBirthDateChange = (event, value) => {
        return this.handleDateChange('birth_date', value);
    };

    handleDateChange = (name, value) => {
        let form = document.getElementById(name);
        form.classList.add("formInputChanged");
        let formatted_date = value.addHours(14).toISOString().slice(0, 10);
        this.form[name] = formatted_date;
        this.setState({
            sendDisabled: false
        });
    };

    static handleButton() {
        let form = document.getElementById('patientForm');
        let button = form.ownerDocument.createElement('input');
        button.style.display = 'none';
        button.type = 'submit';
        form.appendChild(button).click();
        form.removeChild(button);
    }

    handleSubmit(event) {
        event.preventDefault();
        // alert('Form was submitted with : ' + JSON.stringify(this.form));
        PatientActions.sendPatient(this.state.id, this.form);
    }

    onDataLoaded(content) {
        this.setState({
            patient: content['patient'][0],
            caseList: content['caseList']
        });
        CaseActions.changeHeaderTitle("Patient : " + content['patient'][0].patient_initials);
    }

    render() {
        const patient = this.state.patient;
        const caseList = this.state.caseList;
        const activateSecondaryText = false;

        let caseComponents;

        if (this.state.redirect) {
            return this.state.redirect;
        }

        if (caseList) {
            caseComponents = caseList.map((scase) => {

                const col0 = scase.sCase_id;
                const col1 = scase.folder_name;
                const col2 = present(scase.diagnosisList_name) + present(scase.diagnosis_comment, ' : ');
                const col3 = present(scase.treatmentList_name) + present(scase.treatment_comment, ' : ');
                const col4 = present(scase.outcome_loosening) + present(scase.outcome_comment, ' : ');

                return <TableRow key={"patient_case_" + scase.sCase_id} hoverable={true} selectable={true} style={styles.tr}>
                    <TableRowColumn style={styles.td} className="id"><abbr title={col0}>{col0}</abbr></TableRowColumn>
                    <TableRowColumn style={styles.td} className={'small'}><abbr title={col1}>{col1}</abbr></TableRowColumn>
                    <TableRowColumn style={styles.td} className={''}><abbr title={col2}>{col2}</abbr></TableRowColumn>
                    <TableRowColumn style={styles.td} className={''}><abbr title={col3}>{col3}</abbr></TableRowColumn>
                    <TableRowColumn style={styles.td} className={''}><abbr title={col4}>{col4}</abbr></TableRowColumn>
                </TableRow>;

            });
        }

        if (patient.patient_id) {
            return (
                <div>
                    <form onSubmit={this.handleSubmit} id="patientForm">
                        <Grid>
                            <Cell col={3}>
                                <Card>
                                    <CardTitle title="Person"/>
                                    <CardText>
                                        <ul className="mdl-list">
                                            <li className="mdl-list__item">
                                            <span className="mdl-list__item-primary-content">
                                                <TextField
                                                    hintText="None"
                                                    floatingLabelText="Gender"
                                                    floatingLabelFixed={true}
                                                    defaultValue={patient.gender}
                                                    fullWidth={true}
                                                    maxLength={1}
                                                    onChange={this.handleTextChange}
                                                    name="gender"
                                                />
                                            </span>
                                            </li>
                                            <li className="mdl-list__item">
                                            <span className="mdl-list__item-primary-content">
                                                <TextField
                                                    hintText="None"
                                                    floatingLabelText="Height"
                                                    floatingLabelFixed={true}
                                                    defaultValue={patient.height}
                                                    fullWidth={true}
                                                    maxLength={8}
                                                    onChange={this.handleTextChange}
                                                    name="height"
                                                />
                                            </span>
                                            </li>
                                            <li className="mdl-list__item">
                                            <span className="mdl-list__item-primary-content">
                                                <TextField
                                                    hintText="None"
                                                    floatingLabelText="Weight"
                                                    floatingLabelFixed={true}
                                                    defaultValue={patient.weight}
                                                    fullWidth={true}
                                                    maxLength={8}
                                                    onChange={this.handleTextChange}
                                                    name="weight"
                                                />
                                            </span>
                                            </li>
                                            <li className="mdl-list__item">
                                            <span className="mdl-list__item-primary-content">
                                                <DatePicker
                                                    floatingLabelText="Birth Date"
                                                    floatingLabelFixed={true}
                                                    hintText="None"
                                                    fullWidth={true}
                                                    container="inline"
                                                    onChange={this.handleBirthDateChange}
                                                    mode="landscape"
                                                    autoOk={true}
                                                    defaultDate={(patient.birth_date) ? new Date(timeStampToDate(patient.birth_date)) : undefined}
                                                    name="birth_date"
                                                    id="birth_date"
                                                />
                                            </span>
                                            </li>
                                        </ul>
                                    </CardText>
                                </Card>
                            </Cell>
                            <Cell col={3}>
                                <Card>
                                    <CardTitle title="Anonymity"/>
                                    <CardText>
                                        <ul className="mdl-list">
                                            <li className="mdl-list__item">
                                            <span className="mdl-list__item-primary-content">
                                                <TextField
                                                    hintText="None"
                                                    floatingLabelText="Initials"
                                                    floatingLabelFixed={true}
                                                    defaultValue={patient.patient_initials}
                                                    fullWidth={true}
                                                    maxLength={5}
                                                    onChange={this.handleTextChange}
                                                    name="initials"
                                                />
                                            </span>
                                            </li>
                                            <li className="mdl-list__item">
                                            <span className="mdl-list__item-primary-content">
                                                <TextField
                                                    hintText="None"
                                                    floatingLabelText="IPP"
                                                    floatingLabelFixed={true}
                                                    defaultValue={patient.patient_IPP}
                                                    fullWidth={true}
                                                    maxLength={11}
                                                    onChange={this.handleTextChange}
                                                    name="ipp"
                                                />
                                            </span>
                                            </li>
                                        </ul>
                                    </CardText>
                                </Card>
                            </Cell>
                            <Cell col={12}>
                                <RaisedButton label="Save" primary={true} style={styles.button} onTouchTap={Case.handleButton} disabled={this.state.sendDisabled}/>
                            </Cell>
                            <Cell col={12}>
                                <Card>
                                    <CardTitle title="Patient's Cases"/>
                                    <CardText>
                                        <Table selectable={true} className="patient" onRowSelection={this.handleRowSelect}>
                                            <TableHeader enableSelectAll={false} displaySelectAll={false} adjustForCheckbox={false}>
                                                <TableRow>
                                                    <TableHeaderColumn style={styles.th} className="id">ID</TableHeaderColumn>
                                                    <TableHeaderColumn style={styles.th} className={'small'}>Folder</TableHeaderColumn>
                                                    <TableHeaderColumn style={styles.th} className={''}>Diagnosis</TableHeaderColumn>
                                                    <TableHeaderColumn style={styles.th} className={''}>Treatment</TableHeaderColumn>
                                                    <TableHeaderColumn style={styles.th} className={''}>Outcome</TableHeaderColumn>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody displayRowCheckbox={false} showRowHover={true} preScanRows={false}>
                                                {caseComponents}
                                            </TableBody>
                                        </Table>
                                    </CardText>
                                </Card>
                            </Cell>
                        </Grid>
                    </form>
                </div>
            );
        }
        else {
            return <Spinner singleColor />;
        }
    }
}
