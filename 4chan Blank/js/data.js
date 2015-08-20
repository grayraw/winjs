(function(){
    "use strict";

    //MAIN PROBLEM: VIDEO DOESN'T WORK WITH "INVALID SOURCE" ERROR
    //SOLUTIONS: 
    //1. IT MIGHT BE NOT POSSIBLE AT ALL / SEE MS SPECS
    //2. CHECK THE YOUTUBE VIDEOS TO COMPARE
    //3. CHECK THE SAME THING WITH LOCAL VIDEOS

    var requestedThread = 0;
    var requestedBoard = 'vg';

    //Creating global namespace
    WinJS.Namespace.define('Globals', {
        //loading boards
        gettingBoards: {},
        boards: new WinJS.Binding.List(),
        boardIndex: {},

        //loading threads
        gettingThreads: {},
        threads: new WinJS.Binding.List(),
        //threads: [],

        //loading posts
        gettingPosts: {},
        posts: [],
        postIndex: [],
        
        //
        linkProcessing: {},

        //For image loading
        gettingImage: {},
        lightboxing: {},

        //For image saving
        imageSaving: {},

        //context menus
        menu: {}
    })

    //Grabbing boards list and filling 'Boards' object with parsed content
    Globals.gettingBoards = function () {
        WinJS.xhr({ url: 'http://a.4cdn.org/boards.json' })
            .then(function (response) {
                if (response.status === 200) {
                    var parsedBoards = (JSON.parse(response.responseText)).boards;
                    Globals.boardIndex = parsedBoards;
                    parsedBoards.forEach(function (thisBoard, index) {
                        var processedBoard = {
                            board: thisBoard.board,
                            title: thisBoard.title,
                            description: thisBoard.meta_description
                        }
                        Globals.boards.push(processedBoard);
                    })   
                }
            })
        //TODO: Write a handle for connection errors
    }

    //Navigating to Threads page, downloading threads JSON and parsing it to Threads list
    Globals.gettingThreads = function (eventInfo) {
        
        WinJS.Navigation.navigate('/pages/threads/threads.html').done(

            //loading JSON
            function () {
                
                requestedBoard = Globals.boardIndex[eventInfo.detail.itemIndex].board;
                WinJS.xhr({ url: 'http://a.4cdn.org/' + requestedBoard + '/catalog.json' })

                    //parsing JSON
                    .then(function (response) {
                        if (response.status === 200) {
                            var parsedPages = JSON.parse(response.responseText);

                            //parsing array of pages
                            parsedPages.forEach(function (thisPage, index) {

                                //parsing array of threads
                                thisPage.threads.forEach(function (thisThread, index) {

                                    Globals.postIndex.push(thisThread.no);

                                    var threadToPush = {
                                        no: thisThread.no,
                                        sub: thisThread.sub,
                                        com: shortening(thisThread.com),
                                        now: thisThread.now,
                                        replies: thisThread.replies,
                                        omitted_images: thisThread.omitted_images,
                                        //image data
                                        tim: thisThread.tim,
                                        ext: thisThread.ext,
                                        imageLink: ('http://i.4cdn.org/' + requestedBoard + '/' + thisThread.tim + thisThread.ext),
                                        img: ('http://i.4cdn.org/' + requestedBoard + '/' + thisThread.tim + 's.jpg'),
                                        filename: thisThread.filename
                                    };

                                    if ( thisThread.tim !== undefined){
                                        //console.log(container.img);
                                        threadToPush.completedThumb = '<img src="' + threadToPush.img + '" class="' + threadToPush.imageLink + '" >';
                                    }


                                    Globals.threads.push(threadToPush);
                                })
                            })
                        }
                    })
            }
        )
    }

    //Making gettingThreads function accessable from HTML
    WinJS.UI.eventHandler(Globals.gettingThreads);
    
    //Loading posts JSON, posts page and parsing them into the Posts object
    Globals.gettingPosts = function (eventInfo) {

        //reset previous query
        Globals.posts = [];

        WinJS.Navigation.navigate('/pages/posts/posts.html').done(

            //loading JSON
            function onComplete() {

                requestedThread = eventInfo.getAttribute('class');
                WinJS.xhr({ url: 'http://a.4cdn.org/' + requestedBoard + '/thread/' + requestedThread + '.json' })

                    //parsing JSON
                    .then(function (response) {
                        if (response.status === 200) {
                            var parsedThread = JSON.parse(response.responseText).posts;

                            parsedThread.forEach(function (thisPost, index) {

                                var post = WinJS.Binding.define({
                                    no: '',
                                    sticky: '',
                                    closed: '',
                                    now: '',
                                    name: '',
                                    com: '',
                                    //image data
                                    filename: '',
                                    tim: '',
                                    ext: '',
                                    resto: '',
                                    imageLink: '',
                                    img: '',
                                    completedThumb: ''
                                });

                                var container = new post({
                                    no: thisPost.no,
                                    sticky: thisPost.sticky,
                                    closed: thisPost.closed,
                                    now: thisPost.now,
                                    name: thisPost.name,
                                    com: thisPost.com,
                                    //image data
                                    filename: thisPost.filename,
                                    tim: thisPost.tim,
                                    ext: thisPost.ext,
                                    resto: thisPost.resto,
                                    imageLink: ('http://i.4cdn.org/' + requestedBoard + '/' + thisPost.tim + thisPost.ext),
                                    img: ('http://i.4cdn.org/' + requestedBoard + '/' + thisPost.tim + 's.jpg')
                                });
                                if ( thisPost.tim !== undefined){
                                    //console.log(container.img);
                                    container.completedThumb = '<img src="' + container.img + '" class="' + container.imageLink + '" >';
                                }

                                Globals.posts.push(container);

                            })
                        } else { console.log('oops') }
                    }).then(function () {
                        var templateElement = document.querySelector(".post-template");
                        var renderElement = document.querySelector(".post-container");
                        if (!(templateElement === null)) {
                            //rendering elements on the page

                            renderElement.innerHTML = "";

                            //var selected = evt.target.selectedIndex;
                            var templateControl = templateElement.winControl;

                            //var counter = Globals.posts.length;
                            var counter = 0;

                            //What about post with 0 index?
                            while (counter < Globals.posts.length) {
                                templateElement.winControl.render(Globals.posts[counter], renderElement);
                                counter++;
                            }
                        }
                    });
            }
        )
    }

    WinJS.UI.eventHandler(Globals.gettingPosts);


    //Shortening post
    function shortening(post) {
        var p = post || 'blank';
        var trimmed;
        var trimmedToSpace;
        trimmed = p.slice(0, 120);
        trimmedToSpace = trimmed.slice(0, Math.min(trimmed.length, trimmed.lastIndexOf(" ")));
        trimmedToSpace = toStaticHTML(trimmedToSpace);
        //If slide didn't cut anything post is small, output without ellipsis
        return (p.length == trimmed.length) ? p : trimmedToSpace + ' (...)';

    }

   
    Globals.gettingImage = function ($image) {
        var $imageLink = $image.attr('class');
        Globals.menu.fileName = $imageLink;
        var re = /(https?:\/\/[a-zA-Z0-9.]*\/[a-zA-Z0-9.]*\/)/g;
        Globals.menu.fileName = Globals.menu.fileName.replace(re, '');
        Globals.menu.imageToSave = null;

        //Globals.menu.imageToCopy = MSApp.createDataPackage(); 
            
        WinJS.xhr({ url: $imageLink, responseType: "blob" }).done(function complete (request){         
            Globals.menu.imageURL = URL.createObjectURL(request.response);

            $image.attr('src', Globals.menu.imageURL);         
            Globals.menu.imageToSave = request.response;
            
        });

    }

    Globals.lightboxing = function (imageParent) {

        var $image;
        var $imageParent = $(imageParent);
        var $container = $imageParent.closest('.win-container');

        if (!($imageParent.hasClass('lightbox'))) {
            
            $imageParent.addClass('lightbox');
            $container.addClass('lightbox-z-index');
            $image = $('.lightbox img');
            Globals.gettingImage($image);

            window.oncontextmenu = function () {
                return false;
            };
                        
            $image.mousedown( function saving (event){
                if ( event.which === 3 ) {
                    Globals.menu.contextMenuImage($image);                  
                }                
            });

            $('.lightbox').click( function cleaning (event) {
                if (event.target === this ) {
                    $('.lightbox').off('click');
                    $image.off('mousedown');
                    $imageParent.removeClass('lightbox');
                    $container.removeClass('lightbox-z-index');
                }  
            });

            if ($image.width() > $image.height()) {
                $image.width('90%');
            } else {
                $image.height('90%');
            };
        }
                
    }

})();