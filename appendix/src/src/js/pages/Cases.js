import React from "react";

import {Card, CardText} from 'material-ui/Card';
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';

import * as Color from 'material-ui/styles/colors';

import CaseStore from "../stores/CaseStore";
import * as CaseActions from "../actions/CaseActions";
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

export default class Cases extends React.Component {

    constructor() {
        super();
        this.onChange = this.onChange.bind(this);
        this.onFilter = this.onFilter.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.state = {
            cases: CaseStore.getAll(),
            filters: CaseStore.getFilters(),
            search: CaseStore.getSearch()
        };
    }

    componentWillMount() {
        CaseStore.on('caseChange', this.onChange);
        CaseStore.on('filterCaseChange', this.onFilter);
        CaseStore.on('searchCaseChange', this.onSearch);
    }

    componentWillUnmount() {
        CaseStore.removeListener('caseChange', this.onChange);
        CaseStore.removeListener('filterCaseChange', this.onFilter);
        CaseStore.removeListener('searchCaseChange', this.onSearch);
    }

    onChange() {
        this.setState({
            cases: CaseStore.getAll(),
        });
    }

    onFilter() {
        this.setState({
            filters: CaseStore.getFilters(),
        });
    }

    onSearch() {
        this.setState({
            search: CaseStore.getSearch(),
        });
    }

    handleRowSelection = (selectedRows) => {
        this.setState({
            redirect: this.state.cases[parseInt(selectedRows[0])]['sCase_id'],
        });
    };

    handleRowSelect = this.handleRowSelection.bind(this);

    static reloadCases() {
        CaseActions.reloadCases();
    }

    render() {
        if (this.state.redirect) {
            let link = "/cases/" + this.state.redirect;
            return <Redirect push to={link}/>;
        }

        const {cases} = this.state;
        const {filters} = this.state;
        const search = this.state['search'].toLowerCase();

        const CaseComponents = cases.map((scase) => {

            const col0 = scase.sCase_id;
            const col1 = scase.folder_name;
            const col2 = present(scase.diagnosisList_name) + present(scase.diagnosis_comment, ' : ');
            const col3 = present(scase.treatmentList_name) + present(scase.treatment_comment, ' : ');
            const col4 = present(scase.outcome_loosening) + present(scase.outcome_comment, ' : ');

            const eventualResult = <TableRow key={"case_" + scase.sCase_id} hoverable={true} selectable={true} style={styles.tr}>
                <TableRowColumn style={styles.td} className="id"><abbr title={col0}>{col0}</abbr></TableRowColumn>
                <TableRowColumn style={styles.td} className={filters[1] ? 'small' : 'hidden'}><abbr title={col1}>{col1}</abbr></TableRowColumn>
                <TableRowColumn style={styles.td} className={filters[2] ? '' : 'hidden'}><abbr title={col2}>{col2}</abbr></TableRowColumn>
                <TableRowColumn style={styles.td} className={filters[3] ? '' : 'hidden'}><abbr title={col3}>{col3}</abbr></TableRowColumn>
                <TableRowColumn style={styles.td} className={filters[4] ? '' : 'hidden'}><abbr title={col4}>{col4}</abbr></TableRowColumn>
            </TableRow>;

            const hiddenResult = <TableRow key={"case_" + scase.sCase_id} hoverable={true} selectable={true} style={styles.tr} className="hidden"/>;

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
                        <TableBody displayRowCheckbox={false} showRowHover={true} preScanRows={false}>
                            {CaseComponents}
                        </TableBody>
                    </Table>
                </CardText>
            </Card>
        );
    }
}
