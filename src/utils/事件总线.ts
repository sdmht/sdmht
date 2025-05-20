import { Events } from 'phaser'

class 事件类 extends Events.EventEmitter {
  private eventQueue: Array<{ event: string; args: unknown[] }> = []
  private isProcessing: boolean = false

  override emit(event: string, ...args: unknown[]): boolean {
    this.eventQueue.push({ event, args })
    if (!this.isProcessing) {
      this.processQueue()
    }
    return true
  }

  private async processQueue() {
    this.isProcessing = true
    while (this.eventQueue.length > 0) {
      const { event, args } = this.eventQueue.shift()!
      super.emit(event, ...args)
    }
    this.isProcessing = false
  }
}

const 事件总线 = new 事件类()
export { 事件总线 }
