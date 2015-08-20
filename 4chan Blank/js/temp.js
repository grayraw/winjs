Regarding downloading content into byte array: Using WinJS.xhr with the responseType option as 'arraybuffer' will return the contents in ArrayBuffer. A javascript typed array can be instantiated from the ArrayBuffer for example UInt8Array. This way contents can be read into byte array. code should look something like this:

// todo add other options reqd
var options = { url: url, responseType: 'arraybuffer' }; 
WinJS.xhr(options).then(function onxhr(ab)
{
    var bytes = new Uint8Array(ab, 0, ab.byteLength);
}, function onerror()
{
    // handle error
});


(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var origFile = null;

    function pickPhoto() {
        var picker = new Windows.Storage.Pickers.FileOpenPicker();
        var enumerator = Windows.Graphics.Imaging.BitmapDecoder.getDecoderInformationEnumerator();
        enumerator.forEach(function (decoderInfo) {
            decoderInfo.fileExtensions.forEach(function (fileExtension) {
                picker.fileTypeFilter.append(fileExtension);
            });
        });
        picker.pickSingleFileAndContinue();
    }

    function loadPhoto(file) {
        origFile = file;
    }

    function savePhotoPicker(file) {
        var picker = new Windows.Storage.Pickers.FileSavePicker();
        picker.fileTypeChoices.insert("JPEG file", [".jpg"]);
        picker.pickSaveFileAndContinue();
    }

    function savePhoto(src, dest) {
        src.copyAndReplaceAsync(dest).done(function () {
            console.log("success");
        })
    }

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }
            args.setPromise(WinJS.UI.processAll());

            document.getElementById("choose").addEventListener("click", pickPhoto);
            document.getElementById("save").addEventListener("click", savePhotoPicker);
        }
        if (args.detail.kind === Windows.ApplicationModel.Activation.ActivationKind.pickFileContinuation) {
            loadPhoto(args.detail.files[0]);
        }
        if (args.detail.kind === Windows.ApplicationModel.Activation.ActivationKind.pickSaveFileContinuation) {
            savePhoto(origFile, args.detail.file);
        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };

    app.start();
})();