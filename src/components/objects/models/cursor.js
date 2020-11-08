/**
 * Created by sam on 16-11-12.
 */
function Cursor(json, app){

    var Cursor = this;
    var params  = json.params;

    var actions = [];


    var Y;
    var X;

    var offset;

    app.onSize(function () {

        Y = [];
        X = [];

        params.y.forEach(function (y) {
            Y.push(app.scaledHeight(y));
        });

        params.x.forEach(function (x) {
            X.push(app.scaledWidth(x));
        });

        offset = app.scaledHeight(12.5);  //Cursor is normalized at 25px

    });




    var numeric = require('numeric');



        Cursor.Actions = {



            draw: function (action) {

                this.data = action;
                this.object = json;

                var duration = params.t[params.t.length-1];

                var sx  = numeric.spline(params.t, X);


                var sy  = numeric.spline(params.t, Y);


                this.events = {



                    render: function () {

                        var tAction = app.clock.time - action.time;

                        if(app.cursor.drawing) return null;


                        if(tAction < 0) {


                            if(tAction > -100  ){
                                if(!params.show_when_idle) app.cursor.style.display = "none";
                            }


                        } else if (tAction > duration){


                            if((tAction - duration) < 100  ) {
                                if(!params.show_when_idle) app.cursor.style.display = "none";
                            }


                        } else{

                            var x = sx.at(tAction);
                            var y = sy.at(tAction);

                            app.cursor.style.display = "block";
                            app.cursor.style.left = x -offset + "px";
                            app.cursor.style.top = y -offset + "px";

                        }
                    },

                    seek: function () {

                        var tAction = app.clock.time - action.time;


                        if(tAction < 0) {

                            if(!params.show_when_idle) app.cursor.style.display = "none";


                        } else if (tAction > duration){

                            if(!params.show_when_idle) app.cursor.style.display = "none";


                        } else{


                            var x = sx.at(tAction);
                            var y = sy.at(tAction);

                            app.cursor.style.display = "block";
                            app.cursor.style.left = x - offset + "px";
                            app.cursor.style.top = y - offset + "px";



                        }



                    }
                };




            }



    };


    json.actions.forEach(function (jsonAction) {

        actions.push(getAction(jsonAction));
    });

    Cursor.actions = actions;


    if(params.cursor){

        if(params.cursor === "holo"){

            var svg = document.createElementNS('http://www.w3.org/2000/svg', "svg");


            app.onSize(function () {
                svg.setAttribute("width", app.scaledWidth(25));
                svg.setAttribute("height", app.scaledHeight(25));
            });
            svg.setAttribute("viewbox", "0 0 25 25");

            var  polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');

            polygon.setAttribute("points", "10 10 4.2 10.6469727 0 14 0 0");
            polygon.setAttribute("fill", "#8BB2FF");
            polygon.setAttribute("fill-rule", "evenodd");

            svg.appendChild(polygon);

            app.cursor.src = "data:image/svg+xml;charset=utf-8,"+ (new XMLSerializer).serializeToString(svg);
        }

    }


    function getAction(action){
        var Action = Cursor.Actions[action.type];
        return new Action(action);
    }


}

module.exports = Cursor;