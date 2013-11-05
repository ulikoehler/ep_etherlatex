var eejs = require("ep_etherpad-lite/node/eejs/");
var api = require("ep_etherpad-lite/node/db/API");
var spawn = require('child_process').spawn;
var fs = require("fs");
var temp = require("temp");
var rmrf = require("rimraf");
var path = require("path");
var util = require("util");

//Serve a static file and delete temporary directory
function serveFileAndDelete(res, tempDir, filename, mime) {
    res.set('Content-Type', mime);
    //We need to read the file content, because
    // sending a static file 
    fs.readFile(filename, function(readError, fileContent) {
        res.send(fileContent);
        rmrf(tempDir, function(rmError) {
           if(rmError) {
               return console.log("Error while deleting temporary directory: " + rmError);
           }
           console.log("Deleted LaTeX directory: " + tempDir);
        });
    });
}

function getPDFHandler(req, res) {
    var padId = req.query.padId;
    api.getText(padId, function(err, padObj) {
        var text = padObj.text;
        //Create temporary directory to compile in
        temp.mkdir('ep_etherlatex', function(err1, tempDir) {
            if(err1) {
                return console.log("Error while creating temporary directory for LaTeX: " + err1);
            }
            //Write the LaTeX source file
            var filenamePrefix = path.join(tempDir, padId);
            var texFilename = filenamePrefix + ".tex";
            var logFilename = filenamePrefix + ".log";
            var pdfFilename = filenamePrefix + ".pdf";
            fs.writeFile(texFilename, text, function(err2){
                if(err2) {
                    return console.log("Error while writing LaTeX file: " + err2);
                }
                //Execute pdflatex TWICE
                var pdflatex = spawn("pdflatex",["-interaction=batchmode", texFilename], {cwd: tempDir});
                pdflatex.on('close', function (code, signal) {
                    var pdflatex2 = spawn("pdflatex",["-interaction=batchmode", texFilename], {cwd: tempDir});
                    pdflatex2.on('close', function (code, signal) {
                        //Serve PDF if it exists, else serve log file
                        fs.exists(pdfFilename, function(pdfFileExists){
                            if(pdfFileExists) {
                                serveFileAndDelete(res, tempDir, pdfFilename, "application/pdf");
                            } else { //PDF file does not exist
                                serveFileAndDelete(res, tempDir, logFilename, "text/plain");
                            }
                        });
                   });
                });
            });
        });
    });
}

exports.eejsBlock_editbarMenuRight = function (hook_name, args, cb) {
  //Extract pad ID
  var split = args.renderContext.req.url.split("/");
  var padId = split[split.length - 1];
  //Render LaTeX button
  args.content = eejs.require("ep_etherlatex/templates/editbarButtons.ejs", {padId: padId}) + args.content;
  return cb();
}

exports.expressCreateServer = function (hook_name, args, cb) {
  args.app.get('/latex/renderpdf', getPDFHandler);
  args.app.get('/latex/latex-logo.png', function(req, res) {
      res.sendfile(path.join(__dirname, "static/img/latex-logo.png"));
  });
}
