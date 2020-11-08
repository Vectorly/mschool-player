/**
 * Created by sam on 1/16/16.
 */



function formatTime(ms){

    var m = 0;
    var s = 0;
    var mspmin = 1000*60;

    while(ms > mspmin){
        ms = ms -mspmin;
        m=m+1;
    }

    s = Math.floor(ms/1000);

    if(s < 10) s = "0" + s;

    return (m + ":" + s);

}



module.exports = {
    formatTime: formatTime
};