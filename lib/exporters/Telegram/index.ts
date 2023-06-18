import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import TelegramSession from './TelegramSession'
import MainFlow from '../../../flows/Main/flow'

interface Sessions {
	chatId: string | number
	session: TelegramSession
}

const bot = new Telegraf('6059394069:AAGe20Yr7QTAaZ8eWZSSe9SD8e2oErUzJVk')

const actionsToListen = ['1','2', '3', '4', '5', '6', '7', '8', '9']
const sessions:Sessions[] = []
 
bot.start((ctx) => {
	const session = new TelegramSession(ctx.chat.id, MainFlow, ctx)
	sessions.push({
		chatId: session.attendanceId,
		session
	})

	session.newClientMessage('')
})

bot.on(message('text'), (ctx) => {
	const chatId = ctx.chat.id

	const session = sessions.find((s) => s.chatId === chatId)

	if(session) {
		session.session.newClientMessage(ctx.message.text)
	}
})

bot.action(actionsToListen, (ctx) => {
	const chatId = ctx?.chat?.id

	const session = sessions.find((s) => s.chatId === chatId)

	if(session) {
		session.session.newClientMessage(ctx.match[0])
	}
})

bot.launch()