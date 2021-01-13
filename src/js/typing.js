export default class Typing {
    constructor(messageArr) {
        this.typingElem = document.querySelector('.typing');
        this.messageArr = messageArr;
        this.currentIdx = 0;
        this.typingIdx = 0;
        this.typingRafId;
        this.typingRafCnt = 0;
        this.typingStr = '';
        this.typingMode = 'typing';
        this.typingState = true;
    }

    play() {
        this.typingRafCnt++;    
        if(this.typingRafCnt % 15 === 0 && this.typingState) {
            switch(this.typingMode) {
                case "typing" : 
                    const strArr = this.messageArr[this.currentIdx].split('');
                    let char = strArr[this.typingIdx++];
                    if(char === ' '){
                        const span = document.createElement('span');
                        span.classList.add('space');
                        this.typingElem.appendChild(span);
                        this.typingStr = '';
                    }
    
                    if(document.querySelector('.space')) {
                        this.typingStr = this.typingStr.concat(char);
                        document.querySelector('.space').textContent = this.typingStr;
                    }else {
                        this.typingStr = this.typingStr.concat(char);
                        this.typingElem.textContent = this.typingStr;
                    }
                    
                    if(this.typingIdx === strArr.length) {
                        if(this.currentIdx === this.messageArr.length - 1) {
                            cancelAnimationFrame(() => {this.typingRafId});
                            return;
                        }
                        this.typingIdx = 0;
                        this.currentIdx++;
                        this.typingState = false;
                        setTimeout(() => {
                            this.typingState = true;
                            this.typingMode = 'delete';
                        }, 1000);
                    }
                    break;
                case "delete" :
                    if(document.querySelector('.space')) {
                        if(this.typingStr.length === 0) {
                            this.typingElem.removeChild(document.querySelector('.space'));
                        } else {
                            this.typingStr = this.typingStr.slice(0, -1);
                        document.querySelector('.space').textContent = this.typingStr;
                        }
                        
                    }else {
                        this.typingStr = this.typingElem.textContent.slice(0, -1);
                        this.typingElem.textContent = this.typingStr;
                        if(this.typingStr.length === 0) {
                            this.typingMode = 'typing';
                        }
                    }
    
                    break;
                default: throw new Error('Not valid typing mode');
            }
                
            }
            this.typingRafId = requestAnimationFrame(() => this.play());
    }
}

