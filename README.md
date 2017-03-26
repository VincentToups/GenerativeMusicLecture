Generative Music In the Browser
===============================

This is a repository containing a tutorial generative art piece for
the Iron Yard.

Running The Code
================

Clone the git repository somewhere:

    git clone https://github.com/VincentToups/GenerativeMusicLecture
    
And then open up the index.html

How it Works
============

This piece operates by combining two simple generative processes: a
tone generator and a rhythm generator. Both work by the simple process
successively adding a number to a numerical state and then converting
that state either into a tone or a rhythm.

In the former case, the state is used to index into a scale, returning
a note from a set of notes. In the latter case, we convert the number
to base 8 and then convert each set of adjacent digits into a note
whose duration in sixteenth notes is the length of the set.

You can see these two simple classes in the files

    ./ToneGenerator.js
    ./RhythmGenerator.js
    
The results of these two processes are combined in the `Combiner.js`
class.

A visualization which attempts to show the progress of the music is
defined in `NotesView.js`.

Libraries
---------

I've included a copy of `timbre.js`, an audio synthesis library. 

It is available here:

    https://github.com/mohayonao/timbre.js

This project is also under the MIT License.
