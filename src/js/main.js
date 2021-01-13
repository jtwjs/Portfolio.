"use strict";

(() => {

    const typingElem = document.querySelector('.typing');
    const typingMessageArr = ["항상 성장하는", "기본에 충실한"];
    let currentIdx = 0;
    let typingIdx = 0;
    let typingRafId;
    let typingRafCnt = 0;
    let typingStr = '';
    let typingMode = 'typing';
    let typingState = true;

    function typing() {
        typingRafCnt++;
  
        if(typingRafCnt % 15 === 0 && typingState) {
            switch(typingMode) {
                case "typing" : 
                    const strArr = typingMessageArr[currentIdx].split('');
                    let char = strArr[typingIdx++];
                    if(char === ' '){
                        const span = document.createElement('span');
                        span.classList.add('space');
                        typingElem.appendChild(span);
                        typingStr = '';
                    }

                    if(document.querySelector('.space')) {
                        typingStr = typingStr.concat(char);
                        document.querySelector('.space').textContent = typingStr;
                    }else {
                        typingStr = typingStr.concat(char);
                        typingElem.textContent = typingStr;
                    }
                    
                    if(typingIdx === strArr.length) {
                        if(currentIdx === typingMessageArr.length - 1) {
                            cancelAnimationFrame(typingRafId);
                            return;
                        }
                        typingIdx = 0;
                        currentIdx++;
                        typingState = false;
                        setTimeout(() => {
                            typingState = true;
                            typingMode = 'delete';
                        }, 1000);
                    }
                    break;
                case "delete" :
                    if(document.querySelector('.space')) {
                        if(typingStr.length === 0) {
                            typingElem.removeChild(document.querySelector('.space'));
                        } else {
                            typingStr = typingStr.slice(0, -1);
                        document.querySelector('.space').textContent = typingStr;
                        }
                        
                    }else {
                        typingStr = typingElem.textContent.slice(0, -1);
                        typingElem.textContent = typingStr;
                        if(typingStr.length === 0) {
                            typingMode = 'typing';
                        }
                    }
    
                    break;
                default: throw new Error('Not valid typing mode');
            }
                
            }
            typingRafId = requestAnimationFrame(typing);
        }


    function init() {
        typing();
    }

    init();
})();