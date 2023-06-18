/* eslint-disable @typescript-eslint/no-var-requires */
import { Flow } from './Flow'

import Session from './Session'

export enum NodeMessageTypes {
  TEXT,
  FILE,
  OPTIONS_LIST,
}

interface NodeMessageOptions {
	field: string;
	value: string;
	flowTo?: any;
	nodeTo?: any;
}

export interface NodeMessage {
	text?: string;
	url?: string;
	options?: NodeMessageOptions[]
	type: NodeMessageTypes;
}

export interface TransitionByAnswers {
	[key: string]: any
}

export interface NodeParams {
  messages: NodeMessage[]
	transitionByAnswer?: TransitionByAnswers
}

export class Node {
	messages: NodeParams['messages']
	transitionByAnswer?: TransitionByAnswers

	constructor(params: NodeParams) {
		this.messages = params.messages
		this.transitionByAnswer = params.transitionByAnswer
	}

	beforeEntry() :void {
		return
	}

	beforeTransition() :void {
		return
	}

	onEntry() :void {
		return
	}

	onResponse(response: string) : string {
		return response
	}

	onError() :void {
		return
	}

	onProcess = () => {

		return this.messages
	}
}