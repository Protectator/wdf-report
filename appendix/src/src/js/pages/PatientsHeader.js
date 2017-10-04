import React from "react";

import Checkbox from 'material-ui/Checkbox';
import FontIcon from 'material-ui/FontIcon';
import TextField from 'material-ui/TextField';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

import PatientStore from "../stores/PatientStore";
import * as PatientActions from "../actions/PatientActions";

import * as Color from 'material-ui/styles/colors';


const styles = {
    title: {
        color: '#37474F',
        height: 'auto'
    },
    grid: {
        paddingTop: 0,
        paddingBottom: 0
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
    menuElement: {
        position: 'relative',
        top: '50%',
        transform: 'translateY(-50%)'
    },
    headerTableHeaderContainer: {
        marginLeft: 8,
        marginRight: 8,
        width: 'calc(100% - 32px)',
        backgroundColor: 'white'
    },
    headerTableHeader: {
        marginLeft: 16,
        marginRight: 16,
        width: 'calc(100% - 16px)'
    },
    headerTableHeaderRowHeader: {
        marginLeft: 8,
        marginRight: 8,
    },
    headerTableHeaderContainerInside: {
        marginRight: 16
    },
    searchBar: {
        width: '100%'
    },
    th: {
        fontSize: '14px'
    }
};


export default class PatientsHeader extends React.Component {

    constructor() {
        super();
        this.onFilter = this.onFilter.bind(this);
        this.state = {
            filters: PatientStore.getFilters()
        };
    }

    componentWillMount() {
        PatientStore.on('filterPatientChange', this.onFilter);
    }

    componentWillUnmount() {
        PatientStore.removeListener('filterPatientChange', this.onFilter);
        PatientActions.filter(1, true);
        PatientActions.filter(2, true);
        PatientActions.filter(3, true);
        PatientActions.filter(4, true);
        PatientActions.search('');
    }

    handleFilterClick1(event, checked) {
        this.handleFilterClick(1, checked);
    }
    handleFilterClick2(event, checked) {
        this.handleFilterClick(2, checked);
    }
    handleFilterClick3(event, checked) {
        this.handleFilterClick(3, checked);
    }
    handleFilterClick4(event, checked) {
        this.handleFilterClick(4, checked);
    }

    handleFilterClick(number, checked) {
        PatientActions.filter(number, checked);
    }

    handleSearchChange(event, value) {
        PatientActions.search(value);
    }

    onFilter() {
        this.setState({
            filters: PatientStore.getFilters(),
        });
    }

    render() {

        const {filters} = this.state;

        return (
            <div>
                <div className="mdl-layout__header-row" style={styles.title}>
                    <div className="mdl-grid" style={styles.grid}>
                        <div className="mdl-cell mdl-cell--2-col" >
                            <span className="mdl-layout-title" style={styles.menuElement}>Patients</span>
                        </div>
                        <div className="mdl-cell mdl-cell--2-col">
                            <Checkbox
                                checkedIcon={<FontIcon className="material-icons">visibility</FontIcon>}
                                uncheckedIcon={<FontIcon className="material-icons">visibility_off</FontIcon>}
                                label="Person"
                                style={styles.menuElement}
                                onCheck={this.handleFilterClick1.bind(this)}
                                defaultChecked={true}
                            />
                        </div>
                        <div className="mdl-cell mdl-cell--2-col">
                            <Checkbox
                                checkedIcon={<FontIcon className="material-icons">visibility</FontIcon>}
                                uncheckedIcon={<FontIcon className="material-icons">visibility_off</FontIcon>}
                                label="Last Diagnosis"
                                style={styles.menuElement}
                                onCheck={this.handleFilterClick2.bind(this)}
                                defaultChecked={true}
                            />
                        </div>
                        <div className="mdl-cell mdl-cell--2-col">
                            <Checkbox
                                checkedIcon={<FontIcon className="material-icons">visibility</FontIcon>}
                                uncheckedIcon={<FontIcon className="material-icons">visibility_off</FontIcon>}
                                label="Last Treatment"
                                style={styles.menuElement}
                                onCheck={this.handleFilterClick3.bind(this)}
                                defaultChecked={true}
                            />
                        </div>
                        <div className="mdl-cell mdl-cell--2-col">
                            <Checkbox
                                checkedIcon={<FontIcon className="material-icons">visibility</FontIcon>}
                                uncheckedIcon={<FontIcon className="material-icons">visibility_off</FontIcon>}
                                label="Last Outcome"
                                style={styles.menuElement}
                                onCheck={this.handleFilterClick4.bind(this)}
                                defaultChecked={true}
                            />
                        </div>
                        <div className="mdl-cell mdl-cell--2-col">
                            <TextField
                                hintText="Search"
                                onChange={this.handleSearchChange.bind(this)}
                                style={styles.searchBar}
                            />
                        </div>
                    </div>
                </div>
                <div style={styles.headerTableHeaderContainer} className="headerTableHeader">
                    <div style={styles.headerTableHeaderContainerInside}>
                        <Table selectable={false} style={styles.headerTableHeader} className="patient">
                            <TableHeader
                                enableSelectAll={false}
                                displaySelectAll={false}
                                adjustForCheckbox={false}
                                style={styles.headerTableHeaderRowHeader}
                            >
                                <TableRow>
                                    <TableHeaderColumn style={styles.th} className="id">ID</TableHeaderColumn>
                                    <TableHeaderColumn style={styles.th} className={filters[1] ? '' : 'hidden'}>Person</TableHeaderColumn>
                                    <TableHeaderColumn style={styles.th} className={filters[2] ? '' : 'hidden'}>Diagnosis</TableHeaderColumn>
                                    <TableHeaderColumn style={styles.th} className={filters[3] ? '' : 'hidden'}>Treatment</TableHeaderColumn>
                                    <TableHeaderColumn style={styles.th} className={filters[4] ? '' : 'hidden'}>Outcome</TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                        </Table>
                    </div>
                </div>
            </div>
        );
    }
}
