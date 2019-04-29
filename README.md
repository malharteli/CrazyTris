# CrazyTris
a crazy little project

This is the mad, mad, MAD attempt of one Malhar Teli to produce a webpage-based version of Not Tetris 2.

In its current state, CrazyTris uses Phaser 3's Matter physics system to create three shapes. 
Each shape is in fact a "body" in the context of Phaser 3, composed of a set of Vectors that indicates its bounds. 
Also implemented is the PolyK library of methods. The current MainScene uses the Slice method from this library. With it, you can input two 
