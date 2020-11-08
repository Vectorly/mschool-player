/**
 * Created by sam on 1/16/16.
 */

function AceCode(json, app) {

    var AceCode = this;
    var params  = json.params;
    var consoleWindow;
    var button;

    var ace = require('brace');
    require('brace/mode/javascript');
    require('brace/theme/idle_fingers');

    var width = params.w || 1600;
    var height = params.h || 900;
    var fontSize = params.fontSize || 30;
    var x = 0;
    var y = 0;


    if(params.xy){
        x = params.xy[0];
        y = params.xy[1];
    }


    var editor = instantiateAceCode();
    var session = editor.getSession();
    var _document = session.getDocument();
    var selection = session.selection;
    var aceEditor = editor.env.editor;
    var lastIndex = 0;

    var editorActions = [
        insertText,
        removeText,
        moveCursor
    ];


    function smashChanges() {

        aceEditor.setValue('', -1);
        params.events.some(function(timeSlice, index) {
            if (timeSlice[1] <= app.clock.time) {
                editorActions[timeSlice[0]](timeSlice);
                lastIndex = index;
                return false;
            }
            return true; // continue iterating until timeSlice is greater than time
        });
    }




    var actions = [];
    
    var duration;


    AceCode.Actions = {

        play: function (action) {

            this.data = action;
            this.object = json;

            this.events = {

                fire: function () {

                },

                render: function(){


                    var prevIndex = params.events[lastIndex - 1];

                    if (prevIndex && prevIndex[1] > app.clock.time) {
                        smashChanges();
                    } else {

                        for (; lastIndex < params.events.length && params.events[lastIndex][1] <= app.clock.time; lastIndex++ ) {
                            var timeSlice = params.events[lastIndex];
                            editorActions[timeSlice[0]](timeSlice);
                        }
                    }

                },

                pause: function () {
                },

                seek: function () {
                    smashChanges();

                },

                end: function () {

                }


            };



        },


        'show-console': function (action) {

            this.data = action;
            this.object = json;

            this.events = {
                fire: function () {


                    var tAction = app.clock.time - action.time;
                    if(!params.runnable) return null;


                    if ( (tAction > -100) && (tAction < 100)) {

                        if(params.runnable) $(button).click();

                    }

                },
                seek: function () {

                    if(action.time < app.clock.time){

                        if(params.runnable)  $("#code-console-close-button").click();

                    } else{
                        if(params.runnable) $(button).click();
                    }
                }
            }
        },

        'hide-console': function (action) {

            this.data = action;
            this.object = json;

            this.events = {
                fire: function () {
                    if(params.runnable)  $("#code-console-close-button").click();
                },
                render: function () {

                    var tAction = app.clock.time - action.time;
                    if(!params.runnable) return null;


                    if ( (tAction > -100) && (tAction < 100)) {

                        $("#code-console-close-button").click();

                    }

                },
                seek: function () {

                    if(action.time < app.clock.time){
                        if(params.runnable) $(button).click();
                    } else{
                        if(params.runnable)  $("#code-console-close-button").click();
                    }

                }
            }
        }
    };



    json.actions.forEach(function (jsonAction) {

        actions.push(getAction(jsonAction));
    });

    AceCode.actions = actions;




    function getAction(action){
        var Action = AceCode.Actions[action.type];
        return new Action(action);
    }



    function insertText(textObj) {
        _document.insert({
            row: textObj[2],
            column: textObj[3]
        }, textObj[6].join('\n'));
    }

    function removeText(textObj) {
        _document.remove({
            start: {
                row: textObj[2],
                column: textObj[3]
            }, end: {
                row: textObj[4],
                column: textObj[5]
            }
        });
    }

    function moveCursor(cursorObj) {
        selection.setSelectionRange({
            start: {
                row: cursorObj[4],
                column: cursorObj[5]
            }, end: {
                row: cursorObj[6],
                column: cursorObj[7]
            }
        }, cursorObj[3] === cursorObj[5]);
        selection.moveCursorToPosition({
            row: cursorObj[2],
            column: cursorObj[3]
        });
    }





    function instantiateAceCode(){


        var editorWindow =  document.createElement("div");
        $(editorWindow).css("position", "absolute");
        $("#canvas-container").append(editorWindow);
        var editor = ace.edit(editorWindow);



        app.onSize(function () {
            $(editorWindow).css("left", x);
            $(editorWindow).css("top", y);
            $(editorWindow).width(app.scaledWidth(width));
            $(editorWindow).height(app.scaledHeight(height));
            editor.setOption("fontSize", app.scaledHeight(fontSize) );
        });



        if(params.runnable){
            button = jQuery.parseHTML(require('./run_button'))[0];



            app.onSize(function () {
                button.style.fontSize = app.scaledHeight(40) + "px";
                button.style.padding = app.scaledHeight(20) + "px " +  app.scaledWidth(30) + "px";
                button.style.borderRadius = app.scaledWidth(20) + "px ";
                button.style.bottom = app.scaledHeight(20) + "px ";
                button.style.left = app.scaledWidth(125) + "px ";
            });


            consoleWindow  = jQuery.parseHTML(require('./console_window'))[0];
            editorWindow.appendChild(consoleWindow);
            editorWindow.appendChild(button);

            var oldLog = console.log;
            window.console.log = function (message) {

                var div = document.createElement("div");
                div.style.paddingBottom = "1%";
                div.appendChild(document.createTextNode(message));
                $("#code-ace-console-output").append(div);
                oldLog.apply(console, arguments);
            };


            $(button).click(function () {

                $("#code-ace-console-output").empty();
                $(consoleWindow).show();

                try{
                    eval(aceEditor.getValue());
                } catch (e){
                    console.log(e.message);
                }


             //   $("#code-ace-console-output").append(document.createTextNode(eval(aceEditor.getValue()) + "\n"));
            });

            $("#code-console-close-button").click(function () {
                $(consoleWindow).hide();
                $("#code-ace-console-output").empty();
            });



        }



        editor.getSession().setMode('ace/mode/javascript');
        editor.setTheme('ace/theme/idle_fingers');
        return editor;
    }

}


module.exports = AceCode;


// var svgWrapper =  document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
//var editorWindow =  document.createElementNS("http://www.w3.org/1999/xhtml", "div");
/*


function isChrome() {
    var isChromium = window.chrome,
        winNav = window.navigator,
        vendorName = winNav.vendor,
        isOpera = winNav.userAgent.indexOf("OPR") > -1,
        isIEedge = winNav.userAgent.indexOf("Edge") > -1,
        isIOSChrome = winNav.userAgent.match("CriOS");

    if (isIOSChrome) {
        return true;
    } else if (
        isChromium !== null &&
        typeof isChromium !== "undefined" &&
        vendorName === "Google Inc." &&
        isOpera === false &&
        isIEedge === false
    ) {
        return true;
    } else {
        return false;
    }
}



        app.onSize(function () {

            $(editorWindow).width(app.scaledWidth(1600));
            $(editorWindow).height(app.scaledHeight(900));
            svgWrapper.setAttribute("x", app.scaledWidth(0));
            svgWrapper.setAttribute("y", app.scaledHeight(0));
            svgWrapper.setAttribute("width", app.scaledWidth(1600));
            svgWrapper.setAttribute("height", app.scaledHeight(900));





        });


        svgWrapper.appendChild(editorWindow);

        app.attach(svgWrapper);


        app.onSize(function () {
            if(isChrome()){ // Bug in chrome // Not sure why we have to do this
                //$(editorWindow).width(app.scaledWidth(1600) *$(editorWindow).position().left/$("#canvas").position().left);
               // $(editorWindow).height(app.scaledHeight(900) *$(editorWindow).position().left/$("#canvas").position().left);
            }
        });
*/
