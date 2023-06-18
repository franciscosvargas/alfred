import { Node, TransitionByAnswers } from './Node'

export class TransitionNode extends Node {

	constructor(transitionByAnswer: TransitionByAnswers) {
		super({
			messages: [],
			transitionByAnswer
		})
	}
}