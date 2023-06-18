import { Server } from 'socket.io'
import { NodeMessage } from './Node'

export default class Session {
	attendanceId: string | number
	flow: any
	flowStarted: boolean

	constructor(attendanceId: string, initialFlow: any) {
		this.attendanceId = attendanceId
		this.flow = new initialFlow(this)
		this.flowStarted = false
	}

	newClientMessage = (message: string): void => {
		if(!this.flowStarted) {
			this.flow.init()
			this.flowStarted = true
			return 
		}

		this.flow.navigate(message)
	}

	sendMessage = async (message: NodeMessage) => {
		return
	}

	newFlow = (flow: any) => {
		this.flow = new flow(this)
		this.flowStarted = false
		this.newClientMessage('')
	}

	leave = () => {
		return
	}
}