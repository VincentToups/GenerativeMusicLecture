document.addEventListener("DOMContentLoaded",main);

function playMusic(scoreFragments,tempoBPM, readyCallback){
    readyCallback = typeof readyCallback === "undefined" ?
        function(){} : readyCallback;
    tempoBPM = typeof tempoBPM === "undefined" ? 60 : tempoBPM;
    var env   = T("adsr", {d:3000, s:0, r:600});
    var synth = T("SynthDef", {mul:0.45, poly:8});
    
    synth.def = function(opts) {
        var op1 = T("sin", {freq:opts.freq*6, fb:0.25, mul:0.4});
        var op2 = T("sin", {freq:opts.freq, phase:op1, mul:opts.velocity/128});
        return env.clone().append(op2).on("ended", opts.doneAction).bang();
    };

    var master = synth;
    var mod    = T("sin", {freq:2, add:3200, mul:800, kr:1});
    master = T("eq", {params:{lf:[800, 0.5, -2], mf:[6400, 0.5, 4]}}, master);
    master = T("phaser", {freq:mod, Q:2, steps:4}, master);
    master = T("delay", {time:"BPM__tempo__ L16".replace("__tempo__",tempoBPM), fb:0.65, mix:0.25}, master);

    var voiceDescriptions = [
        "t__tempo__ l4 v6 q2 o5",
        "t__tempo__ v14 l4 o6"
    ].map(function(voice){
        return voice.replace("__tempo__",tempoBPM);
    });

    var scores = scoreFragments.map(function(fragment,i){
        return voiceDescriptions[i%voiceDescriptions.length]+" "+fragment;
    });

    readyCallback(T("mml", {mml:scores}, synth).on("ended", function() {
        this.stop();
    }).set({buddies:master}).start());
}

function getQueryParam(name,otherwise) {
    var url = location.href;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return results == null ? otherwise : results[1];
}

function toToneStep(s){
    return Math.floor(+s)%8;
}

function toInt(s){
    return Math.floor(+s);
}

function getUrlRoot(){
    return location.href.split("?")[0];
}

function main(){
    //We need to generate some sounds to play

    var tgSeq1=getQueryParam("tgSeq1","315").split("").map(toToneStep);
    var tgSeq2=getQueryParam("tgSeq2","513").split("").map(toToneStep);
    var rhythm1=getQueryParam("rhythm1","1100220033004400");
    var rhythm2=getQueryParam("rhythm2","1111222233334444");
    var rhythm1Skip=toInt(getQueryParam("rhythm1Skip","10"));
    var rhythm2Skip=toInt(getQueryParam("rhythm2Skip","15"));

    var thisUrl=[getUrlRoot(),
                 "?",
                 "tgSeq1=",
                 tgSeq1.join(""),"&",
                 "tgSeq2=",
                 tgSeq2.join(""),"&",
                 "rhythm1=",rhythm1,"&",
                 "rhythm2=",rhythm2,"&",
                 "rhythm1Skip=",rhythm1Skip,"&",
                 "rhythm2Skip=",rhythm2Skip].join("");
    
    var tempo = 60;

    var cbr1 = new Combiner(new ToneGenerator(0,tgSeq1), new RhythmGenerator(rhythm1,rhythm1Skip));
    var cbr2 = new Combiner(new ToneGenerator(0,tgSeq2), new RhythmGenerator(rhythm2,rhythm2Skip));

    var score1=cbr1.generateScore(16,4);
    var score2=cbr2.generateScore(16,4);

    // Setup visualization:

    var cnvs = document.querySelector("#score-canvas");
    var lnk = document.createElement("a");
    lnk.href=thisUrl;
    lnk.innerHTML = "(Link)";
    var spn = document.createElement("span");
    spn.innerHTML = " Try editing the query parameters to vary the generated composition.";
    document.body.insertBefore(lnk,cnvs);
    var br = document.createElement("br");
    document.body.insertBefore(br,cnvs);
    document.body.insertBefore(spn,br);

    // Handle pixel density issues.
    setHiDPICanvas(cnvs,window.innerWidth*0.9,400);

    window.view = new NotesView(cnvs,[score1,score2],tempo);
    
    playMusic([Note.notesToMML(score1),Note.notesToMML(score2)],
              tempo,
              function(){
                  window.view.start();
              });
    
}
