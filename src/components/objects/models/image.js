/**
 * Created by sam on 1/16/16.
 */


function Image(json, app){


    var Image = this;
    var params  = json.params;
    var image = instantiateImage();
    var actions = [];


    Image.Actions = {

        show: function (action) {

            this.data = action;
            this.object = json;

            this.events = {

                fire: function () {
                    $(image).css('display', 'block');
                },

                seek: function () {

                    var time = app.clock.time;
                    if(time < action.time){
                        $(image).css('display', 'none');
                    } else{

                        $(image).css('display', 'block');

                    }
                }
            };

        },


        hide: function (action) {


            this.data = action;
            this.object = json;

            this.events = {

                fire: function () {
                    $(image).css('display', 'none');
                },

                seek: function () {

                    var time = app.clock.time;
                    if(time < action.time){
                        //   $(image).css('display', 'block');
                    } else{

                        $(image).css('display', 'none');

                    }
                }
            };


        }

    };





    json.actions.forEach(function (jsonAction) {

        actions.push(getAction(jsonAction));
    });

    Image.actions = actions;



    function instantiateImage(){

        var svgImage = document.createElementNS("http://www.w3.org/2000/svg", "image");


        app.onSize(function () {

            svgImage.setAttribute("height", app.scaledHeight(params.height) + "px");
            svgImage.setAttribute("width", app.scaledWidth(params.width) + "px");

            svgImage.setAttribute("x", app.scaledWidth(params.xy[0]));
            svgImage.setAttribute("y", app.scaledHeight(params.xy[1]));

        });


        svgImage.setAttribute("preserveAspectRatio", "none");
        svgImage.setAttributeNS("http://www.w3.org/1999/xlink", "href", URL.createObjectURL(toBlob(app.getFile(params.file))));

        svgImage.style.display = "none";

        app.attach(svgImage);


        return svgImage;
    }


    function toBlob(data){

        var l = data.length;
        var array = new Uint8Array(l);
        for (var i = 0; i < l; i++) {
            array[i] = data.charCodeAt(i);
        }


        var blob = new Blob([array], {type: 'image/' + params.format});

        return blob;

    }





    function getAction(action){
        var Action = Image.Actions[action.type];
        return new Action(action);
    }




}



module.exports = Image;