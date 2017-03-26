document.addEventListener("DOMContentLoaded",main);

function playMusic(scoreFragments,tempoBPM){
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

    T("mml", {mml:scores}, synth).on("ended", function() {
        this.stop();
    }).set({buddies:master}).start();
}

function main(){
    //We need to generate some sounds to play

    var cbr1 = new Combiner(new ToneGenerator(0,[3,1,5]), new RhythmGenerator("1100220033004400",10));
    var cbr2 = new Combiner(new ToneGenerator(0,[5,1,3]), new RhythmGenerator("1111222233334444",15));

    var score1=cbr1.generateScore(16);
    var score2=cbr2.generateScore(16);
    
    playMusic([Note.notesToMML(score1),Note.notesToMML(score2)]);
    
}
