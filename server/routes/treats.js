var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/sigma';

// Route: get treats
router.get('/', function(req, res) {
    console.log('get /');

    pg.connect(connectionString, function(err, client, done) {
        console.log('connection started');
        if (err) {
            console.log('connection error: ', err);
            res.sendStatus(500);
        }

        client.query(
            'SELECT * FROM treats',
            function(err, result) {
                done(); // close the connection.

                if (err) {
                    console.log('select query error: ', err);
                    res.sendStatus(500);
                }
                // console.log(result.rows);
                res.send(result.rows);
            }
        );
    });
}); // end route get treats

// Route: add treat
router.post('/', function(req, res) {
    console.log('post /');
    var treat = req.body;

    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log('connection error: ', err);
            res.sendStatus(500);
        }
        client.query(
            'INSERT INTO treats (name, description, pic) VALUES ($1, $2, $3)',
            [treat.name, treat.description, treat.url],
            function(err, result) {
                done();

                if (err) {
                    console.log('insert query error: ', err);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(201);
                }
            });
    });
}); // end route add treat

// Route: search treats
router.get('/:searchArg', function(req, res) {
  var searchArg = '%' + req.params.searchArg + '%';

    console.log('get /:searchArg', searchArg);

    pg.connect(connectionString, function(err, client, done) {
        console.log('connection started');
        if (err) {
            console.log('connection error: ', err);
            res.sendStatus(500);
        }

        client.query(
            "SELECT * FROM treats WHERE name LIKE $1",
            [searchArg],
            function(err, result) {
                done(); // close the connection.

                if (err) {
                    console.log('select query error: ', err);
                    res.sendStatus(500);
                }
                console.log(result.rows);
                res.send(result.rows);
            }
        );
    });
}); // end route search treats

// Route: Delete treat
router.delete('/delete/:id', function(req, res) {
    var treatId = req.params.id;
    // treatId = parseInt(treatId);

    console.log('treat to delete: ', treatId);

    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log('connection error: ', err);
            res.sendStatus(500);
        }

        client.query(
            'DELETE FROM treats WHERE id = $1', [treatId],
            function(err, result) {
                done();

                if (err) {
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
            }
        );
    });
}); // end route Delete treat

module.exports = router;
