(function(global){

    function isValidDuration(d){
        return d>=1 && d <=16 && d === Math.round(d);
    }

    var validNoteNames = "A B C D E F G".split(" ");
    function isValidNoteName(n){
        return validNoteNames.indexOf(n.toUpperCase())!==-1;
    }

    function looksLikeSharpFlat(s){
        return s==="#" || s==="b";
    }

    function parsesAsOctave(s){
        var parsed = +s;
        return !isNaN(+s) && Math.round(parsed) === parsed;
    }

    function parseTone(tone){
        var noteName = tone[0];
        var modifier = "";
        if(!isValidNoteName(noteName)) throw new Error("Invalid note name in "+tone);
        tone = tone.slice(1);
        if(looksLikeSharpFlat(tone[0])){
            modifier = tone[0];
            tone = tone.slice(1);
        }
        if(tone===""){
            return {
                noteName:noteName,
                modifier:modifier,
                octave:0
            };
        }
        if(!parsesAsOctave(tone)) throw new Error("Can't parse octave from "+tone);
        return {
            noteName:noteName,
            modifier:modifier,
            octave:+tone
        };        
    };

    function Note(duration, rest, tone){
        rest = typeof rest === "undefined" ? false : rest;
        // Duration is in 16th Notes
        this.duration = undefined;
        this.rest = rest;
        this.tone = tone;
        this.setDuration(duration);
        this.setTone(tone);
    }

    Note.prototype.setDuration = function(duration){
        if(!isValidDuration(duration)) throw new Error("Noted can only have durations in integral sixteenth notes.");
        this.duration = duration;
        return this;
    };

    Note.prototype.setTone = function(tone){
        // We will let notes persist without a tone
        // As this will be make generating music a little easier.
        if(!tone) return;
        this.tone = parseTone(tone);
    };

    Note.prototype.isRest = function(){
        return this.rest;
    };

    // Put Note in the global namespace;
    global.Note = Note;
    
})(window);
