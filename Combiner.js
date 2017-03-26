(function(global){

    function Combiner(toneGen,rhythmGen){
        this.toneGen = typeof toneGen === "undefined" ?
            new ToneGenerator(0,1) : toneGen;
        this.rhythmGen = typeof rhythmGen === "undefined" ?
            new RhythmGenerator("1100222233004400",1) :
            rhythmGen;
    };

    function repeatSequence(s,n){
        var acc = [];
        for(var i = 0; i < n; i++){
            acc.push(s);
        }
        return [].concat.apply([],acc);
    }

    Combiner.prototype.generateScore = function(nMeasures,nRepeat){
        nRepeat = typeof nRepeat === "undefined" ? 1 : nRepeat;
        var notes = [];
        var tones,rhythm;
        while(nMeasures>0){
            // Generate 16 notes, but only use as many as we need to fill our
            // rhythm
            tones = this.toneGen.generateTones(16);
            rhythm = this.rhythmGen.generateMeasure();
            rhythm.forEach(function(note){
                note.setTone(tones[0]);
                //slice off tones equal to the
                //current note duration
                tones = tones.slice(note.getDuration());
            });
            notes.push(rhythm);
            nMeasures--;
        }
        return repeatSequence([].concat.apply([],notes),nRepeat);
    };
    
    global.Combiner = Combiner;
    
})(window);
