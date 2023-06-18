import Emitter from '../../Emitter'
import { Context } from 'telegraf'
import { NodeMessage, NodeMessageTypes } from '../../Node'

export default class TelegramEmitter implements Emitter {
	ctx: Context
	attendanceId: string | number

	constructor(ctx: Context, attendanceId: string | number) {
		this.ctx = ctx
		this.attendanceId = attendanceId

	}

	sendMessage = async (message: NodeMessage) => {
		if(message.type === NodeMessageTypes.TEXT) {
			await this.ctx.telegram.sendMessage(this.attendanceId, message.text || '')
		}

		if(message.type === NodeMessageTypes.OPTIONS_LIST) {

			const buttons:any = []

			message.options?.forEach((option) => {
				buttons.push([{ text: option.field, callback_data: option.value }])
			})

			await this.ctx.reply(message.text || 'Escolha uma opçao: ',{
				reply_markup: {
					inline_keyboard: [
						...buttons
					]
				}
			})
		}
			
	}

	leaveChat = async () => {
		await this.ctx.leaveChat()
	}
}