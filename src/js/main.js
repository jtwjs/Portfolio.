
import Typing from './typing.js';
(() => {
    const messageArr = ["항상 성장하는", "기본이 충실한"];
    const typing = new Typing(messageArr);
    const homeContentElem = document.querySelector('#home .content');
    const mainElem = document.querySelector('#main');
    const headerElem = document.querySelector('#header');
    const nextPageBtn = document.querySelector('.next-page');
    let yOffset;


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
            const speed = homeContentElem.dataset.speed;
            homeContentElem.style.transform = `translateY(${yOffset * speed}px)`;
            headerFixHandler();
        });
        window.addEventListener('load', () => {
            yOffset = window.pageYOffset;
            headerFixHandler();
        });
    }

    init();
})();