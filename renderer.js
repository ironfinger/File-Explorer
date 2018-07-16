// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var $ = require("jquery");
var fs = require("fs");
var remote = require('electron').remote; // Get Electron Remote Class.
var BrowserWindow = remote.BrowserWindow; // Get the Browser Window Class.

// Window Stuff:
$(document).ready(() => {
    var window = BrowserWindow.getFocusedWindow();
    
    $('#min-btn').click(() => { // Minimize the window.
        window.minimize();
    });

    $('#max-btn').click(() => { // Maximize the window.
        window.maximize();
    });

    $('#close-btn').click(() => { // Close the window.
        window.close();
    });
});

// UI and OS:
$(document).ready(() => {
    $("#documents").click(() => {
        load(`${osStartPath()}/Documents`);
    });

    $("#downloads").click(() => {
        load(`${osStartPath()}/Downloads`);
    });

    $("#c").click(() => {
        load('C:/');
    })
});

var osStartPath = () => { // Gives a template path to get to documents and downloads ect easily.
    var os = require('os');
    var rtn = '';
    
    if (os.platform() == 'win32') {
        rtn = `C:/Users/${os.userInfo().username}`;
    }else {
    rtn = `Mac Equivalent`;
    }

    return rtn;
}



// Loader.
function load(directory) { // This loads the directory into the view.
    if (directory == null) {
        directory = 'C:/Users/Tom/Documents';
    }

    $(document).ready(() => { // Empty Everything before loading.
        $('#file-view').empty();
    });

    fs.readdir(directory, (err, files) => { // Read the directory.
        $(document).ready(() => {
            var dataPoint = 0; // This is a bookmark for the current array position.
            var rows = 0; // Holds the amount of rows.

            if (files.length % 3 != 0) { // Get the amount of rows.
                rows = (files.length / 3) + 1;
            } else {
                rows = files.length / 3;
            }

            for (var y = 0; y <= rows - 1; y++) {
                $('#file-view').append('<div id="' + y.toString()  + '"' + ' class="row"></div>'); // Append row.
                for (var x = 0; x <= 2; x++) {
                    var type = fileType(files[x + dataPoint]); // Find file type:
                    console.log(`Type: ${type}`);
                    $(`#${y}`).append(`<div class="col-sm file ${type}">${files[x + dataPoint]}</div>`);
                    
                    if (x == 2) { // Set DataPoint.
                        dataPoint = x + dataPoint + 1; // Add one to accomodate for 0 based counting.
                    }
                }
            }
        });
    });
}

var fileType = (file) => { // Checks for the type of file.
    var format = /[.]+/;
    var rtn = 'def';
    
    if (format.test(file)) {
        rtn = 'special';

        var location = getExtensionLocation(file); // Get dot location.

        // Get string from the dot for the rest of the string:
        var ext = getExtension(file, location);
        console.log(`Extension Type: ${ext}`);
        // Check Extension:
        var extension = JSON.parse(fs.readFileSync('./js/things.json', 'utf8')); // Get Extensions.      

        // Return an extension value, if the extension doesn't exist in our json then set as a default thing.
        for (var i = 0; i <= extension.extensions.length - 1; i++) {
            if (ext == extension.extensions[i]) {
                rtn = extension.extensions[i];
                i = extension.extensions.length;
                console.log('Match: ' + rtn);
                console.log('we have a match');
            }else {
                rtn = 'null';
            }
        }
    }else {
        rtn = 'folder';
    }

    return rtn;
}

var getExtensionLocation = (file) => { // This finds the location of the dot seperator for files.
    var rtn = 0;
    for (var i = 0; i <= file.length - 1; i++) {
        if (file.charAt(i) == '.') {
            console.log('Got the dot');
            rtn = i;
        }
    }
    return rtn;
}

var getExtension = (file, location) => { // This therefore return the actual extension as a string.
    var rtn = '';
    for (var i = location + 1; i <= file.length - 1; i++) {
        rtn = rtn + file.charAt(i);
    }
    return rtn;
}

load();

// File Handlers:
$(document).ready(() => {
    $('.working-tree').on('click', '.file', () => {
        console.log('CLICK');
    });
});