import { NodeMessage } from './Node'
export default interface Emitter {
  sendMessage(message: NodeMessage): void;
}