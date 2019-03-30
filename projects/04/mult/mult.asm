// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Mult.asm

// Multiplies R0 and R1 and stores the result in R2.
// (R0, R1, R2 refer to RAM[0], RAM[1], and RAM[2], respectively.)

// Put your code here.

// set RAM[2] to 0
@2
M=0

// jump to end if any is 0
@0
D=M
@21
D;JEQ
@1
D=M
@21
D;JEQ

// set RAM[2] to D
@2
D=M

// set RAM[0] to M
@0

// sum D with the value of RAM[0]
D=D+M

// store the value of D in RAM[2]
@2
M=D

// subtract 1 from RAM[1]
@1
M=M-1

// set M to D
D=M

// set M to begin of program
@10

D;JGT

@21
0;JMP





