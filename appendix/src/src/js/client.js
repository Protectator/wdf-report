import React from "react";
import ReactDOM from "react-dom";

import Main from "./pages/Main";

import * as PatientActions from "./actions/PatientActions";
import * as CaseActions from "./actions/CaseActions";

const app = document.getElementById('app');

ReactDOM.render(
    <Main />
    , app);

setTimeout(PatientActions.reloadPatients, 0);
setTimeout(CaseActions.reloadCases, 0);