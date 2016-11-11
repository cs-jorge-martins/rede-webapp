/*
	Projeto: conciliation-webapp
	Author/Empresa: Rede
	Copyright (C) 2016 Redecard S.A.
 */
 
var http = require('http');
var fs = require('fs');
var redis = require('redis');

var server = http.createServer( function(req, res) {
    res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
    });

    fs.readFile('WebContent/app/tests/fixtures/login.json', 'utf8', function(err, data) {
        var json = JSON.parse(data);
        var redisClient = redis.createClient();
        var expiration = 60 * 60 * 24; //seconds
        var tokenKey = "token:" + json.user.token;
        var pvList = json.user.pvList;

        redisClient.setex(tokenKey, expiration, JSON.stringify(pvList), function(err, resp) {
            if(err){
                console.error('Error setting Redis token.');
            }
            console.log(resp + ": Token key set.");
        });

        res.end(data);
    });
});

var port = 8030;
var host = '127.0.0.1';
server.listen(port, host);
console.log('Listening at http://' + host + ':' + port);
