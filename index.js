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
    master = T("delay", {time:"BPM60 L16", fb:0.65, mix:0.25}, master);

    var voiceDescriptions = [
        "t__tempo__ l4 v6 q2 o3",
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

    var score1="", score2="";

    score1 += "[ [g < b0<d0f+2>> d <a0<c+0f+2>>]8 ";
    score1 += "f+ <a0<c+0f+2>>> b<<b0<d0f+2>> e<g0b2> e<b0<d0g2>> d<f0a0<d2>>";
    score1 += ">a<<a0<c0e2>> d<g0b0<e2>> d<d0g0b0<e2>> d<c0e0a0<d2>> d<c0f+0a0<d2>>";
    score1 += "d<a0<c0f2>> d<a0<c0e2>> d<d0g0b0<e2>> d<c0e0a0<d2>> d<c0f+0a0<d2>>";
    score1 += "| e<b0<e0g2>> f+<a0<c+0f+2>>> b<<b0<d0f+2>> e<<c+0e0a2>> e<a0<c+0f+0a2>>";
    score1 += "eb0<a0<d>e0b0<d0g>> a0<g2.> d0a0<d2.> ]";
    score1 += "e<b0<e0g2>> e<a0<d0f0a2>> e<a0<c0f2>> e<<c0e0a2>> e<a0<c0f0a2>>";
    score1 += "eb0<a0<d>e0b0<d0g>> a0<g2.> d0a0<d2.>";

    score2 += "[ r2. r2. r2. r2.";
    score2 += "rf+a gf+c+ >b<c+d >a2. f+2.& f+2.& f+2.& f+2.< rf+a gf+c+ >b<c+d >a2.<";
    score2 += "c+2. f+2. >e2.&e2.&e2.";
    score2 += "ab<c ed>b< dc>b< d2.& d2d";
    score2 += "efg acd ed>b <d2.& d2d";
    score2 += "| g2. f+2.> bab< c+de c+de>";
    score2 += "f+2. c0e0a0<c2.> d0f+0a0<d2. ]";
    score2 += "g2. f2.> b<cf edc edc>";
    score2 += "f2. c0e0a0<c2.> d0f0a0<d2.";

    playMusic([score1,score2]);
    
}
