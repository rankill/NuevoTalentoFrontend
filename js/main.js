/* Nuevo Talento main scripting file *
 * @version 1.0
 * GIT URL -  https://github.com/rankill/RockaLabsFrontendTest
 * Author - Rankill
 */

(function(undefined) {
    'use strict';
    /* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
    function toggleMobileMenu() {
        var x = document.getElementById("nav_menu");
       if(x.className.indexOf('open_menu') > -1){
           x.classList.add('wait');
       }

        x.className += " responsive";

    }
}());
