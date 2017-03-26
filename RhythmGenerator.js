(function(global){

    /* 
     Here is the idea:

     A rhythm is going to be 16 16th notes long (one measure in 4/4).

     We want to concern ourselves with just the duration of different notes. 
     Consider a string like this:

     "3311222211776600"
     
     Each number besides 0 represents a note, each run of consecutive numbers
     represents a single, held note.

     So we can read the above string as: 

     an eighth note, another, a quarter note,
     an eighth note, another, another, a eighth rest

     Such a string can be thought of as a number designated in 
     base 7.

     Our generator is going to start with a number, add an offset to it,
     convert to base eight, and generate notes, for each measure.
     
     */

    function rhythmStringToNumber(rs){
        // parse the string in base 8
        return parseInt(rs,8);
    }

    function numberToRhythmString(n){
        // Note that we force N into a 16 octet range.
        return padLeft((n%Math.pow(8,16)).toString(8),16,"0");
    }

    function RhythmGenerator(initialState, step){
        step = typeof step === "undefined" ? 1 : 0;
        this.state = typeof initialState==="string" ?
            rhythmStringToNumber(initialState) :
            initialState;
        this.step = step;
    }

    function padLeft(s,n,c){
        var sn = s.length;
        var nPad = n-sn;
        var acc = [s];
        while(nPad > 0){
            acc.unshift(c);
            nPad--;
        }
        return acc.join("");
    };

    RhythmGenerator.prototype.generateMeasure = function(){
        //convert state to string of the above type
        //we need to pad left, though, because of the way
        //this works
        var sixteenths = numberToRhythmString(this.state);

        // Go to the next state;
        this.state = this.initialState + this.step;
        var lastGroup = undefined;
        var out = [];
        var c = undefined;
        while(sixteenths.length>0){
            c = sixteenths[0];
            if(typeof lastGroup === "undefined"){
                lastGroup = [c];
                sixteenths = sixteenths.slice(1);
            } else if (lastGroup[0]===c) {
                lastGroup.push(c);
                sixteenths = sixteenths.slice(1);
            } else {
                // c must be different
                // create a note, without a tone
                out.push(new Note(lastGroup.length,lastGroup[0]==="0"?true:false));
                lastGroup = [c];
                sixteenths = sixteenths.slice(1);
            }
        }
        //create a note without a tone
        out.push(new Note(lastGroup.length,lastGroup[0]==="0"?true:false));
        return out;        
    };

    global.RhythmGenerator = RhythmGenerator;
    
})(window);

