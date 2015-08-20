(function(){
    "use strict";
    Globals.menu.contextMenuImage = function(image){
      //Creating anchor for menu under mouse and putting menu inside
      var saveImageMenu = document.getElementById("save-image").winControl;
      var menuContainer = document.getElementById('menu-container');
      $(menuContainer).empty();
      var anchor = document.createElement('div');
      menuContainer.style.left = event.clientX + 'px';
      menuContainer.style.top = event.clientY + 'px';
      menuContainer.appendChild(anchor);
      saveImageMenu.show(anchor, 'bottom');
      //Globals.menu.imageToSave = image;
    }

    //Adding action to menu position
    //USING TIMER HERE IS STUPID AS FUCK PLS REPLACE IT WITH ON DOCUMENT READY
    setTimeout(function (){
      //IF FUNCTION COMES WITH 'TRUE' FILE WILL BE COPIED BUT NOT SAVED
	    document.getElementById("menu-copy").addEventListener("click", Globals.menu.copyOption, false);
			document.getElementById("menu-save").addEventListener("click", Globals.menu.saveOption, false);   	
    }, 1000)

    Globals.menu.copyOption = function (){

      //YOU NEED ERROR HANDLING AND GLOBALS VARIABLES RESET

      var applicationData = Windows.Storage.ApplicationData.current;
      var temporaryFolder = applicationData.temporaryFolder;

      var reader = new FileReader();
      reader.readAsArrayBuffer(Globals.menu.imageToSave);

      reader.onload = function (){
          temporaryFolder.createFileAsync('4chanblank.dat', Windows.Storage.CreationCollisionOption.replaceExisting).done( function (file) {
            var buffer  = new Uint8Array(reader.result);
            Windows.Storage.FileIO.writeBytesAsync(file, buffer).then( function(){

              //COPY PART
              var dataPackage = new Windows.ApplicationModel.DataTransfer.DataPackage();
              dataPackage.setBitmap(Windows.Storage.Streams.RandomAccessStreamReference.createFromFile(file));
              Windows.ApplicationModel.DataTransfer.Clipboard.setContent(dataPackage);            
            });
        });
        
      }
    };

    Globals.menu.saveOption = function (){

      //YOU NEED ERROR HANDLING AND GLOBALS VARIABLES RESET

      var reader = new FileReader();
      reader.readAsArrayBuffer(Globals.menu.imageToSave);

      reader.onload = function (){
          Windows.Storage.KnownFolders.picturesLibrary.createFileAsync(Globals.menu.fileName, Windows.Storage.CreationCollisionOption.generateUniqueName)
          .done( function (file) {
                var buffer  = new Uint8Array(reader.result);
                Windows.Storage.FileIO.writeBytesAsync(file, buffer)
          });
      }
    };

      //console.log(Globals.menu.imageToSave[0].className);
      //cutting http part from class to leave and use filename
//      var fileName = 'test.jpg';
//      var re = /(https?:\/\/[a-zA-Z0-9.]*\/[a-zA-Z0-9.]*\/)/g;
//      fileName = fileName.replace(re, '')
      //console.log(Globals.menu.imageToSave);
      //console.log(fileName);

      //Dropping previous file
      //Globals.menu.fileToSave = null;
      
      //Creating empty file with the needed name
      //Windows.Storage.KnownFolders.picturesLibrary.createFileAsync(Globals.menu.fileName, Windows.Storage.CreationCollisionOption.generateUniqueName).done(
          //function (file) {



            //Windows.Storage.PathIO.writeBytesAsync(file, Globals.menu.imageToSave);

            /* THIS SOLUTION WORKS BUT JUST ONE TIME AND I THINK I CAN MAKE IT BETTER
             
            var stream = Globals.menu.imageToSave.msDetachStream();
            
            file.openAsync(Windows.Storage.FileAccessMode.readWrite).then(function (target){
              Windows.Storage.Streams.RandomAccessStream.copyAsync(stream, target).then(function () {
                  return target.flushAsync().then(function () {
                      target.close();
                      Globals.menu.imageToSave.msClose();
                  });
              });   
            })
            */         

             /* THIS SOLUTION WORKS BUT JUST ONE TIME AND I THINK I CAN MAKE IT BETTER
              var stream = Globals.menu.imageToSave.msDetachStream();
              var reader = new Windows.Storage.Streams.DataReader(stream);

              reader.loadAsync(stream.size)
                .then(function() {
                  var buffer = reader.detachBuffer();      
                  return Windows.Storage.FileIO.writeBufferAsync(file, buffer);        
                });
              */

              /* THIS SNIPPET SHOULD WORK
              WinJS.xhr({
                  responseType: "blob",
                  type: "GET",
                  url: "http://example.com/",
              }).then(function (response) {
                  var fileContents = response.response;
               
                  return file.openAsync(Windows.Storage.FileAccessMode.readWrite).then(function (stream) {
                      return Windows.Storage.Streams.RandomAccessStream.copyAsync(fileContents.msDetachStream(), stream).then(function () {
                          return stream.flushAsync().then(function () {
                              stream.close();
                              fileContents.msClose();
                          });
                      });
                  });
              });              
              */
          //},
          //function (error) {
           //   WinJS.log && WinJS.log(error, "sample", "error");
      //});      
      
      /*
      var fileToSave;
      //You need to use createFileAsync
      var folder = Windows.Storage.KnownFolders.picturesLibrary;
      console.log(Globals.menu.imageToSave);

      // Create the picker object and set options
      var savePicker = new Windows.Storage.Pickers.FileSavePicker();
      savePicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.picturesLibrary;
      // Dropdown of file types the user can save the file as
      savePicker.fileTypeChoices.insert("Image", [".jpg", ".gif", ".png"]);
      // Default file name if the user does not type one in or select a file to replace
      savePicker.suggestedFileName = "New Document";
      savePicker.pickSaveFileAsync().done( 
        function(file){
          Windows.Storage.FileIO.writeTextAsync(file, file.name)
        }
      );
      */
    

})();