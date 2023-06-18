import Session from './Session'
import FinalizaAtendimentoNode from './nodes/FinalizaAtendimento'
import { NodeMessage, NodeMessageTypes } from './Node'
export enum FlowTypes {
  TEXT,
  FILE,
  OPTIONS_LIST,
}

interface FlowParams {
  nodes: Array<any>
}

export class Flow {
	nodes: FlowParams['nodes']
	actualNodeIndex: number
	actualNode?: any 
	session: Session

	constructor(params: FlowParams, session: Session) {
		this.nodes = params.nodes
		this.actualNodeIndex = 0
		this.session = session
	}

	init = () =>  {
		this.executeNode()
	}

	navigate = (response?: string): void => {
		const lastNodeOnFlow = this.actualNodeIndex === this.nodes.length - 1

		if(lastNodeOnFlow) {
			const lastMessageOnNode = this.actualNode.messages[this.actualNode.messages.length - 1]
			const lastMessageIsOptionList = lastMessageOnNode.type === NodeMessageTypes.OPTIONS_LIST

			if(!lastMessageIsOptionList) {
				return this.onFinish()
			}

			const optionSelected = lastMessageOnNode.options
				.find((option: any) => option.value === response)

			if(!optionSelected) {
				this.retryNode()
				return
			}

			if(optionSelected.nodeTo) {
				this.nodes.push(optionSelected.nodeTo)
				return this.navigate()
			}

			if(optionSelected.flowTo) {
				return this.session.newFlow(optionSelected.flowTo)
			}
		} else {
			this.actualNodeIndex = this.actualNodeIndex + 1
			this.executeNode(response)
		}
	}

	public onFinish = () => {
		const Node = new FinalizaAtendimentoNode()

		const messages = Node.messages

		messages
			.forEach((message: NodeMessage) => {
				this.session.sendMessage(message)
			})

		this.session.leave()
	}

	transition = (NewFlow: any) => {
		const FlowRef = new NewFlow() 
		FlowRef.init()
	}

	sendMessage = (message: NodeMessage) => {
		this.session.sendMessage(message)
	}

	executeNode = async (nodeParam?: string) => {
		const session = this.session
		const NodeRef = this.nodes[this.actualNodeIndex]
		const Node = new NodeRef(nodeParam, session)
		this.actualNode = Node

		await Node.onResponse(nodeParam)

		const messages = await Node.messages

		await Promise.all(
			messages.map(async (message: any) => {
				await this.session.sendMessage(message)
			})
		)

		if(Node.transitionByAnswer) {
			const flowToNavigate = Node.transitionByAnswer[nodeParam || '']

			if(!flowToNavigate) {
				await this.retryNode()
			}

			this.session.newFlow(flowToNavigate)
		}
	}

	retryNode = async (response?: string) => {
		await this.session.sendMessage({ 
			type: NodeMessageTypes.TEXT,
			text: 'Não consegui entender o que você quer.'
		})
		
		this.actualNodeIndex = this.actualNodeIndex - 1

		await this.executeNode(response)
		return
	}
}
