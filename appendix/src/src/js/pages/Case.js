import React from "react";

import {Card, CardText} from 'material-ui/Card';
import {Table, TableBody, TableRow, TableRowColumn, TableHeader} from 'material-ui/Table';

import * as Color from 'material-ui/styles/colors';

import * as CaseActions from "../actions/CaseActions";


import dispatcher from "../dispatcher";

import {CardTitle, Checkbox, MenuItem, SelectField, TextField, RaisedButton, DatePicker} from "material-ui";
import {Redirect} from "react-router";
import {Link} from "react-router-dom";
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
            case: {},
            diagnosticIndex: 0,
            treatmentIndex: 0,
            sendDisabled: true
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        Case.handleButton = Case.handleButton.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.handleRecieveCaseUpdate = this.handleRecieveCaseUpdate.bind(this);
        this.handleDiagnosisDateChange = this.handleDiagnosisDateChange.bind(this);
        this.handleTreatmentDateChange = this.handleTreatmentDateChange.bind(this);
        this.handleOutcomeDateChange = this.handleOutcomeDateChange.bind(this);
        this.form = {};
    }

    componentWillMount() {
        let id = this.state.id;
        let apiUrl;
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            apiUrl = "http://localhost:3000/api/cases/" + id;
        } else {
            apiUrl = "/api/cases/" + id;
        }
        let component = this;
        fetch(apiUrl)
            .then((resp) => resp.json())
            .then(function (data) {
                component.onDataLoaded(data['content']);
            });

        this.dispatcherToken = dispatcher.register(this.handleRecieveCaseUpdate.bind(this));
    }

    componentWillUnmount() {
        dispatcher.unregister(this.dispatcherToken);
    }

    handleRecieveCaseUpdate = (action) => {
        self = this;
        setTimeout(function() { // Run after dispatcher has finished
            switch(action.type) {
                case "RECEIVE_CASE_UPDATE": {
                    if (action.data.content) {
                        CaseActions.reloadCases();
                        dispatcher.dispatch({
                            type: "FIRE_SNACKBAR",
                            message: "Modifications saved."
                        });
                        self.setState({
                            redirect: <Redirect push to="/cases"/>
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

    handleDiagChange = (event, index, value) => {
        this.form['diagnosis'] = value;
        this.setState({
            diagnosticIndex: value,
            diagnosisClass: 'formInputChanged',
            sendDisabled: false
        });
    };

    handleTreatChange = (event, index, value) => {
        this.form['treatment'] = value;
        this.setState({
            treatmentIndex: value,
            treatmentClass: 'formInputChanged',
            sendDisabled: false
        });
    };

    handleTextChange = (event, value) => {
        name = event.target.name;
        event.target.classList.add("formInputChanged");
        this.form[name] = value;
        this.setState({
            sendDisabled: false
        });
    };

    handleDiagnosisDateChange = (event, value) => {
        return this.handleDateChange('diagnosis_date', value);
    };

    handleTreatmentDateChange = (event, value) => {
        return this.handleDateChange('treatment_date', value);
    };

    handleOutcomeDateChange = (event, value) => {
        return this.handleDateChange('outcome_date', value);
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

    handleCheckboxChange = (event, value) => {
        name = event.target.name;
        event.target.classList.add("formInputChanged");
        this.form[name] = value;
        this.setState({
            sendDisabled: false
        });
    };

    static handleButton() {
        let form = document.getElementById('caseForm');
        let button = form.ownerDocument.createElement('input');
        button.style.display = 'none';
        button.type = 'submit';
        form.appendChild(button).click();
        form.removeChild(button);
    }

    handleSubmit(event) {
        event.preventDefault();
        // alert('Form was submitted with : ' + JSON.stringify(this.form));
        CaseActions.sendCase(this.state.id, this.form);
    }

    onDataLoaded(content) {
        this.setState({
            case: content['case'][0],
            ct: content['ct'],
            diagnosisList: content['diagnosisList'],
            treatmentList: content['treatmentList'],
            diagnosticIndex: content['case'][0]['diagnosisList_id'],
            treatmentIndex: content['case'][0]['treatmentList_id']
        });
        CaseActions.changeHeaderTitle("Case : " + content['case'][0].folder_name);
    }

    render() {
        const scase = this.state.case;
        const patientLink = "/patients/" + scase.patient_id;
        const cts = this.state.ct;
        const activateSecondaryText = false;

        let ctComponents;
        let diagComponents;
        let treatComponents;

        if (this.state.redirect) {
            return this.state.redirect;
        }

        if (cts) {
            ctComponents = cts.map((ct) => {
                const children = [];
                let i = 0;
                for (let property in ct) {
                    if (ct.hasOwnProperty(property)
                        && !property.endsWith('_2')
                        && !property.endsWith('_3')
                        && !property.endsWith('_4')
                        && !property.endsWith('_5')
                        && !property.endsWith('_6')) {
                        children.push(
                            <TableRow key={property + String(i)}>
                                <TableRowColumn className="firstColumn">
                                    {property}
                                </TableRowColumn>
                                <TableRowColumn className="secondColumn">
                                    <abbr title={ct[property]}>{ct[property]}</abbr>
                                </TableRowColumn>
                            </TableRow>
                        );
                    }
                    i++;
                }
                return (
                    <Grid key={ct.sCase_id}>
                        <Cell col={6} className="noFullWidth">
                            <Card>
                                <CardText>
                                    <Table selectable={false} className="ctTable">
                                        <TableHeader enableSelectAll={false} displaySelectAll={false} adjustForCheckbox={false}>
                                            <TableRow>
                                                <TableRowColumn className="firstColumn">
                                                    Field
                                                </TableRowColumn>
                                                <TableRowColumn className="secondColumn">
                                                    Value
                                                </TableRowColumn>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody displayRowCheckbox={false} showRowHover={true} preScanRows={false}>
                                            {children}
                                        </TableBody>
                                    </Table>
                                </CardText>
                            </Card>
                        </Cell>
                    </Grid>
                );
            });

            diagComponents = this.state.diagnosisList.map((diag) => {
                return <MenuItem key={diag.diagnosisList_id} value={diag.diagnosisList_id} primaryText={diag.name} secondaryText={activateSecondaryText ? diag.description : ''}/>;
            });

            treatComponents = this.state.treatmentList.map((treat) => {
                return <MenuItem key={treat.treatmentList_id} value={treat.treatmentList_id} primaryText={treat.name} secondaryText={activateSecondaryText ? treat.description : ''}/>;
            });
        }

        let buttonLabel = "Edit Patient";

        if (scase.sCase_id) {
            return (
                <div>
                    <form onSubmit={this.handleSubmit} id="caseForm">
                        <Grid>
                            <Cell col={3}>
                                <Card>
                                    <CardTitle title={
                                        <span>Patient
                                        <Link to={patientLink} style={styles.floatRight}>
                                        <RaisedButton
                                        label={buttonLabel}
                                        secondary={true}
                                        />
                                        </Link>
                                        </span>
                                    }/>
                                    <CardText>
                                        <ul className="mdl-list">
                                            <li className="mdl-list__item">
                                            <span className="mdl-list__item-primary-content">
                                                {(scase.shoulder_side == 'R' ? 'Right' : (scase.shoulder_side == 'L' ? 'Left' : '?'))} shoulder
                                            </span>
                                            </li>
                                            <li className="mdl-list__item">
                                            <span className="mdl-list__item-primary-content">
                                                {(scase.patient_gender== 'M' ? 'Male' : (scase.patient_gender == 'F' ? 'Female' : scase.patient_gender))}
                                            </span>
                                            </li>
                                            <li className="mdl-list__item">
                                            <span className="mdl-list__item-primary-content">
                                                {present(scase.patient_height, '', 'cm', '?cm')}
                                            </span>
                                            </li>
                                            <li className="mdl-list__item">
                                            <span className="mdl-list__item-primary-content">
                                                {present(scase.patient_weight, '', 'kg', '?kg')}
                                            </span>
                                            </li>
                                            <hr/>
                                            <li className="mdl-list__item">
                                            <span className="mdl-list__item-primary-content">
                                                <TextField
                                                    hintText="None"
                                                    floatingLabelText="Folder Name"
                                                    floatingLabelFixed={true}
                                                    defaultValue={scase.folder_name}
                                                    fullWidth={true}
                                                    maxLength={255}
                                                    onChange={this.handleTextChange}
                                                    name="folder_name"
                                                />
                                            </span>
                                            </li>
                                        </ul>
                                    </CardText>
                                </Card>
                            </Cell>
                            <Cell col={3}>
                                <Card>
                                    <CardTitle title="Diagnosis"/>
                                    <CardText>
                                        <SelectField
                                            floatingLabelText="Name"
                                            hintText="None"
                                            floatingLabelFixed={true}
                                            value={this.state.diagnosticIndex}
                                            onChange={this.handleDiagChange}
                                            fullWidth={true}
                                            name="diagnosis"
                                            className={this.state.diagnosisClass}
                                        >
                                            {diagComponents}
                                        </SelectField>
                                        <br />
                                        <TextField
                                            floatingLabelText="Comment"
                                            hintText="None"
                                            floatingLabelFixed={true}
                                            defaultValue={scase.diagnosis_comment}
                                            multiLine={true}
                                            fullWidth={true}
                                            maxLength={255}
                                            onChange={this.handleTextChange}
                                            name="diagnosis_comment"
                                        />
                                        <TextField
                                            floatingLabelText="CMI"
                                            hintText="None"
                                            floatingLabelFixed={true}
                                            defaultValue={scase.diagnosis_CMI}
                                            fullWidth={true}
                                            maxLength={10}
                                            onChange={this.handleTextChange}
                                            name="diagnosis_CMI"
                                        />
                                        <TextField
                                            floatingLabelText="DRG"
                                            hintText="None"
                                            floatingLabelFixed={true}
                                            defaultValue={scase.diagnosis_DRG}
                                            fullWidth={true}
                                            maxLength={20}
                                            onChange={this.handleTextChange}
                                            name="diagnosis_DRG"
                                        />
                                        <DatePicker
                                            floatingLabelText="Date"
                                            floatingLabelFixed={true}
                                            hintText="None"
                                            fullWidth={true}
                                            container="inline"
                                            onChange={this.handleDiagnosisDateChange}
                                            mode="landscape"
                                            autoOk={true}
                                            defaultDate={(scase.diagnosis_date) ? new Date(timeStampToDate(scase.diagnosis_date)) : undefined}
                                            name="diagnosis_date"
                                            id="diagnosis_date"
                                        />
                                    </CardText>
                                </Card>
                            </Cell>
                            <Cell col={3}>
                                <Card>
                                    <CardTitle title="Treatment"/>
                                    <CardText>
                                        <SelectField
                                            floatingLabelText="Name"
                                            hintText="None"
                                            floatingLabelFixed={true}
                                            value={this.state.treatmentIndex}
                                            onChange={this.handleTreatChange}
                                            fullWidth={true}
                                            name="treatment"
                                            floatingLabelStyle={this.state.treatmentStyle}
                                            className={this.state.treatmentClass}
                                        >
                                            {treatComponents}
                                        </SelectField>
                                        <br />
                                        <TextField
                                            floatingLabelText="Comment"
                                            hintText="None"
                                            floatingLabelFixed={true}
                                            defaultValue={scase.treatment_comment}
                                            multiLine={true}
                                            fullWidth={true}
                                            maxLength={255}
                                            onChange={this.handleTextChange}
                                            name="treatment_comment"
                                        />
                                        <DatePicker
                                            floatingLabelText="Date"
                                            floatingLabelFixed={true}
                                            hintText="None"
                                            fullWidth={true}
                                            container="inline"
                                            onChange={this.handleTreatmentDateChange}
                                            mode="landscape"
                                            autoOk={true}
                                            defaultDate={(scase.treatment_date) ? new Date(timeStampToDate(scase.treatment_date)) : undefined}
                                            name="treatment_date"
                                            id="treatment_date"
                                        />
                                        <Checkbox
                                            label="ASA"
                                            style={styles.checkbox}
                                            defaultChecked={(scase.treatment_ASA == 'Y')}
                                            onCheck={this.handleCheckboxChange}
                                            name="treatment_ASA"
                                            className={this.state.checkboxClass}
                                        />
                                    </CardText>
                                </Card>
                            </Cell>
                            <Cell col={3}>
                                <Card>
                                    <CardTitle title="Outcome"/>
                                    <CardText>
                                        <TextField
                                            floatingLabelText="Score"
                                            hintText="None"
                                            floatingLabelFixed={true}
                                            defaultValue={scase.outcome_score}
                                            fullWidth={true}
                                            maxLength={45}
                                            onChange={this.handleTextChange}
                                            name="outcome_score"
                                        />
                                        <TextField
                                            floatingLabelText="Comment"
                                            hintText="None"
                                            floatingLabelFixed={true}
                                            defaultValue={scase.outcome_comment}
                                            multiLine={true}
                                            fullWidth={true}
                                            maxLength={255}
                                            onChange={this.handleTextChange}
                                            name="outcome_comment"
                                        />
                                        <TextField
                                            floatingLabelText="Loosening"
                                            hintText="None"
                                            floatingLabelFixed={true}
                                            defaultValue={scase.outcome_loosening}
                                            fullWidth={true}
                                            maxLength={1}
                                            onChange={this.handleTextChange}
                                            name="outcome_loosening"
                                        />
                                        <DatePicker
                                            floatingLabelText="Date"
                                            floatingLabelFixed={true}
                                            hintText="None"
                                            fullWidth={true}
                                            container="inline"
                                            onChange={this.handleOutcomeDateChange}
                                            mode="landscape"
                                            autoOk={true}
                                            defaultDate={(scase.outcome_date) ? new Date(timeStampToDate(scase.outcome_date)) : undefined}
                                            name="outcome_date"
                                            id="outcome_date"
                                        />
                                    </CardText>
                                </Card>
                            </Cell>
                            <Cell col={12}>
                                <RaisedButton label="Save" primary={true} style={styles.button} onTouchTap={Case.handleButton} disabled={this.state.sendDisabled}/>
                            </Cell>
                        </Grid>
                    </form>
                    <CardTitle title="CT scans"/>
                    {ctComponents}
                </div>
            );
        }
        else {
            return <Spinner singleColor />;
        }
    }
}
