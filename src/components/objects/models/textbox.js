function TextBox(json, app){

    var TextBox = this;
    var params  = json.params;
    var text = instantiateText();
    var actions = [];



    TextBox.Actions = {

        show: function (action) {

            this.data = action;
            this.object = json;

            this.events = {

                fire: function () {
                    $(text).css('display', 'block');
                },

                seek: function () {

                    var time = app.clock.time;
                    if(time < action.time){
                        $(text).css('display', 'none');
                    } else{

                        $(text).css('display', 'block');

                    }
                }
            };

        },

        translate: function (action) {

            this.data = action;
            this.object = json;

            this.events = {



                seek: function () {

                    var time = app.clock.time;
                    if(time < action.time){
                        //   $(text).css('display', 'block');
                    } else{

                        $(text).css('display', 'none');

                    }
                }
            };




        },


        hide: function (action) {


            this.data = action;
            this.object = json;

            this.events = {

                fire: function () {
                    $(text).css('display', 'none');
                },

                seek: function () {

                    var time = app.clock.time;
                    if(time < action.time){
                        //   $(text).css('display', 'block');
                    } else{

                        $(text).css('display', 'none');

                    }
                }
            };


        }

    };


    json.actions.forEach(function (jsonAction) {

        actions.push(getAction(jsonAction));
    });

    TextBox.actions = actions;




    app.attach(text);


    function instantiateText(){


        var text =  document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");





        var svgDiv =  document.createElementNS("http://www.w3.org/1999/xhtml", "div");

        svgDiv.style.color = params.color;
        svgDiv.style.lineHeight = "96%";
        svgDiv.style.height = "96%";
        svgDiv.style.width = "96%";
        svgDiv.style.top = "2%";
        svgDiv.style.left = "2%";


        svgDiv.style.whiteSpace = "pre-wrap";
        svgDiv.style.whiteSpace = "-moz-pre-wrap";
        svgDiv.style.whiteSpace = "-opre-wrap";
        svgDiv.style.wordWrap= "break-word";

        app.onSize(function () {
            text.setAttribute("x", app.scaledWidth(params.xy[0]));
            text.setAttribute("y", app.scaledHeight(params.xy[1]));
            text.setAttribute("width", app.scaledWidth(params.w));
            text.setAttribute("height", app.scaledHeight(params.h));
            svgDiv.style.fontSize = app.scaledHeight(params.size) + "px";
        });


        if(params.style){
            if(params.style.bold) svgDiv.style.fontWeight = "bold";
            if(params.style.italic) svgDiv.style.fontStyle = "italic";
        }


      //  if(params.style.underline) svgDiv.style.textDecoration = "underline";


        if(params.formatting){
            if(params.formatting.center) svgDiv.style.textAlign = "center";
        }


        svgDiv.style.fontFamily = "Arial";
        svgDiv.innerHTML = params.text;
        text.appendChild(svgDiv);
        text.style.display = "none";


        return text;

    }


    function getAction(action){
        var Action = TextBox.Actions[action.type];
        return new Action(action);
    }


}

module.exports = TextBox;