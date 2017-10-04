import React from "react";

import {Card, CardText} from 'material-ui/Card';
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';

import * as Color from 'material-ui/styles/colors';

import PatientStore from "../stores/PatientStore";
import * as PatientActions from "../actions/PatientActions";
import {Redirect} from "react-router";

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
    tr: {
        cursor: 'pointer'
    }
};

const present = function(text, before = '', after = '', no = '') {
    return text ? before + text + after : no;
};

Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h*60*60*1000));
    return this;
};

export default class Patients extends React.Component {

    constructor() {
        super();
        this.onChange = this.onChange.bind(this);
        this.onFilter = this.onFilter.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.state = {
            patients: PatientStore.getAll(),
            filters: PatientStore.getFilters(),
            search: PatientStore.getSearch()
        };
    }

    componentWillMount() {
        PatientStore.on('patientChange', this.onChange);
        PatientStore.on('filterPatientChange', this.onFilter);
        PatientStore.on('searchPatientChange', this.onSearch);
    }

    componentWillUnmount() {
        PatientStore.removeListener('patientChange', this.onChange);
        PatientStore.removeListener('filterPatientChange', this.onFilter);
        PatientStore.removeListener('searchPatientChange', this.onSearch);
    }

    onChange() {
        this.setState({
            patients: PatientStore.getAll(),
        });
    }

    onFilter() {
        this.setState({
            filters: PatientStore.getFilters(),
        });
    }

    onSearch() {
        this.setState({
            search: PatientStore.getSearch(),
        });
    }

    handleRowSelection = (selectedRows) => {
        this.setState({
            redirect: this.state.patients[parseInt(selectedRows[0])]['patient_id'],
        });
    };

    handleRowSelect = this.handleRowSelection.bind(this);

    reloadPatients() {
        PatientActions.reloadPatients();
    }

    render() {
        if (this.state.redirect) {
            let link = "/patients/" + this.state.redirect;
            return <Redirect push to={link}/>;
        }

        const {patients} = this.state;
        const {filters} = this.state;
        const search = this.state['search'].toLowerCase();

        const PatientComponents = patients.map((patient) => {

            const col0 = patient.patient_id;
            const col1 = patient.patient_initials + ' | ' + patient.gender + present(patient.height, ' | ', 'cm', ' | ?cm') + present(patient.weight, ' | ', 'kg', ' | ?kg') + ' | ' + (new Date(patient.birth_date).addHours(14)).toISOString().substring(0, 10);
            const col2 = present(patient.diagnosisList_name) + present(patient.diagnosis_comment, ' : ');
            const col3 = present(patient.treatmentList_name) + present(patient.treatment_comment, ' : ');
            const col4 = present(patient.outcome_loosening) + present(patient.outcome_comment, ' : ');

            const eventualResult = <TableRow key={"patient_" + patient.patient_id + "_" + Math.random()} hoverable={true} style={styles.tr}>
                <TableRowColumn style={styles.td} className="id"><abbr title={col0}>{col0}</abbr></TableRowColumn>
                <TableRowColumn style={styles.td} className={filters[1] ? '' : 'hidden'}><abbr title={col1}>{col1}</abbr></TableRowColumn>
                <TableRowColumn style={styles.td} className={filters[2] ? '' : 'hidden'}><abbr title={col2}>{col2}</abbr></TableRowColumn>
                <TableRowColumn style={styles.td} className={filters[3] ? '' : 'hidden'}><abbr title={col3}>{col3}</abbr></TableRowColumn>
                <TableRowColumn style={styles.td} className={filters[4] ? '' : 'hidden'}><abbr title={col4}>{col4}</abbr></TableRowColumn>
            </TableRow>;

            const hiddenResult = <TableRow key={"patient_" + patient.patient_id + "_" + Math.random()} hoverable={true} selectable={true} style={styles.tr} className="hidden"/>;

            if (search.length > 0) {
                let fields = [col0, col1, col2, col3, col4];
                for (let i = 0; i < fields.length; i++) {
                    if (String(fields[i]).toLowerCase().includes(search)) {
                        return eventualResult;
                    }
                }
                return hiddenResult;
            } else {
                return eventualResult;
            }
        });

        return (
            <Card>
                <CardText>
                    <Table className="patient" onRowSelection={this.handleRowSelect}>
                        <TableBody displayRowCheckbox={false} showRowHover={true}>
                            {PatientComponents}
                        </TableBody>
                    </Table>
                </CardText>
            </Card>
        );
    }
}
