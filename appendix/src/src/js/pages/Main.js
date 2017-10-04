import React from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {fade} from 'material-ui/utils/colorManipulator';
import * as Color from 'material-ui/styles/colors';

import Header from "./Header";
import Aside from "./Aside";

import Index from "./Index";
import Cases from "./Cases";
import Patients from "./Patients";
import Patient from "./Patient";
import Case from "./Case";
import Studies from "./Studies";
import Statistics from "./Statistics";
import Informations from "./Informations";
import Admin from "./Admin";

import CasesHeader from "./CasesHeader";
import PatientsHeader from "./PatientsHeader";
import {Snackbar} from "material-ui";

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: Color.blueGrey700,
        primary2Color: Color.blueGrey900,
        primary3Color: Color.grey400,
        accent1Color: Color.greenA200,
        accent2Color: Color.grey100,
        accent3Color: Color.grey500,
        textColor: Color.darkBlack,
        alternateTextColor: Color.white,
        canvasColor: Color.white,
        borderColor: Color.grey300,
        disabledColor: fade(Color.darkBlack, 0.3),
        pickerHeaderColor: Color.bluegrey500,
        clockCircleColor: fade(Color.darkBlack, 0.07),
        shadowColor: Color.fullBlack,
    }
});

export default class Main extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            message: ''
        };
        dispatcher.register(this.handleShowSnackbar.bind(this));
    }

    handleRequestClose = () => {
        this.setState({
            open: false,
        });
    };

    handleShowSnackbar(action) {
        switch(action.type) {
            case "FIRE_SNACKBAR": {
                this.setState({
                    open: true,
                    message: action.message
                });
                break;
            }
        }
    }

    render() {
        return (
            <div>
                <Router>
                    <MuiThemeProvider muitheme={muiTheme}>
                        <div className="mdl-layout_container">
                            <div className="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
                                <header className="demo-header mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
                                    <Route path="/" exact={true} name="indexheader" component={() => (<Header title="Home" />)}/>
                                    <Route path="/index" exact={true} name="indexheader" component={() => (<Header title="Home" />)}/>
                                    <Route path="/cases" exact={true} name="casesheader" component={CasesHeader}/>
                                    <Route path="/patients" exact={true}  name="patientsheader" component={PatientsHeader}/>
                                    <Route path="/studies" name="studiesheader" component={() => (<Header title="Studies" />)}/>
                                    <Route path="/statistics" name="statisticsheader" component={() => (<Header title="Stats" />)}/>
                                    <Route path="/informations" name="informationssheader" component={() => (<Header title="Informations" />)}/>
                                    <Route path="/admin" name="adminheader" component={() => (<Header title="Admin" />)}/>
                                    <Route path="/cases/:id" name="caseheader" component={({match}) => (<Header title="Case" match={match}/>)}/>
                                    <Route path="/patients/:id" name="patientheader" component={({match}) => (<Header title="Patient" match={match}/>)}/>
                                </header>
                                <Aside/>
                                <main className="mdl-layout__content mdl-color--grey-100">
                                    <div className="mdl-grid demo-content">
                                        <Route path="/" exact={true} name="index" component={Index}/>
                                        <Route path="/index" exact={true} name="index" component={Index}/>
                                        <Route path="/cases" exact={true} name="cases" component={Cases}/>
                                        <Route path="/patients" exact={true} name="patients" component={Patients}/>
                                        <Route path="/studies" name="studies" component={Studies}/>
                                        <Route path="/statistics" name="statistics" component={Statistics}/>
                                        <Route path="/informations" name="informations" component={Informations}/>
                                        <Route path="/admin" name="admin" component={Admin}/>
                                        <Route path="/cases/:id" name="case" component={Case}/>
                                        <Route path="/patients/:id" name="patient" component={Patient}/>
                                    </div>
                                </main>
                            </div>
                            <div className="snackbarContainer">
                                <Snackbar
                                    open={this.state.open}
                                    message={this.state.message}
                                    autoHideDuration={4000}
                                    onRequestClose={this.handleRequestClose}
                                />
                            </div>
                        </div>
                    </MuiThemeProvider>
                </Router>
            </div>
        );
    }
}
