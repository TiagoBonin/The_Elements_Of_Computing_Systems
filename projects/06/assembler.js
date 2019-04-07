const fileSystem = require("fs");
var onlyNumbersRegex = RegExp("^[0-9]*$");

// initialize symbolTable
var symbolTable = {};

// execute main function
main();

function main() {
    // read file and convert into an array
    var assemblyFilePath = process.argv[2];
    // var assemblyFilePath = "C:\\Development\\The_Elements_Of_Computing_Systems\\projects\\06\\Pong\\Pong.asm";
    var file = getFile(assemblyFilePath);

    InitializeLabels();
    var fileAsArray = cleanFileAndCompileLabels(file);
    var assembledFile = compile(fileAsArray);

    fileSystem.writeFileSync(assemblyFilePath.replace("asm", "hack"), assembledFile);
}

function InitializeLabels() {
    symbolTable["R0"] = "0";
    symbolTable["R1"] = "1";
    symbolTable["R2"] = "2";
    symbolTable["R3"] = "3";
    symbolTable["R4"] = "4";
    symbolTable["R5"] = "5";
    symbolTable["R6"] = "6";
    symbolTable["R7"] = "7";
    symbolTable["R8"] = "8";
    symbolTable["R9"] = "9";
    symbolTable["R10"] = "10";
    symbolTable["R11"] = "11";
    symbolTable["R12"] = "12";
    symbolTable["R13"] = "13";
    symbolTable["R14"] = "14";
    symbolTable["R15"] = "15";
    symbolTable["SP"] = "0";
    symbolTable["LCL"] = "1";
    symbolTable["ARG"] = "2";
    symbolTable["THIS"] = "3";
    symbolTable["THAT"] = "4";
    symbolTable["SCREEN"] = "16384";
    symbolTable["KBD"] = "24576";
}

// runs through the file and initializes all the labels
function cleanFileAndCompileLabels(file) {
    let labelMemoryAddress = 0;
    let cleanFile = [];
    // get file as array
    let lines = file.split("\n");

    lines.forEach((line) => {
        // if empty or comment, skip it
        if (line.trim().startsWith("//") || line.trim() == "") {
            return;
        }

        // remove any comment and empty spaces
        line = line.replace(/\/\/.*/g, "").trim()

        // check if it is a label instruction
        if (line.includes("(") && line.includes(")")) {
            var label = line.replace(/\(|\)/g, "");
            addSymbolTableEntry(label, labelMemoryAddress);
            return;
        } else {
            cleanFile.push(line);
        }

        labelMemoryAddress++;
    })

    return cleanFile;
}

function getFile(filePath) {
    var fileStream = fileSystem.readFileSync(filePath, 'utf8');
    return fileStream;
}

function compile(fileAsArray) {
    let assembledFile = "";
    let memoryAddress = 16;

    fileAsArray.forEach((line) => {
        // assemble A instructuon
        if (line.startsWith("@")) {
            var instruction = line.replace("@", "");
            if (onlyNumbersRegex.test(instruction)) {
                assembledFile = assembledFile + assembleAInstruction(line);
            } else {
                if (containsInSymbleTable(instruction)) {
                    assembledFile = assembledFile + assembleAInstruction("@" + getAddressFromSymbleTable(instruction));
                } else {
                    addSymbolTableEntry(instruction, memoryAddress)
                    assembledFile = assembledFile + assembleAInstruction("@" + getAddressFromSymbleTable(instruction));
                    memoryAddress++;
                }
            }
        }
        // assemble a C instruction
        else {
            assembledFile = assembledFile + assembleCInstruction(line);
        }        
    })

    return assembledFile;
}

function assembleAInstruction(line) {
    var address = line.replace("@", "");
    var binaryAddress = Number(address).toString(2);
    var zeroesLeft = (15 - binaryAddress.length).toString();
    var assembledAddress = "0" + "0".repeat(zeroesLeft) + binaryAddress + "\n";
    return assembledAddress;
}

function assembleCInstruction(line) {
    var dest = "000";
    var jump = "000";
    var comp = "0000000";

    // compute instruction
    if (line.includes("=")) {
        var instructions = line.split("=");
        destInstruction = instructions[0];
        compInstruction = instructions[1].replace(/(\r\n|\n|\r)/gm, "");

        dest = getDest(destInstruction);
        comp = getComp(compInstruction);
    }
    // jump instruction
    else {
        var instructions = line.split(";");
        jumpInstruction = instructions[1].replace(/(\r\n|\n|\r)/gm, "");
        compInstruction = instructions[0];

        jump = getJump(jumpInstruction);
        comp = getComp(compInstruction);
    }

    var assembledInstruction = "111" + comp + dest + jump + "\n";
    return assembledInstruction;
}

function getDest(instruction) {
    switch (instruction) {
        case "M":
            return "001"
        case "D":
            return "010"
        case "MD":
            return "011"
        case "A":
            return "100"
        case "AM":
            return "101"
        case "AD":
            return "110"
        case "AMD":
            return "111"
        default:
            return "000"
    }
}

function getJump(instruction) {
    switch (instruction) {
        case "JGT":
            return "001"
        case "JEQ":
            return "010"
        case "JGE":
            return "011"
        case "JLT":
            return "100"
        case "JNE":
            return "101"
        case "JLE":
            return "110"
        case "JMP":
            return "111"
        default:
            return "000"
    }
}

function getComp(instruction) {
    // operate in the address of A
    if (instruction.includes("M")) {
        switch (instruction) {
            case "M":
                return "1110000"
            case "!M":
                return "1110001"
            case "-M":
                return "1110011"
            case "M+1":
                return "1110111"
            case "M-1":
                return "1110010"
            case "D+M":
                return "1000010"
            case "D-M":
                return "1010011"
            case "M-D":
                return "1000111"
            case "D&M":
                return "1000000"
            case "D|M":
                return "1010101"
            default:
                return "1000000"
        }
    }
    // operate with A
    else {
        switch (instruction) {
            case "0":
                return "0101010"
            case "1":
                return "0111111"
            case "-1":
                return "0111010"
            case "D":
                return "0001100"
            case "A":
                return "0110000"
            case "!D":
                return "0001101"
            case "!A":
                return "0110001"
            case "-D":
                return "0001111"
            case "-A":
                return "0110011"
            case "D+1":
                return "0011111"
            case "A+1":
                return "0110111"
            case "D-1":
                return "0001110"
            case "A-1":
                return "0110010"
            case "D+A":
                return "0000010"
            case "D-A":
                return "0010011"
            case "A-D":
                return "0000111"
            case "D&A":
                return "0000000"
            case "D|A":
                return "0010101"
            default:
                return "0000000"
        }
    }
}

function addSymbolTableEntry(entry, memoryAddress) {
    symbolTable[entry] = memoryAddress;
}

function containsInSymbleTable(entry) {
    if (symbolTable[entry]) {
        return true;
    } else {
        return false;
    }
}

function getAddressFromSymbleTable(entry) {
    return symbolTable[entry];
}