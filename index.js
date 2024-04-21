/**
 * Create a fake server using a yaml file
 *
 * yaml file example:
 *
 * - path: /api/v1/users
 *   method: GET
 *   response:
 *    status: 200
 *    body:
 *     - name: John
 *     - name: Jane
 *     - name: Jack
 *
 * - path: /api/auth/login
 *   method: POST
 *   response:
 *    status: 200
 *    body:
 *     access_token: 1234567890
 */

const express = require('express');
const bodyParser = require('body-parser');
const yaml = require('js-yaml');
const cors = require('cors');
const fs = require('fs');
const request = require('request');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// parse passed arguments to get the yaml file
let file = process.argv[2];

if (!file) {
    console.log('Switching to default server.yaml file');
    file = 'server.yaml';
}

const yamlFile = yaml.load(fs.readFileSync(file, 'utf8'));

// check if yaml file is valid
if (!yamlFile) {
    console.log('Invalid yaml file');
    process.exit(1);
}

yamlFile.forEach((route) => {
    app[route.method.toLowerCase()](route.path, (req, res) => {
        // if token is required and not provided return 401
        if (route.token === 'required' && !req.headers.authorization) {
            return res.sendStatus(401);
        }

        // if response is bypass return response from the external server
        if (route.response.bypass) {
            // build the request url from the get route path
            // console.log(req.originalUrl);

            // get array of path segments :id => 1234
            const pathName = route.path.split('/');
            const pathSegments = req.originalUrl.split('/');

            // get only segments that are not equal and pathName starts with : in a list of array with name and value
            const params = pathName.map((segment, index) => {
                if (segment.startsWith(':')) {
                    return [segment, pathSegments[index]];
                }
            }).filter((segment) => segment);

            // exchange the segments of the server url
            let url = route.response.server.url;
            params.forEach(([name, value]) => {
                url = url.replace(name, value);
            });

            // make the request to the server and get the response
            return request(url, (error, response, body) => {
                if (error) {
                    console.error(error);
                    return res.status(500).send('Error');
                }
                return res.status(response.statusCode).send(body);
            });
        }

        // if response has json return json
        route.response.json = route.response.json || false;
        if (route.response.json !== false) {
            return res.status(route.response.status).json(route.response.json);
        }

        // if response has delay return response after delay
        route.response.delay = route.response.delay || 0;

        setTimeout(() => {
            if (typeof route.response.body === 'undefined') {
                return res.sendStatus(route.response.status);
            }

            return res.status(route.response.status).send(route.response.body);
        }, route.response.delay);
    });
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});