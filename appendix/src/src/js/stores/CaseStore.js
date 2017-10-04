import { EventEmitter } from "events";
import React from "react";

import dispatcher from "../dispatcher";

class CaseStore extends EventEmitter {
    constructor() {
        super();
        this.cases = [];
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
        this.emit('caseChange');
        this.emit('filterCaseChange');
    }

    changeHeaderTitle(title) {
        let icon = '';
        if (title.indexOf('Patient') > -1) {
            icon = 'face'
        } else {
            icon = 'assignment';
        }
        this.title = (<span><i
            className="mdl-color-text--blue-grey-400 material-icons title"
            role="presentation">{icon}</i> {title}</span>);
        this.emit('changeHeaderTitle');
    }

    reloadCases(cases) {
        this.cases = cases;
        this.emit('caseChange');
    }

    changeFilter(id, checked) {
        this.filters[id] = checked;
        this.emit('filterCaseChange')
    }

    changeSearch(string) {
        this.search = string;
        this.emit('searchCaseChange')
    }

    getAll() {
        return this.cases;
    }

    getTitle() {
        return this.title;
    }

    getFilters() {
        return this.filters;
    }

    getSearch() {
        return this.search;
    }

    handleActions(action) {
        switch(action.type) {
            case "RECEIVE_CASES": {
                this.reloadCases(action.cases);
                break;
            }
            case "FILTER_CASE_CHANGE": {
                this.changeFilter(action.id, action.checked);
                break;
            }
            case "SEARCH_CASE_CHANGE": {
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

const caseStore = new CaseStore;
dispatcher.register(caseStore.handleActions.bind(caseStore));
window.caseStore = caseStore;
window.dispatcher = dispatcher;

export default caseStore;