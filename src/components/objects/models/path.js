/**
 * Created by sam on 1/16/16.
 */

function Path(json, app){

    var Path = this;
    var params  = json.params;

    var actions = [];

    var currPathString;

    var X;
    var Y;
    var T;
    var A;

    var finishedRendering = false;

    var duration;

    if(params.t){
        duration  = params.t[params.t.length-1];
    }

    app.onSize(function () {
        X = [];
        Y = [];
        A = [];
        T = params.t || [];

        for (var i=0; i< params.x.length; i++ ){
            X[i] = app.scaledWidth(params.x[i]);
            Y[i] = app.scaledHeight(params.y[i]);
            A[i] = ({x:X[i], y: Y[i]});
        }

    });




    var path = instantiatePath();


    function fillPath(limit){

        currPathString  = "";


        if(A.length < 4){
            // Create a dot if only one point
            var dotStep =1;
            currPathString = currPathString + "M" +  (X[0]) + " " + (Y[0]);
            currPathString = currPathString + " L" +  (X[0]) + " " + (Y[0]+dotStep);
            currPathString = currPathString + " L" +  (X[0]+dotStep) + " " + (Y[0]);
            currPathString = currPathString + " L" +  (X[0]) + " " + (Y[0]-dotStep);
            currPathString = currPathString + " L" +  (X[0]-dotStep) + " " + (Y[0]);
            currPathString = currPathString + " L" +  (X[0]) + " " + (Y[0]);
        } else{

            var lastPoint = 0;

            for(var i=0; i  < A.length; i++){

                if(i ===0){
                    currPathString = currPathString + "M" +  (X[0]) + " " + (Y[0]);
                } else{
                    if(typeof limit === "undefined") currPathString = currPathString + bezierCommand(A[i], i, A);
                    else {


                        if(T[i] <= (limit)) {
                            currPathString = currPathString + bezierCommand(A[i], i, A);
                            lastPoint = i;
                        }

                    }
                }
            }


            if(limit){
                app.cursor.style.display = "block";
                app.cursor.style.left = X[lastPoint] -app.scaledHeight(12.5) + "px";
                app.cursor.style.top = Y[lastPoint] -app.scaledHeight(12.5) + "px";
            }



        }



        path.setAttribute("d", currPathString);

    }

    function clearPath(){

        currPathString  = "M" +  (X[0]) + " " + (Y[0]);
        path.setAttribute("d", currPathString);
    }



    Path.Actions = {

        show: function (action) {

            this.data = action;
            this.object = json;


            this.events = {

                fire: function () {

                    fillPath();
                },

                seek: function () {

                    clearPath();
                    var time = app.clock.time;
                    if(time >= action.time) fillPath();

                },

                resize: function () {
                    clearPath();
                    var time = app.clock.time;
                    if(time >= action.time) fillPath();
                }
            };

        },

        hide: function (action) {


            this.data = action;
            this.object = json;

            this.events = {

                fire: function () {
                    clearPath();
                },

                seek: function () {

                    var time = app.clock.time;
                    if(time >= action.time) clearPath();

                }
            };


        },

        draw: function (action) {

            this.data = action;
            this.object = json;



            this.events = {

                render: function () {

                    var tAction = app.clock.time - action.time;


                    if(tAction < 0) {
                    } else if (tAction > duration){

                        if(!finishedRendering){

                            fillPath();
                            app.cursor.style.display = "none";
                            app.cursor.drawing = false;
                            finishedRendering = true;
                        }


                    } else{


                        app.cursor.drawing = true;
                        fillPath(tAction);


                    }
                },

                seek: function () {

                    var tAction = app.clock.time - action.time;

                    if(tAction < 0) {
                        finishedRendering = false;
                        clearPath();
                    }
                    else if (tAction > duration){

                        finishedRendering = true;
                        fillPath();

                    } else{

                        finishedRendering = false;
                        fillPath(tAction);

                    }
                },

                resize: function () {

                    var tAction = app.clock.time - action.time;

                    if(tAction < 0) {
                        finishedRendering = false;
                        clearPath();
                    }
                    else if (tAction > duration){

                        finishedRendering = true;
                        fillPath();

                    } else{

                        finishedRendering = false;
                        fillPath(tAction);

                    }

                }
            };



        }


    };


    json.actions.forEach(function (jsonAction) {

        actions.push(getAction(jsonAction));
    });

    Path.actions = actions;



    function instantiatePath(){


        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");



        currPathString = "M" +  (X[0]) + " " + (Y[0]);

        path.setAttribute("fill", "none");
        path.setAttribute("stroke", params.color);
        path.setAttribute("stroke-linejoin", "round");

        app.onSize(function () {
            path.setAttribute("stroke-width", app.scaledHeight(params.width));
        });


        path.setAttribute("d", currPathString);


       app.attach(path);

        return path;

    }



    function getAction(action){
        var Action = Path.Actions[action.type];
        return new Action(action);
    }


    function bezierCommand (point, i, a){
        // start control point
        var cps = controlPoint(a[i - 1], a[i - 2], point);
        var cpe = controlPoint(point, a[i - 1], a[i + 1], true);

        return ' C ' + cps.x +',' + cps.y + ' ' + cpe.x + ',' + cpe.y + ' ' + point.x + ',' + point.y;
    }

   function controlPoint(current, previous, next, reverse){

        var p = previous || current;
        var n = next || current;

        var smoothing = 0.2;
        // Properties of the opposed-line
        var o = line(p, n);

        // If is end-control-point, add PI to the angle to go backward
        var angle = o.angle + (reverse ? Math.PI : 0);

        var length = o.length * smoothing;

        // The control point position is relative to the current point
        var x = current.x + Math.cos(angle) * length;
        var y = current.y + Math.sin(angle) * length;

        return {x: x, y: y};
    }

    function line(pointA, pointB) {
        var lengthX = pointB.x - pointA.x;
        var lengthY = pointB.y - pointA.y;
        return {
            length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
            angle: Math.atan2(lengthY, lengthX)
        }
    }


    
}

module.exports = Path;