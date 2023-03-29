class MessageStore{
    saveMessage(message: any){}
    findMessagesForUser(userID: any){}
}

class InMemoreMessageStore extends MessageStore{
    messages: any[]
    
    constructor(){
        super()
        this.messages = []
    }

    saveMessage(message: any): void {
        this.messages.push(message)
    }

    findMessagesForUser(userID: any): any[] {
        return this.messages.filter(
            ({ from, to }) => from === userID || to === userID
        );
    }
}

export default InMemoreMessageStore