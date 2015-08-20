// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/threads/threads.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.

            //With click on image prevent navigation from a page
    
            $('body').on('mouseover', function (e) {
                Globals.clickTarget = e.target;
            });

            WinJS.Navigation.addEventListener("beforenavigate", imageLoading);
           
            function imageLoading(eventObject) {

                //TODO: Put link for the big pic in the img tag
                //parse it
                //Maybe later move it to Globals.linkProcessing
                //
                //Break button in two parts, connect each part with it's own function
                //

                /*
                if (Globals.clickTarget.nodeName === 'IMG') {
                    //eventObject.detail.setPromise(WinJS.Promise.wrap(true));
                    console.log('Not empty');
                    var link = Globals.clickTarget.getAttribute('big-link');
                    console.log(link);
                } else {
                    console.log('empty');
                }
                */

            }

    
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
           
        },

        updateLayout: function (element) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in layout.
        }
    });
})();
