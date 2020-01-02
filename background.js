// this is the background code...

// listen for our browerAction to be clicked
// chrome.browserAction.onClicked.addListener(function (tab) {
    // for the current tab, inject the "inject.js" file & execute it
    // chrome.tabs.executeScript(null, { file: "jquery-3.3.1.min.js" }, function() {
    //     chrome.tabs.executeScript(null, { file: "content.js" });
    // });
    var s = document.createElement('script');
    s.src = chrome.extension.getURL("content.js");
    s.onload = function() {
        this.parentNode.removeChild(this);
    };

    // var b = document.createElement('script');
    // b.src = chrome.extension.getURL("jquery-3.3.1.min.js");
    // b.onload = function() {
    //     this.parentNode.removeChild(this);
    // };
    (document.head||document.documentElement).appendChild(s);
    // (document.head||document.documentElement).appendChild(b);
// });
