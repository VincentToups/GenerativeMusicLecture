(function(global){

    function Combiner(toneGen,rhythmGen){
        this.toneGen = typeof toneGen === "undefined" ?
            new ToneGenerator(0,1) : toneGen;
        this.rhythmGen = typeof rhythmGen === "undefined" ?
            new RhythmGenerator("1100222233004400",1) :
            rhythmGen;
    };

    Combiner.prototype.generateScore = function(nMeasures){
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
        return [].concat.apply([],notes);
    };
    
    global.Combiner = Combiner;
    
})(window);
