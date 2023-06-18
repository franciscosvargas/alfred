import express from 'express'
import http from 'http'
import { Server } from 'socket.io'

import MainFlow from '../../../flows/Main/flow'
import Session from '../../Session'

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {
	const session = new Session('id_atendimento', MainFlow, io)

	socket.on('message', (msg) => {
		session.newClientMessage(msg)
	})
})

server.listen(3000, () => {
	console.log('listening on *:3000')
})