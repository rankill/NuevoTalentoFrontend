/* Nuevo Talento main scripting file *
 * @version 1.0
 * GIT URL -  https://github.com/rankill/RockaLabsFrontendTest
 * Author - Rankill
 */

(function(undefined) {
    'use strict';
    /**
     * Event to check if the nav menu in phone is clicked outside and hide that menu
     */

    var currentNav = document.getElementById('nav_menu');
    var openCloseNavTrigger = document.getElementById("navMenu_callback");
    ("mousedown touchstart".split(" ")).forEach(function(e){
        window.addEventListener(e,function( event ) {
            console.warn(event.target)
            if(openCloseNavTrigger.checked) {
                var isClickInside = currentNav.contains(event.target);
                if (!isClickInside) {
                    openCloseNavTrigger.checked = false;
                }
            }
        },false);
    });


    /**
     * Function to load the json data and build the nav of the webpage dynamically
     * @param _jsonFile
     * @param _callback
     */
    function loadJSONAndBuildNav(_jsonFile, _callback) {

        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', _jsonFile, true); // Replace 'my_data' with the path to your file
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                _callback(xobj.responseText);
            }
        };
        xobj.send(null);
    }


    loadJSONAndBuildNav('resources/data/menu.json', function(response) {
        // Parse JSON string into object
        var actual_JSON = JSON.parse(response);

        console.warn(actual_JSON)
    });



    document.getElementsByTagName('input').onchange = function(){
        console.warn("Cambie de input papu")
    }

}());
