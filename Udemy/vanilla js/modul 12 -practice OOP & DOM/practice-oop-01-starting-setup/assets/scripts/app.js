class DOMHelper{
    static clearEventListener(element){
        const clonedElement = element.cloneNode(true); // deep clone, removing any event listener from the original element
        element.replaceWith(clonedElement); // replacing the old element with new element with no eventListener
        return clonedElement;
    }
    static moveElement(elId, newDestinationSelector){
        const element = document.getElementById(elId);
        const destinationElement = document.querySelector(newDestinationSelector);
        destinationElement.append(element);
        // because the element already existed in the DOM, using append won't copy the element
        // and instead move it.

        element.scrollIntoView({behavior: 'smooth'}); // behaviour is animation
        // when an element moved, will automatically scrolled to it
    }
}

// parent class
class Component{
    constructor(hostElementId, insertBefore = false){
        if(hostElementId){
            this.hostElement = document.getElementById(hostElementId);
        }else{
            this.hostElement = document.body;
        }

        this.insertBefore = insertBefore;
    }

    detach(){
        if(this.element){
            this.element.remove();
            // or the alternative to the code above
            // this.element.parentElement.removeChild(this.element)
        }
    }

    show(){
        // document.body.append(this.element);
        this.hostElement.insertAdjacentElement(
            this.insertBefore ? 'afterbegin' : 'beforeend', // if true use afterbegin, otherwise use beforeend
            this.element
        );
    }
}


// more info button
class Tooltip extends Component{

    constructor(closeNotifier, text, hostElementId){
        super(hostElementId);
        this.text = text;
        this.closeNotifierHandler = closeNotifier;
        this.create();
    }

    closeTooltip = () => {
        // using arrow method/function basically the same as using bind(this) on eventListener's methods!
        // so arrow methods on a class always refer to class containing the method
        // but it will be recreated every time Tooltip class instantiation.
        console.log(this + 'tooltip\'s class closeToolTip method')
        this.detach();
        this.closeNotifierHandler();
    }

    create(){
        console.log('tooltipping...')
        const newTooltipElement = document.createElement('div');
        newTooltipElement.className = 'card';
        // newTooltipElement.textContent = this.text;
        // implementing template, the alternative way is the code commented above.
        const tooltipTemplate = document.getElementById('tooltip');
        const tooltipBody = document.importNode(tooltipTemplate.content, true); // setting true, meaning all child nodes will be imported
        tooltipBody.querySelector('p').textContent = this.text;
        newTooltipElement.append(tooltipBody);

        console.log(this.hostElement.getBoundingClientRect());
        const hostElPosLeft = this.hostElement.offsetLeft;
        const hostElPosTop = this.hostElement.offsetTop;
        const hostElHeight = this.hostElement.clientHeight;
        const scrolling = this.hostElement.parentElement.scrollTop;

        const x = hostElPosLeft + 20;
        const y = hostElPosTop + hostElHeight - scrolling - 10;
        
        // positioning the tooltip
        newTooltipElement.style.position = 'absolute'; // placing element on absolute coordinate
                                                        // otherwise, it'll be relative in the doc
        newTooltipElement.style.left = x + 'px';
        newTooltipElement.style.top = y + 'px';

        newTooltipElement.addEventListener('click', this.closeTooltip);
        this.element = newTooltipElement;

    }
}

// each item
class ProjectItem{
    hasActiveTooltip = false; 
    // use to check if the more info button already clicked, 
    // and preventing 1 project's more info button to be clicked and activated 
    // multiple times

    constructor(id, updateProjectListsFunction, type){
        this.id = id;
        this.updateProjectListsHandler = updateProjectListsFunction;
        this.connectMoreInfoButton();
        this.connectSwitchButton(type);
    }

    showMoreInfoHandler(){
        if(this.hasActiveTooltip){
            return;
        }
        const projectEl = document.getElementById(this.id);
        console.log(projectEl.dataset);
        projectEl.dataset.someInfo = 'test' // setting new data- attribute
        const toolTipText = projectEl.dataset.extraInfo;
        const tooltip = new Tooltip(()=>{
            this.hasActiveTooltip = false; // executed every time more info button clicked
        }, toolTipText, this.id);
        tooltip.show();
        this.hasActiveTooltip = true;
    }

    connectMoreInfoButton(){
        const projectItemElement = document.getElementById(this.id);
        const moreInfoButton = projectItemElement.querySelector('button:first-of-type');
        moreInfoButton.addEventListener('click', this.showMoreInfoHandler.bind(this));
    }

    connectSwitchButton(type){
        const projectItemElement = document.getElementById(this.id);
        let switchButton = projectItemElement.querySelector('button:last-of-type');
        switchButton = DOMHelper.clearEventListener(switchButton); // clearing old eventListener
        switchButton.textContent = type === 'active' ? 'Finish' : 'Activate'; 
        switchButton.addEventListener('click', this.updateProjectListsHandler.bind(null, this.id));
        // we execute a method from another class in the event listener
        // when we click the button we will passing the id of the item as preset value
        // because we use bind with null as the first argument and the preset value we want as the second argument
        // we will pass on the project id of the item to the switchProject method in ProjectList class
        // and we need the projectId as the parameter of the method
    }

    update(updateProjectListsFunc, type){
        this.updateProjectListsHandler = updateProjectListsFunc;
        this.connectSwitchButton(type);
    }
}

// all projects
class ProjectList{
    projects = [];

    constructor(type){
        this.type = type;
        // the type is either active project/ finished project

        const prjItems = document.querySelectorAll(`#${type}-projects li`);
        // prjItems is the sections in the html code
        // the id in the html code is active-projects / finished-projects
        // and in instantiation we passing either active/finsihed 
        // and it will select all list items inside that active-projects/finsihed-projects sections

        for(const item of prjItems){
            this.projects.push(new ProjectItem(item.id, this.switchProject.bind(this), this.type));
            // item.id is the id of each li item in prjItems/in sections of the html code
            // binding the switchProject because we want the method to point at this class and not to the other class and the eventListener
            // because we want to use it as button's eventHandler in other class
        }

        console.log(this.projects);

    }

    setSwitchHandler(switchHandlerFunction){
        this.switchHandler = switchHandlerFunction;
    }

    addProject(project){
        // adding the object from active to finished
        this.projects.push(project);
        DOMHelper.moveElement(project.id, `#${this.type}-projects ul`);

        //updating the project's status
        project.update(this.switchProject.bind(this), this.type);

        console.log(this);
    }

    switchProject(projectId){
        // removing the object from active
        this.switchHandler(this.projects.find(function(element){
            return element.id === projectId;
            // we are searching and passing the project that we want to switch into switchHandler property
        }))
        this.projects = this.projects.filter(function(element){
            return element.id !== projectId;
            // we are keeping elements with id different than the projectId
            // and removing the one that match
        })
    }
}

// app
class App{
    static init(){ // in this app, we will call this method once
        const activeProjectList = new ProjectList('active');
        const finishedProjectList = new ProjectList('finished');
        activeProjectList.setSwitchHandler(finishedProjectList.addProject.bind(finishedProjectList));
        finishedProjectList.setSwitchHandler(activeProjectList.addProject.bind(activeProjectList));
        // we use bind because we want to execute the addProject method from finishedProjectList instance and not from activeProjectList
        // if we dont use bind, the addProject will pointed at the one at the activeProject instance
        // because we call it from the setSwitchHandler method that from activeProjectList instantiation

        // creating new script and executing it with js
        // const someScript = document.createElement('script');
        // someScript.textContent = 'alert("hi there!")';
        // document.head.append(someScript);

        this.startScript();
    }

    // executing js file from another js file
    static startScript(){
        const scriptNew = document.createElement('script');
        scriptNew.src = 'assets/scripts/new.js'
        scriptNew.defer = true;
        document.head.append(scriptNew);
    }
}

// class a{
//     constructor(x){
//         this.x=x;
//     }
//     set(br){
//         console.log('halo ' + this.x + br);
//     }
// }

// const anew = new a('vieri');
// const bnew = new a('Adhitya');

App.init(); // calling static method