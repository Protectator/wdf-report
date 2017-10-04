let express = require('express');
let mysql = require('mysql');
let router = express.Router();
let config = require('../config');

function checkAuth(req, res, next) {
    next();
    /*
    if (!req.session.user_id) {
        res.send('You are not authorized to view this page');
    } else {
        next();
    }*/
}

sqlDiagList = 'SELECT * FROM diagnosisList';
sqlTreatList = 'SELECT * FROM treatmentList';
let connection = mysql.createConnection(config.mysql);
let diagnosisList;
let treatmentList;
connection.connect(function(err) {
    if (err) {
        console.error("There was an error :" + err);
        return;
    }

    connection.query(sqlDiagList, function(err, rows, fields) {
        if (!err) {
            diagnosisList = rows;
        } else {
            console.error("There was an error :" + err);
        }
    });

    connection.query(sqlTreatList, function(err, rows, fields) {
        if (!err) {
            treatmentList = rows;
        } else {
            console.error("There was an error :" + err);
        }
    });
});

router.get('/patients', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    let connection = mysql.createConnection(config.mysql);
    connection.connect(function(err) {
        if (err) {
            console.error("There was an error :" + err);
            res.send(JSON.stringify({error: err}, null, 3));
            return;
        }

        connection.query('SELECT * FROM patient_view_all', function(err, rows, fields) {
            if (!err) {
                res.send(JSON.stringify({content: rows}, null, 3));
            } else {
                console.error("There was an error :" + err);
                res.send(JSON.stringify({error: err}, null, 3));
            }
        });
    });
});

router.get('/cases', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    let connection = mysql.createConnection(config.mysql);
    connection.connect(function(err) {
        if (err) {
            console.error("There was an error :" + err);
            res.send(JSON.stringify({error: err}, null, 3));
            return;
        }

        connection.query('SELECT * FROM case_view_all', function(err, rows, fields) {
            if (!err) {
                res.send(JSON.stringify({content: rows}, null, 3));
            } else {
                console.error("There was an error :" + err);
                res.send(JSON.stringify({error: err}, null, 3));
            }
        });
    });
});

router.get('/cases/:id', function (req, res, next) {
    id = parseInt(req.params.id);
    if (!Number.isInteger(id)) {
        res.status(400).send('id is not an integer');
        return;
    }
    res.setHeader('Content-Type', 'application/json');
    let connection = mysql.createConnection(config.mysql);
    connection.connect(function(err) {
        if (err) {
            console.error("There was an error :" + err);
            res.send(JSON.stringify({error: err}, null, 3));
            return;
        }

        sql = 'SELECT * FROM case_view_all WHERE sCase_id = ' + id;
        connection.query(sql, function(err, rows, fields) {
            if (!err) {
                rows1 = rows;
                sql1 = 'SELECT * FROM ct_view WHERE sCase_id = ' + id;
                connection.query(sql1, function(err, rows, fields) {
                    if (!err) {
                        res.send(JSON.stringify({content: {case: rows1, ct: rows, diagnosisList: diagnosisList, treatmentList: treatmentList}}, null, 3));
                    } else {
                        console.error("There was an error :" + err);
                        res.send(JSON.stringify({error: err}, null, 3));
                    }
                });
            } else {
                console.error("There was an error :" + err);
                res.send(JSON.stringify({error: err}, null, 3));
            }
        });
    });
});

router.get('/patients/:id', function (req, res, next) {
    id = parseInt(req.params.id);
    if (!Number.isInteger(id)) {
        res.status(400).send('id is not an integer');
        return;
    }
    res.setHeader('Content-Type', 'application/json');
    let connection = mysql.createConnection(config.mysql);
    connection.connect(function(err) {
        if (err) {
            console.error("There was an error :" + err);
            res.send(JSON.stringify({error: err}, null, 3));
            return;
        }

        sql = 'SELECT * FROM patient_view_all WHERE patient_id = ' + id;
        connection.query(sql, function(err, rows, fields) {
            if (!err) {
                rows1 = rows;
                sql1 = 'SELECT * FROM case_view_all WHERE patient_id = ' + id;
                connection.query(sql1, function(err, rows, fields) {
                    if (!err) {
                        res.send(JSON.stringify({content: {patient: rows1, caseList: rows}}, null, 3));
                    } else {
                        console.error("There was an error :" + err);
                        res.send(JSON.stringify({error: err}, null, 3));
                    }
                });
            } else {
                console.error("There was an error :" + err);
                res.send(JSON.stringify({error: err}, null, 3));
            }
        });
    });
});

router.put('/cases/:id/', function (req, res, next) {
    id = parseInt(req.params.id);
    if (!Number.isInteger(id)) {
        res.status(400).send('id is not an integer');
        return;
    }
    res.setHeader('Content-Type', 'application/json');
    let connection = mysql.createConnection(config.mysql);
    connection.connect(function(err) {
        if (err) {
            console.error("There was an error :" + err);
            res.send(JSON.stringify({error: err}, null, 3));
            return;
        }

        let form = req.body;

        parameters = [
            id,
            form.folder_name,
            form.diagnosis,
            form.diagnosis_comment,
            form.diagnosis_CMI,
            form.diagnosis_DRG,
            form.treatment,
            form.treatment_comment,
            form.treatment_ASA,
            form.outcome_score,
            form.outcome_comment,
            form.outcome_loosening,
            form.diagnosis_date,
            form.treatment_date,
            form.outcome_date
        ];

        sqlParameters = [];

        for (let key in parameters) {
            if (parameters[key]) {
                sqlParameters.push("'" + parameters[key] + "'");
            } else {
                sqlParameters.push("NULL");
            }
        }
        sql = "CALL updateCase(" + sqlParameters.join(", ") + ")";

        connection.query(sql, function(err, rows, fields) {
            if (!err) {
                res.send(JSON.stringify({content: rows}, null, 3));
            } else {
                console.error("There was an error :" + err);
                res.send(JSON.stringify({error: err}, null, 3));
            }
        });
    });
});

router.put('/patients/:id/', function (req, res, next) {
    id = parseInt(req.params.id);
    if (!Number.isInteger(id)) {
        res.status(400).send('id is not an integer');
        return;
    }
    res.setHeader('Content-Type', 'application/json');
    let connection = mysql.createConnection(config.mysql);
    connection.connect(function(err) {
        if (err) {
            console.error("There was an error :" + err);
            res.send(JSON.stringify({error: err}, null, 3));
            return;
        }

        let form = req.body;

        parameters = [
            id,
            form.gender,
            form.birth_date,
            form.weight,
            form.height,
            form.ipp,
            form.initials
        ];

        sqlParameters = [];

        for (let key in parameters) {
            if (parameters[key]) {
                sqlParameters.push("'" + parameters[key] + "'");
            } else {
                sqlParameters.push("NULL");
            }
        }
        sql = "CALL updatePatient(" + sqlParameters.join(", ") + ")";

        connection.query(sql, function(err, rows, fields) {
            if (!err) {
                res.send(JSON.stringify({content: rows}, null, 3));
            } else {
                console.error("There was an error :" + err);
                res.send(JSON.stringify({error: err}, null, 3));
            }
        });
    });
});

router.get('/studies', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    let connection = mysql.createConnection(config.mysql);
    connection.connect(function(err) {
        if (err) {
            console.error("There was an error :" + err);
            res.send(JSON.stringify({error: err}, null, 3));
            return;
        }

        connection.query('SELECT * FROM studyList', function(err, rows, fields) {
            if (!err) {
                res.send(JSON.stringify({content: rows}, null, 3));
            } else {
                console.error("There was an error :" + err);
                res.send(JSON.stringify({error: err}, null, 3));
            }
        });
    });
});

module.exports = router;