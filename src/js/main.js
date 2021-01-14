
import Typing from './typing.js';
(() => {
    const messageArr = ["항상 성장하는", "기본이 충실한"];
    const typing = new Typing(messageArr);
    const mainElem = document.querySelector('#main');
    const headerElem = document.querySelector('#header');
    const nextPageBtn = document.querySelector('.next-page');
    const sceneInfo = [
        {   
            scrollHeight: 0,
            objs: {
                homeContentElem: document.querySelector('#home .content'),
                skillColumnElem: document.querySelectorAll('.skill-column'),
            },
            values: {
                skillColumn_opacity: [0, 1, {start: 0.65, end: 0.9}],
                skillColumn_translateY:[1, 0, {start:0.65, end: 0.9}],
            }
        },
        {   
            scrollHeight: 0,
            objs: {

            },
            values: {

            }
        },
        {   
            scrollHeight: 0,
            objs: {

            },
            values: {

            }
        },
    ]
    let yOffset;
    let prevScrollHeight = 0;
    let currentScene = 0;
    let enterNewScene = false;

    function setLayout() {
        const mainSectionList = Array.from(mainElem.children)
                                .filter(section => section.id !== 'header');
        for(const idx in mainSectionList) {
            sceneInfo[idx].scrollHeight = mainSectionList[idx].offsetHeight;
        }
        yOffset = window.pageYOffset;
        let totalScrollHeight = 0;
        for(let i=0; i<sceneInfo.length; i++) {
            totalScrollHeight += sceneInfo[i].scrollHeight;
            if(totalScrollHeight >= yOffset) {
                currentScene = i;
                break;
            }
        }
    }
    
    function scrollLoop() {
        enterNewScene = false;
        prevScrollHeight = 0;
        for(let i=0; i<currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }

        if(yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            enterNewScene = true;
            if(currentScene < sceneInfo.length - 1) {
                currentScene++;
            }
        }

        if(yOffset < prevScrollHeight) {
            enterNewScene = true;
            if(currentScene === 0) return;
            currentScene--;
        }

        if(enterNewScene) return;

        playAnimation();
    }
    
    function playAnimation() {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset - prevScrollHeight;
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;

        switch(currentScene) {
            case 0: 
                const speed = objs.homeContentElem.dataset.speed;
                objs.homeContentElem.style.transform = `translateY(${yOffset * speed}px)`;
                const columnList = Array.from(objs.skillColumnElem);
                for(const idx in columnList) {
                    columnList[idx].style.opacity = `${calcValues(values.skillColumn_opacity, currentYOffset)}`;
                    columnList[idx].style.transform = `translateY(${calcValues(values.skillColumn_translateY, currentYOffset) * 100 }px)`;
                };
                
                break;
            case 1:
                break;
            case 2:
                break;
        }

    }

    function calcValues(values, currentYOffset) {
        let result;
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const partScrollStart = values[2].start * scrollHeight;
        const partScrollEnd = values[2].end * scrollHeight;
        const partScrollHeight = partScrollEnd - partScrollStart;

        if(currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
            result = ((currentYOffset - partScrollStart) / partScrollHeight) * (values[1] - values[0]) + values[0];
        } else if(currentYOffset < partScrollStart) {
            result = values[0];
        } else if(currentYOffset > partScrollEnd) {
            result = values[1];
        }

        return result;
    }

    function headerClickHandler(e) {
        let target = e.target;
        console.log(target);
        if(target.matches('.hamburger-menu')) {
            headerElem.classList.toggle('show');
            }

        if(target.tagName === 'A') {
            scrollIntoView(target.dataset.category);
            headerElem.classList.remove('show');
        }
    }

    function scrollIntoView(selector) {
        const scrollTo = document.querySelector(selector);
        let topValue = scrollTo.offsetTop;
        if(scrollTo.offsetParent) {
            topValue += scrollTo.offsetParent.offsetTop;
        }
        window.scrollTo({top: topValue, behavior: 'smooth'});
    }

    function headerFixHandler() {
        if(yOffset >= innerHeight) {
            mainElem.classList.add('fixed');
        } else {
            mainElem.classList.remove('fixed');
        }
    }

    function init() {
        typing.play();
        headerElem.addEventListener('click',headerClickHandler);
        nextPageBtn.addEventListener('click', function () {
            scrollIntoView(this.dataset.category);
        });
        window.addEventListener('scroll', () => {
            yOffset = window.pageYOffset;
            console.log(yOffset);
            scrollLoop();
            headerFixHandler();
        });
        window.addEventListener('load', () => {
            yOffset = window.pageYOffset;
            headerFixHandler();
            setLayout();
        });
    }
    console.log(document.body.offsetHeight - innerHeight);
    init();
})();