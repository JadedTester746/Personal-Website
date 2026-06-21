

function programOutput(r, reg){
    this.ram = r;
    this.registers = reg;
    return this;
}
function proccessedOutput(corr, inp, out, rec){
    this.correct = corr;
    this.inputString = inp;
    this.outputString = out;
    this.recievedOutputString = rec;
    return this;
}

function printRegisters(registers){
    let out = "";
    for(const [name,val] of registers){
        out += "Name: " + name + " val: " + val + ", ";
    }
    console.log(out);
}

function runCode(file, testcase){
    //initialize registers
    let registers = new Map();
    let ram = new Int16Array(65536);
    for(let i = 2; i < 13; i++){
        registers.set("R"+i, new Int16Array(1));

    }
    registers.set("R0", new Int16Array(1));
    registers.set("R1", new Int16Array(1));
    registers.get("R1")[0] = 1;
    registers.set("SP", 0xDDDD);
    registers.set("F", new Int16Array(1));
    registers.set("PC", new Int16Array(1));
    
    for(let i = 0; i < testcase.initial.length; i++){
        let data = testcase.initial[i];
        for(let i = data.start; i < data.end; i++){
            ram[i] = data.content[i-data.start];
        }
    }

    //iterate through code
    file = file.replaceAll("\n", "");

    let contents = file.split(";");

    let saved = new Map();
    let num = 0;
    for(let i = 0; i < contents.length; i++){
        let line = contents[i];
        let parts = line.split(" ");
        if(parts[0] == "loop"){
            console.log(parts[1]);
            saved.set(parts[1], num & 0xFFFF);
        }
        num++;
    }

   let maxlength = 1_000_000;
   let steps = 0;
    let i = 0;
    outer: for(; i < contents.length - 1; i++){
        try{
        if(steps > maxlength){break;}
        else{steps++;}
        let parts = contents[i].split(" ");
       switch(parts[0]){
            case "LOAD": //good
                registers.get(parts[1])[0] = ram[Number.parseInt(parts[2])]; break;
            case "LI": //good
                registers.get(parts[1])[0] = Number.parseInt(parts[2]); break;
            case "STORE": //good
                ram[Number.parseInt(parts[2])] = registers.get(parts[1])[0]; break;
            case "ADD": //good
                registers.get(parts[1])[0] = (registers.get(parts[2])[0] + registers.get(parts[3])[0]); break;
            case "SUB": //good
                 registers.get(parts[1])[0] = (registers.get(parts[2])[0] - registers.get(parts[3])[0]); break;
            case "AND": //good
                 registers.get(parts[1])[0] = (registers.get(parts[2])[0] & registers.get(parts[3])[0]); break;
            case "XOR": //good
                 registers.get(parts[1])[0] = (registers.get(parts[2])[0] ^ registers.get(parts[3])[0]); break;
            case "OR": //good
                 registers.get(parts[1])[0] = (registers.get(parts[2])[0] | registers.get(parts[3])[0]); break;
            case "PUSH": //good
                registers.set("SP", registers.get("SP")-1);
                ram[registers.get("SP")] = registers.get(parts[1])[0];
                break;
            case "POP": //good
                registers.get(parts[1])[0] = ram[registers.get("SP")];
                registers.set("SP", registers.get("SP")+1);
                break;
            case "JMP":
                let flag = false;
                let flags = registers.get("F")[0];
                let check = Number.parseInt(parts[2]);
                if(parts[1] == "E" && ((flags & 1) == check)){flag = true;}
                else if(parts[1] == "N" && (((flags >> 1) & 1) == check)){flag = true;}
                else if(parts[1] == "U"){flag = true;}
                if(flag){i = saved.get(parts[3]);}
                break;
            case "CMP":
                let result = new Int16Array(1);
                result[0] = registers.get(parts[1])[0] - registers.get(parts[2])[0];
                let t = new Int16Array(1);
                if(result[0] == 0){t[0] |= 1;} // Z flag
                if(result[0] < 0){t[0] |= 2;} // N flag
                registers.get("F")[0] = t[0];
                break;
            case "SHL": //good
                registers.get(parts[1])[0] = (registers.get(parts[2])[0] << registers.get(parts[3])[0]); break;
            case "SHR": //good
                registers.get(parts[1])[0] = (registers.get(parts[2])[0] >> registers.get(parts[3])[0]); break;
            case "INC": //good
                registers.get(parts[1])[0] = registers.get(parts[1])[0]+1;
                break;
            case "DEC": //good
                 registers.get(parts[1])[0] = registers.get(parts[1])[0]-1;
                 break;
            case "MOV": //good
                registers.get(parts[1])[0] = registers.get(parts[2])[0];
                break;
            case "MULT": //good
                 registers.get(parts[1])[0] = (registers.get(parts[2])[0] * registers.get(parts[3])[0]); break;
            case "DIV": //good
                 registers.get(parts[1])[0] = (registers.get(parts[2])[0] / registers.get(parts[3])[0]); break;
            case "loop": //good
                continue;
            default: //good
                alert("There was an unrecognized command on line: " + (i+1));
                break outer;
        }
        registers.get("PC")[0] = i+1;
    }catch(exception){
        alert("There was an error on line: " + (i+1)); break;
    }

    }
    return new programOutput(ram, registers);
}

function processOutput(testcase, output){
    let correct = true;
    let recieved = "";
    for(let i = 0; i < testcase.output.length; i++){
        let data = testcase.output[i];
        for(let j = data.start; j < data.end; j++){
            
            if(output.ram[j] != data.content[j-data.start]){correct = false; }
            recieved += output.ram[j] + ",";
        }
    }
    recieved = recieved.substring(0, recieved.length - 1);
    return new proccessedOutput(correct, testcase.inputString, testcase.outputString, recieved);


}

/*
    problem data JSON
    - description
    - array of cases
        - input string
        - output string
        - array of initial data
            - start index
            - end index
            - contents
        - array of output data
            - start index
            - end index
            - contents
    */

var sampleOutput;
let currentTestCase = 0;
let cases;
let description ="";
let descriptionOpen = false;
let hintOpen = false;
let hint="";

async function loadProblem() {

    const params = new URLSearchParams(window.location.search);
    const problemName = params.get("problem");
    const response = await fetch(problemName+".json");
    const text = await response.text();  
    const problemData = JSON.parse(text);
    return problemData;
}

loadProblem().then(function(problem){
    document.getElementById("left").innerHTML = problem.description;
    description = problem.description;
    sampleOutput = new Array();
    cases = problem.cases;
    hint = problem.hint;
    document.getElementById("title").innerHTML = problem.title;
    runSamples();
});


function runSamples(){
    let file = document.getElementById("code").value;

    sampleOutput[0] = processOutput(cases[0], runCode(file, cases[0]));
    sampleOutput[1] = processOutput(cases[1], runCode(file, cases[1]));
    sampleOutput[2] = processOutput(cases[2], runCode(file, cases[2]));
    setTestCase(currentTestCase);
}

function resetDescription(){
     document.getElementById("left").innerHTML = description;
}

function runAllCases(){
    let file = document.getElementById("code").value;
    
    for(let i = 0; i < cases.length; i++){
        let output = processOutput(cases[i], runCode(file, cases[i]));
        if(!(output).correct){
            document.getElementById("left").innerHTML = `
            <h1>Incorrect failed case ${i+1}</h1>
            <p class='testdata'>input: ${output.inputString}</p> 
            <p class='testdata'>recieved output: ${output.recievedOutputString}</p> 
            <p class='testdata'>expected output: ${output.outputString}</p>
            <button class='submitbutton' onclick='resetDescription()'>close</button>`;
            return;
        }
    }
     document.getElementById("left").innerHTML = "<h1>Congratulations you passsed all test cases!</h1><button class='submitbutton' onclick='resetDescription()'>close</button>";
}

function setTestCase(index){ 
    if(sampleOutput[index].correct){document.getElementById("status").innerHTML = "Status: Correct!";}
    else{document.getElementById("status").innerHTML =  "Status: incorrect";}

    document.getElementById("input").innerHTML = "Input: " + sampleOutput[index].inputString;
    document.getElementById("recievedoutput").innerHTML = "Recieved Output: " + sampleOutput[index].recievedOutputString;
    document.getElementById("expectedoutput").innerHTML = "Expected Output: " + sampleOutput[index].outputString;
    currentTestCase = index;
}

function toggledescription(){
    if(descriptionOpen){
        document.getElementById("languagedescription").style.visibility = 'hidden';
        descriptionOpen = false;
    }
    else{
        document.getElementById("languagedescription").style.visibility = 'visible';
        descriptionOpen = true;
    }
    console.log("Done");
}

function toggleHint(){
    if(hintOpen){
        document.getElementById("hint").innerHTML = "";
        hintOpen = false;
    }
    else{
        document.getElementById("hint").innerHTML = hint;
        hintOpen = true;
    }
    console.log("Done");
}