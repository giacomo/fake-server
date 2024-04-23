# fake-server

## Easy way to mock RESTful APIs

Create a fake server using a YAML file to mock various RESTful API endpoints.

## Installation

To install the necessary dependencies, run:

```bash
yarn install
```

## Usage

To run the fake server, execute the following command:

```bash
node index.js [path/to/your/server.yaml]
```

If no YAML file is specified, the server will default to `server.yaml`.

## YAML File Example

```yaml
- path: /api/v1/users
  method: GET
  response:
    status: 200
    body:
      - name: John
      - name: Jane
      - name: Jack

- path: /api/v1/auth/login
  method: POST
  response:
    status: 200
    body:
      access_token: 1234567890
```

## Features

- **Mocking Endpoints**: Easily mock RESTful API endpoints by defining routes in a YAML file.
- **Custom Responses**: Define custom responses including status codes, JSON bodies, and delays.
- **External Server Bypass**: Bypass responses and fetch data from an external server if needed.

## Dependencies

- [Express](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js.
- [js-yaml](https://github.com/nodeca/js-yaml) - YAML parser and dumper for JavaScript.
- [cors](https://github.com/expressjs/cors) - CORS middleware for Express.
- [body-parser](https://github.com/expressjs/body-parser) - Node.js body parsing middleware.
- [request](https://github.com/request/request) - Simplified HTTP request client.

## License

This project is licensed under the MIT License.
