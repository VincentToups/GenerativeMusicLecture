(function(global){

    // Lets use the default C major scale (two octaves).
    var defaultScale = 'C2 D2 E2 F2 G2 A2 B2 C3 D3 E3 F3 G3 A3 B3'.split(' ');

    function ToneGenerator(initial,step,scale){
        scale = typeof scale === "undefined" ? defaultScale : scale;
        step = typeof step === "undefined" ? 1 : step;
        this.state = initial;
        this.step = typeof step === "number" ? [step] : step;
        this.scale = scale;
        this.iteration = 0;
    };

    ToneGenerator.prototype.generateTones = function(n){
        var notes = [];
        while(n>0){
            notes.push(this.scale[this.state%this.scale.length]);
            this.state = this.state + this.step[this.iteration%this.step.length];
            n--;
            this.iteration++;
        }
        return notes;
    };

    window.ToneGenerator = ToneGenerator;
    
})(window);
