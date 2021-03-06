
import Typing from './typing.js';
(() => {

    const messageArr = ["항상 성장하는", "기본이 충실한"];
    const typing = new Typing(messageArr);
    const mainElem = document.querySelector('#main');
    const headerElem = document.querySelector('#header');
    const nextPageBtn = document.querySelector('.next-page');
    const projectElem = document.querySelector('#projects');
    const projectListElem = document.querySelector('.project-list');
    const projectList = Array.from(projectListElem.children);
    const backToTopElem = document.querySelector('.back-to-top');
    const categories = {
        selectCategory(elem) {
            selectCategory = elem;
        },

        inactive(elem) {
            elem.classList.remove('selected');
        },

        actvie(elem) {
            elem.classList.add('selected');
            this.selectCategory(elem);
        }
    };

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
                skillColumn_mobile_opacity: [[0, 1, {start: 0.3, end: 0.5}],
                                            [0, 1, {start: 0.5, end: 0.7}],
                                            [0, 1, {start: 0.7, end: 0.9}]],
                skillColumn_mobile_tanslateY: [[1, 0, {start: 0.3, end: 0.5}],
                                            [1, 0, {start: 0.5, end: 0.7}],
                                            [1, 0, {start: 0.7, end: 0.9}]],
            }
        },
        {   
            scrollHeight: 0,
            objs: {
                projectColumnElem: document.querySelectorAll('.project-column'),

            },
            values: {
                projectColumn_opacity: [0, 1, {start: 0.5, end: 0.8}],
                projectColumn_translateY: [1, 0, {start: 0.5, end: 0.8}],
                projectColumn_mobile_opacity: [],
                projectColumn_mobile_translateY: [],
            }
        },
        {   
            scrollHeight: 0,
            objs: {
                contactContentElem: document.querySelector('#contact .content'),
            },
            values: {
                contactContentElem_opacity: [0, 1, {start: 0.3, end: 0.8}],
                contactContentElem_translateY: [1, 0, {start: 0.3, end: 0.8}],

            }
        },
    ]
    let yOffset;
    let prevScrollHeight = 0;
    let currentScene = 0;
    let enterNewScene = false;
    let isMobile =  matchMedia("screen and (max-width:1024px)").matches;
    let selectCategory;


    function setPropertyViewportHieght() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

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
                    if(isMobile) {
                        columnList[idx].style.opacity = `${calcValues(values.skillColumn_mobile_opacity[idx], currentYOffset)}`;
                        columnList[idx].style.transform = `translateY(${calcValues(values.skillColumn_mobile_tanslateY[idx], currentYOffset) * 100 }px)`;
                    } else {
                        columnList[idx].style.opacity = `${calcValues(values.skillColumn_opacity, currentYOffset)}`;
                        columnList[idx].style.transform = `translateY(${calcValues(values.skillColumn_translateY, currentYOffset) * 100 }px)`;
                    }
                    
                };
                
                break;
            case 1:
                const projectList = Array.from(objs.projectColumnElem);
                function valuesInit(start, end) {
                    const length = projectList.length - 1;
                    const ratio = Number((0.5 / length).toFixed(2));
                    console.log(ratio);
                    let startValue = ratio;
                    let endValue = 0;
                    return projectList.map(() => {
                        startValue += ratio;
                        endValue = startValue + ratio;
                        return  [start,end,{start: startValue , end: endValue}];
                      });
                }
                
                values.projectColumn_mobile_opacity = valuesInit(0,1);
                values.projectColumn_mobile_translateY = valuesInit(1,0);
                    console.log(values.projectColumn_mobile_opacity);

                for(const idx in projectList) {
                    if(isMobile) {
                        projectList[idx].style.opacity = `${calcValues(values.projectColumn_mobile_opacity[idx], currentYOffset)}`;
                        projectList[idx].style.transform = `translateY(${calcValues(values.projectColumn_mobile_translateY[idx], currentYOffset) * 100}px)`;
                        
                    } else {
                        projectList[idx].style.opacity = `${calcValues(values.projectColumn_opacity, currentYOffset)}`;
                        projectList[idx].style.transform = `translateY(${calcValues(values.projectColumn_translateY, currentYOffset) * 100}px)`;
                    }
                }
                break;
            case 2:
                objs.contactContentElem.style.opacity = `${calcValues(values.contactContentElem_opacity, currentYOffset)}`;
                objs.contactContentElem.style.transform = `translateY(${calcValues(values.contactContentElem_translateY,currentYOffset) * 100}px)`;
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

    function projectClickHandler(e) {
        let target = e.target;

        if(target.matches('.division-btn')) {
            selectCategory = document.querySelector('.division-btn.selected');
            const division = target.dataset.category;
            oneOfThem(target);
            projectListElem.classList.add('ani-out');

            projectListElem.addEventListener('transitionend', () => {

                switch(division) {
                    case 'all':
                        projectListElem.setAttribute('class', 'project-list')
                        break;
                    case 'front':
                        projectListElem.setAttribute('class', 'project-list front')
                        break;
                    case 'back':
                        projectListElem.setAttribute('class', 'project-list back')
                        break;
                }
                setLayout();
            });
        }
    }

    function oneOfThem(elem) {
        if(selectCategory) {
            categories.inactive(selectCategory);
        }
        categories.actvie(elem);
    }

    function projectHoverHandler(e) {
        let target = e.target;
        if(target.matches('.column-content')) {
            const projectName = target.dataset.project;
            const img = target.querySelector('.project-info img');
            projectList.map(project => {
                if(project.children[0].dataset.project !== projectName) {
                    project.style.opacity = '0.4';
                } 
            })
            switch(projectName) {
                case 'carrotGame': 
                        img.src = './src/assets/img/carrot_game.gif';
                    break;
                case 'neighborhood':
                        img.src = './src/assets/img/neighborhood.gif';
                    break;
                case 'bastad':
                        img.src = './src/assets/img/bastad.gif';
                    break;
                case 'youtube':
                        img.src = './src/assets/img/youtubeClone.gif';
                    break;
                case 'nongshim':
                        img.src = './src/assets/img/nongshim.gif';
                    break;
            }
        }
    }

    function projectMouseOutHandler(e) {
        let target = e.target;
        if(target.matches('.column-content')) {
            const projectName = target.dataset.project;
            const img = target.querySelector('.project-info img');
            projectList.map(project => {
                if(project.children[0].dataset.project !== projectName) {
                    project.style.opacity = '1';
                } 
            })
            switch(projectName) {
                case 'carrotGame': 
                        img.src = './src/assets/img/carrot_game.png';
                    break;
                case 'neighborhood':
                        img.src = './src/assets/img/neighborhood.png';
                    break;
                case 'bastad':
                        img.src = './src/assets/img/bastad.png';
                    break;  
                case 'youtube':
                        img.src = './src/assets/img/youtubeClone.png';
                    break;
                case 'nongshim':
                        img.src = './src/assets/img/nongshim.png';
                    break;
            }
        }
    }

    function init() {
        setPropertyViewportHieght();
        typing.play();
        headerElem.addEventListener('click',headerClickHandler);

        nextPageBtn.addEventListener('click', function () {
            scrollIntoView(this.dataset.category);
        });
        backToTopElem.addEventListener('click', function () {
            scrollIntoView(this.dataset.category);
        })

        projectElem.addEventListener('click', projectClickHandler);        
        projectListElem.addEventListener('mouseover', projectHoverHandler);
        projectListElem.addEventListener('mouseout', projectMouseOutHandler);

        window.addEventListener('scroll', () => {
            yOffset = window.pageYOffset;
            scrollLoop();
            headerFixHandler();
        });
        window.addEventListener('load', () => {
            yOffset = window.pageYOffset;
            headerFixHandler();
            setLayout();
        });

        window.addEventListener('orientationchange', () => {
            setPropertyViewportHieght();
        });
        window.addEventListener('resize', () => {
            setPropertyViewportHieght();
            setLayout();
            isMobile =  matchMedia("screen and (max-width:1024px)").matches;
            console.log(isMobile);
        })
    }
    init();
})();