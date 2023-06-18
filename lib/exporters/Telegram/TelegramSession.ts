import Session from '../../Session'
import TelegramEmitter from './TelegramEmitter'
import { NodeMessage } from '../../Node'

export default  class TelegramSession implements Session {
	emmitter: any
	flowStarted: boolean
	flow: any
	attendanceId: string | number

	constructor(attendanceId: string | number, initialFlow: any, ctx: any) {
		this.flowStarted = false
		this.flow = new initialFlow(this)
		this.emmitter = new TelegramEmitter(ctx, attendanceId)
		this.attendanceId = attendanceId
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
		await this.emmitter.sendMessage(message)
	}

	newFlow = (flow: any) => {
		this.flow = new flow(this)
		this.flowStarted = false
		this.newClientMessage('')
	}

	leave = async () => {
		await this.emmitter.leaveChat()
	}
}