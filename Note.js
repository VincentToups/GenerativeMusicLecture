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
                name:noteName,
                modifier:modifier,
                octave:0
            };
        }
        if(!parsesAsOctave(tone)) throw new Error("Can't parse octave from "+tone);
        return {
            name:noteName,
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

    Note.prototype.getDuration = function(){
        return this.duration;
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

    // A utility which replicates a string N
    // times, inserting del between each replication.
    function strrep(s,n,del){
        del = typeof del === "undefined" ? "" : del;
        if(n===0) return "";
        if(n===1) return s;
        var out = s;
        n--;
        while(n>0){
            out = out+del+s;
            n--;
        };
        return out;
    };

    // We need to write some code to convert our notes to
    // Music Macro Language
    // This goes way back.
    // Luckily, we don't really need to understand that much about it
    // > goes up an octave, < goes down an octave
    // and we use & to indicate ties.
    // Since we are thinking purely in 16th Notes, we'll use ties
    // for everything. We'll just build up each note by raising to the right
    // octave, tying together enough 16th notes to add up to our duration
    // and then dropping back down
    Note.prototype.toMML = function(){
        var octMod = this.tone.octave === 0 ? "" :
                this.tone.octave > 0 ? ">" :
                this.tone.octave < 0 ? "<" : "";
        // The operator to undo octave modifications.
        var octDeMod = this.tone.octave === 0 ? "" :
                this.tone.octave > 0 ? "<" :
                this.tone.octave < 0 ? ">" : "";        
        var nOctaves = Math.abs(this.tone.octave);
        // in MML + means sharp, - means flat
        var modifier = this.tone.modifier === "" ? "" :
                this.tone.modifier === "#" ? "+" :
                this.tone.modifier === "b" ? "-" : "";
        
        return (strrep(octMod,nOctaves)+
                strrep(this.tone.name.toLowerCase()+modifier+"16",this.getDuration(),"&")+
                strrep(octDeMod,nOctaves));
    };

    Note.notesToMML = function(notes){
        return notes.map(function(note){
            return note.toMML();
        }).join(" ");
    };

    // Put Note in the global namespace;
    global.Note = Note;
    
})(window);
