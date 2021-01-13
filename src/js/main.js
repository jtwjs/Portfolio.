
import Typing from './typing.js';
(() => {
    const messageArr = ["항상 성장하는", "기본이 충실한"];
    const typing = new Typing(messageArr);
    const headerElem = document.querySelector('#header');

    function headerClickHandler(e) {
        let target = e.target;
        console.log(target);
        if(target.matches('.hamburger-menu')) {
            headerElem.classList.toggle('show');
        }

        if(target.tagName === 'A') {
            scrollIntoView(target.dataset.category);
        }
    }

    function scrollIntoView(selector) {
        const scrollTo = document.querySelector(selector);
        const topValue = scrollTo.offsetTop;
        window.scrollTo({top: topValue, behavior: 'smooth'});
    }

    function init() {
        typing.play();
        headerElem.addEventListener('click',headerClickHandler);
    }

    init();
})();