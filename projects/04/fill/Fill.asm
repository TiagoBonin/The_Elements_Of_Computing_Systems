// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Fill.asm

// Runs an infinite loop that listens to the keyboard input.
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel;
// the screen should remain fully black as long as the key is pressed. 
// When no key is pressed, the program clears the screen, i.e. writes
// "white" in every pixel;
// the screen should remain fully clear as long as no key is pressed.

// Put your code here.
// RAM[24576] is updated with keyboard keys

// set keyboard RAM to 0 just in case
@24576
M=0

// jump to black routine if key is pressed
@24576
D=M
@8
D;JNE
// loop check again
@2
0;JMP

// initializes black loop
@16384
D=A
@0
M=D
// loop to black the screen
@0
D=M
A=D
M=-1

// if key is not pressed anymore white screen
@24576
D=M
@29
D;JEQ

// increments position to fill with black
@0
M=M+1

//validate if next memory address is still screen
D=M
@24576
D=D-A
@12
D;JLT
@2
0;JMP

// loop to white the screen
@16384
D=A
@0
M=D

@0
D=M
A=D
M=-1
M=!M

@0
M=M+1

D=M
@24576
D=D-A
@33
D;JLT
@2
0;JMP
