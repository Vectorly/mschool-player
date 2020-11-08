/**
 * Created by sam on 16-5-1.
 */


var oReq = new XMLHttpRequest();

oReq.onload = function(e) {
    var arraybuffer = oReq.response; // not responseText
    console.log(arraybuffer);


    var blob = new Blob([oReq.response], {type: "x-application/zip"});
    vv.load(blob, "container");




};


oReq.open("GET", "demo.vvid");
oReq.responseType = "arraybuffer";
oReq.send();



window.calculate = function () {

    document.getElementById("button").style.display = "none";
    document.getElementById("loading").style.display = "block";



    setTimeout(function () {
        document.getElementById("loading").style.display = "none";
        document.getElementById("weisscore").style.display = "block";



    }, 3000)
};

/*
document.getElementById("file").addEventListener("change", function (evt) {

    var file = evt.target.files[0];

    vv.load(file, "container");


});*/