import dispatcher from "../dispatcher";

export function filter(id, checked) {
    dispatcher.dispatch({
        type: "FILTER_CASE_CHANGE",
        id: id,
        checked: checked
    })
}

export function search(string) {
    dispatcher.dispatch({
        type: "SEARCH_CASE_CHANGE",
        string: string,
    })
}

export function changeHeaderTitle(string) {
    dispatcher.dispatch({
        type: "CHANGE_HEADER_TITLE",
        title: string,
    })
}

export function reloadCases() {
    dispatcher.dispatch({
        type: "RELOAD_CASES"
    });
    let apiUrl;
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        apiUrl = "http://localhost:3000/api/cases";
    } else {
        apiUrl = "/api/cases";
    }
    fetch(apiUrl)
        .then((resp) => resp.json())
        .then(function(data) {
            dispatcher.dispatch({
                type: "RECEIVE_CASES",
                cases: data['content']
            });
        });
}

export function sendCase(id, form) {
    let apiUrl;
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        apiUrl = "http://localhost:3000/api/cases/" + id;
    } else {
        apiUrl = "/api/cases/" + id;
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
                type: "RECEIVE_CASE_UPDATE",
                data: data
            });
        });
}