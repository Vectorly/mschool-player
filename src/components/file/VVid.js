/**
 * Created by sam on 1/16/16.
 */


function VVid (file){

    var Zip= require('node-zip');


    loadZip(file, function (zipFile) {

        vvid.zip = zipFile;
        processFiles();
        setMeta();
        vvid.onLoadEventListener();

    });


    function processFiles(){

        var fileNames = Object.keys(vvid.zip.files);


        fileNames.forEach(function(fileName){

            var fileEntry = vvid.zip.files[fileName];


            if(!fileEntry.dir){
                vvid.files[fileEntry.name] = fileEntry._data;
            }
        });
    }

    function setMeta(){
        vvid.json = JSON.parse(vvid.files['vvid.json']);
    }





    var vvid = {

        zip: {},
        files: {},
        onLoadEventListener: function () {},

        onLoad: function (eventListener) {
            this.onLoadEventListener = eventListener;
        },

        getFile: function (entry) {

            return vvid.files[entry];
        }

    };



    return vvid;



    function loadZip(file, callback){

        var zipblob;

        var reader = new FileReader();

        callback = callback || function(){};


        try {
            zipblob = new Blob([file], {"type" : "application/zip" });               // Convert to binary for zip.js
        }

        catch(e){                                                           // Couldn't build a blob

            window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder ||  window.MozBlobBuilder ||  window.MSBlobBuilder;

            if(e.name == 'TypeError' && window.BlobBuilder){     // Older browsers that require blob builder to instantiate blobs
                var bb = new BlobBuilder();
                bb.append([file]);
                zipblob = bb.getBlob("application/zip");
            }
            else{
                // x.error.report("Browser doesn't support blobs ")
            }
        }
        zipblob.name = file.name;





        reader.onload = function (evt) {




             var zip = new Zip(evt.target.result, {base64: false, checkCRC32: true});

            callback(zip);

        };

        reader.readAsArrayBuffer(zipblob);







     //   return zip;


    }


    function getFile (filename, callback, onerror, onprogress) {


        onerror = onerror || function () {};
        onprogress = onprogress || function () {};


        var zipblob = blob;


        var mime = util.mime.ext2mime(filename);

        var files = [];

        try {

            zip.createReader(new zip.BlobReader(zipblob), function(reader) {    // Open zip file with zip.js



                reader.getEntries(function(entries) {                              // Get the entries from the zip file


                    entries.forEach(function(entry){

                        files[entry.filename] = entry;});



                    if(files[filename]){                                     // Check if the filename exists


                        var file = files[filename];

                        file.getData(new zip.BlobWriter(mime), function(data){


                            util.debug.log('obtained file from zip', false);
                            callback(data);


                        }, function (progressIndex, totalIndex) {



                            onprogress(progressIndex, totalIndex);


                        });
                    } else{
                        util.debug.log('An error occurred while loading the file - it seems that file ' + filename + ' is not in the directory', false);
                        onerror({message: 'error-no-file'});
                    }


                });

            });

        } catch (e) {
            util.debug.log('An error occurred while loading the file. Error details ' + e, false);
            onerror(e);


        }

    }

}







module.exports = VVid;