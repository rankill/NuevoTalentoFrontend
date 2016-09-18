/* Nuevo Talento main scripting file *
 * @version 1.0
 * GIT URL -  https://github.com/rankill/RockaLabsFrontendTest
 * Author - Rankill
 */

(function(undefined) {
    'use strict';
    /**
     * Instructions to check if the nav menu in phone is clicked outside and hide this
     */
    var currentNav = document.getElementById('nav_menu'); //Init validation to close the nav when it is open and the user clicks outside it
    var openCloseNavTrigger = document.getElementById("navMenu_callback");


    clickOutSide(currentNav, function () {
        if(openCloseNavTrigger.checked) {
            openCloseNavTrigger.checked = false;
        }
    });


    /**
     * INit the json nav menu load to build the main webpage nav
     */
    loadJSON('resources/data/menu.json', createNavList);


    /**
     * Function that create the nav list of thw webpage, with an external file that contains all the items
     * @param _responseParsed
     * @param _responseOriginal
     */
    function createNavList(_responseParsed, _responseOriginal) {

        var currentUL = document.getElementsByClassName("nav_list");

        for (var i=0; i<currentUL.length; i++) {
            var unorderedList = new UnorderedList
            (
                //List items to create the ul
                _responseParsed.items,

                //Unordered list to update

                currentUL[i],

                // classes ul items
                // principal ul, principal li, pricipal li link, sub ul and sub li
                //_mainUlClass, _mainliClass, _mainLiLinkClass, _subUlCLass, _subLiCLass
                '', 'nav_list_wrapper', 'nav_item', 'nav_subitems'
            );

            unorderedList.buildList();
        }



    }


    ///// OBJECTS ORIENTED ////

    function UnorderedList (_itemsList, _currentUl, _mainUlClass, _mainliClass, _mainLiLinkClass, _subUlCLass, _subLiCLass){
        //private vars
        var self = this;

        //public vars
        this.items = _itemsList;
        this.currentUL = _currentUl;
        this.mainUlClass = _mainUlClass;
        this.subUlCLass = _subUlCLass

        this.mainliClass = _mainliClass;
        this.mainLiLinkClass = _mainLiLinkClass;
        this.subLiCLass = _subLiCLass

        this.currentOpenSubMenu = null;

        //private methds

        function setOpenSubMenu(_menu) {
            self.currentOpenSubMenu = _menu;
        }

        function getOpenSubMenu(_class) {
            return self.currentOpenSubMenu
        }

        // public methods have access to private members
        this.createUL= function (_class) {
            var itemUL = document.createElement('ul');
            if(_class) itemUL.classList.add(_class);
            return itemUL

        };

        this.toggleSubMenu= function (_event) {
            var currentMenuTrigger = _event.target;

            //Get the last child of the trigger, this will be the caret icon
            currentMenuTrigger.lastElementChild.classList.toggle('open')

            //CUrrent submenu visible, it will be an ul
            var currentSubMenu = currentMenuTrigger.nextSibling;

            var oldMenuVisible = getOpenSubMenu();

            if(oldMenuVisible && currentMenuTrigger !== oldMenuVisible){
                oldMenuVisible.nextSibling.classList.toggle('nav_visible', false)
                oldMenuVisible.classList.toggle('open', false)
            }


            currentSubMenu.classList.toggle("nav_visible");


            //Save the current open submenu trigger
            setOpenSubMenu(currentMenuTrigger);


            /*INit validation to close a submenu if there is a click outside it*/

            var cleanSubMenus = function(e) {
                var target = e.target || e.srcElement;

                if (target !== currentSubMenu &&
                    !isChildOf(target, currentSubMenu) &&
                    !hasClass(target, 'nav_item')) {

                    var oldMenuVisible = getOpenSubMenu();

                    oldMenuVisible.nextSibling.classList.toggle('nav_visible', false)
                    oldMenuVisible.classList.toggle('open', false)
                    oldMenuVisible.lastElementChild.classList.toggle('open', false)


                    //Clean event
                    document.body.removeEventListener("mousedown",cleanSubMenus)
                }
            };


            document.body.addEventListener("mousedown",cleanSubMenus , false);
        };

        this.createLI=function (_value, _urlItem, _liClass, _linkClass)  {
            var itemLI = document.createElement('li');
            if(_liClass) itemLI.classList.add(_liClass)


            if(_urlItem) {
                var linkA = document.createElement('a');

                if(_linkClass) linkA.classList.add(_linkClass)
                // linkA.href = _urlItem;
                // linkA.target = '_blank';
                linkA.appendChild(document.createTextNode(_value));

                itemLI.appendChild(linkA)
            }


            return [itemLI, linkA];

        }

    }


    /**
     * Protoype of the entity UnorderedList
     * @type {{constructor: UnorderedList, buildList: UnorderedList.buildList}}
     */
    UnorderedList.prototype = {
        constructor: UnorderedList,

        /**
         * Funtion that creates (if new) a two level unordered list
         * @returns {*[]}
         */
        buildList:function ()  {
            var itemUL = this.currentUL;
            var isNew = !itemUL;

            if(!itemUL) {
                itemUL = this.createUL();
            }

            if(this.mainUlClass)  itemUL.classList.add(this.mainUlClass);

            for(var i=0; i< this.items.length; i++){
                var currentItem = this.items[i];

                var currentLI = this.createLI(currentItem.label, currentItem.url, this.mainliClass, this.mainLiLinkClass);

                if(currentItem.items.length > 0){

                    if(currentLI[1])  {
                        var eventHandler = _hasTouch() ? 'touchstart':'mousedown';

                        currentLI[1].addEventListener(eventHandler, this.toggleSubMenu, false);

                        var spanCaret = document.createElement('span');

                        spanCaret.className = "icon_caret";

                        currentLI[1].appendChild(spanCaret)
                    }

                    var currentSubUL = this.createUL(this.subUlCLass);

                    for(var j=0; j<currentItem.items.length; j++ ){
                        var currentSubItem = currentItem.items[j];
                        var currentSubLI = this.createLI(currentSubItem.label, currentSubItem.url, this.subLiCLass);

                        if(this.subLiCLass)  currentSubLI[0].classList.add(this.subLiCLass);

                        currentSubUL.appendChild(currentSubLI[0]);
                    }

                    currentLI[0].appendChild(currentSubUL)
                }

                itemUL.appendChild(currentLI[0]);
            }

            return [itemUL, isNew];
        }
    };


    //// Helpers ////

    /**
     * Function that validates if there is a click outside an element passed by params, an returns the callback passed
     * @param _element
     * @param _cb
     */
    function clickOutSide(_element, _cb){

        var eventHandler = _hasTouch() ? 'touchstart':'mousedown';
        window.addEventListener(eventHandler, function( event ) {

            var isClickOutside = !_element.contains(event.target);
            if (isClickOutside) {
                _cb();
            }
        }, false);
    }

    /**
     * Function to load the json data and build the nav of the webpage dynamically
     * @param _jsonFile
     * @param _callback
     */
    function loadJSON(_jsonFile, _callback) {

        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', _jsonFile, true); // Replace 'my_data' with the path to your file
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                _callback(JSON.parse(xobj.responseText), xobj.responseText);
            }
        };
        xobj.send(null);
    }

    /**
     *  private function to attempt to figure out if we are on a touch device
     * @returns {boolean|*}
     * @private
     */
    function _hasTouch() {
        // works on most browsers, IE10/11 and Surface
        return 'ontouchstart' in window || navigator.maxTouchPoints;
    }


    /**
     * Function that returns if an element has a given class
     * @param target
     * @param className
     * @returns {boolean}
     */
    function hasClass( target, className ) {
        return new RegExp('(\\s|^)' + className + '(\\s|$)').test(target.className);
    }


    /**
     * Function that returns if an element is child of an element (parent)
     * @param child
     * @param parent
     * @returns {*}
     */
    function isChildOf(child, parent) {
        if (child.parentNode === parent) {
            return true;
        } else if (child.parentNode === null) {
            return false;
        } else {
            return isChildOf(child.parentNode, parent);
        }
    }


}());
