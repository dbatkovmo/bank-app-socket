# Bank App Socket

Demo `sevrer`: [bank-app-socket.up.railway.app](https://bank-app-socket.up.railway.app/)<br />
Demo `client`: [bank-just.web.app](https://bank-just.web.app/)<br />

### Functional:

* Socket Chatting
* Database mysql
* JWT socket auth or FingerPrint
* Docker container (in progress)
* etc. in development

## Available Scripts

In the project directory, you can run:

### `npm start`

Run server in the `production` mode.<br />
To check [.env.production](.env.production) variables.

### `npm run dev`

Run node server on port 5050 in the `development` mode.<br />
Open [localhost:5050](http://localhost:5050) to view it in the browser.<br />
The server will `auto restart` after making changes

### `npm run build`

If necessary, compile the project to `native` js.<br />
When deployed to railway, build occurs on their server via this command

### `npm run start:prod`

The command to run the `compiled` project on the server

### `npm run prettier`

For auto-formatting and styling of the code in the entire project

# Deploy Railway

1. Run `npm run prettier`
2. You need to commit to the `release` branch.
3. The deployment will `start automatically` - view detail on [Railway](https://railway.com)

### Stack:

`NodeJS` `Express` `Typescript` `Socket.io`<br />
`JWT` `Mysql2` `Nodemon` `Prettier` `Docker`<br />

