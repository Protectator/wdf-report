import { EventEmitter } from "events";
import React from "react";

import dispatcher from "../dispatcher";

class PatientStore extends EventEmitter {
    constructor() {
        super();
        this.patients = [];
        this.filters = {
            1: true,
            2: true,
            3: true,
            4: true
        };
        this.search = '';
        this.title = '';
    }

    refresh() {
        this.emit('patientChange');
        this.emit('filterPatientChange');
    }

    changeHeaderTitle(title) {
        this.title = (<span><i
            className="mdl-color-text--blue-grey-400 material-icons title"
            role="presentation">face</i> {title}</span>);
        this.emit('changeHeaderTitle');
    }

    reloadPatients(patients) {
        this.patients = patients;
        this.emit('patientChange');
    }

    changeFilter(id, checked) {
        this.filters[id] = checked;
        this.emit('filterPatientChange')
    }

    changeSearch(string) {
        this.search = string;
        this.emit('searchPatientChange')
    }

    getAll() {
        return this.patients;
    }

    getFilters() {
        return this.filters;
    }

    getSearch() {
        return this.search;
    }

    handleActions(action) {
        switch(action.type) {
            case "RECEIVE_PATIENTS": {
                this.reloadPatients(action.patients);
                break;
            }
            case "FILTER_PATIENT_CHANGE": {
                this.changeFilter(action.id, action.checked);
                break;
            }
            case "SEARCH_PATIENT_CHANGE": {
                this.changeSearch(action.string);
                break;
            }
            case "CHANGE_HEADER_TITLE": {
                this.changeHeaderTitle(action.title);
                break;
            }
        }
    }
}

const patientStore = new PatientStore;
dispatcher.register(patientStore.handleActions.bind(patientStore));
window.patientStore = patientStore;
window.dispatcher = dispatcher;

export default patientStore;