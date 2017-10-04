import dispatcher from "../dispatcher";

export function filter(id, checked) {
    dispatcher.dispatch({
        type: "FILTER_PATIENT_CHANGE",
        id: id,
        checked: checked
    })
}

export function search(string) {
    dispatcher.dispatch({
        type: "SEARCH_PATIENT_CHANGE",
        string: string,
    })
}

export function changeHeaderTitle(string) {
    dispatcher.dispatch({
        type: "CHANGE_HEADER_TITLE",
        title: string,
    })
}

export function reloadPatients() {
    dispatcher.dispatch({
        type: "RELOAD_PATIENTS"
    });
    let apiUrl;
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        apiUrl = "http://localhost:3000/api/patients";
    } else {
        apiUrl = "/api/patients";
    }
    fetch(apiUrl)
        .then((resp) => resp.json())
        .then(function(data) {
            dispatcher.dispatch({
                type: "RECEIVE_PATIENTS",
                patients: data['content']
            });
        });
}

export function sendPatient(id, form) {
    let apiUrl;
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        apiUrl = "http://localhost:3000/api/patients/" + id;
    } else {
        apiUrl = "/api/patients/" + id;
    }
    let request = new Request(apiUrl, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
    });

// Now use it!
    fetch(request)
        .then((resp) => resp.json())
        .then(function(data) {
            dispatcher.dispatch({
                type: "RECEIVE_PATIENT_UPDATE",
                data: data
            });
        });
}