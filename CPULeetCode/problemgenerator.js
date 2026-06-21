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


function data(starin, endin, cont){
    this.start = starin;
    this.end = endin;
    this.content = cont;
    return this;
}

function testcase(input, output, initialData, outputData){
    this.inputString = input;
    this.outputString = output;
    this.initial = initialData;
    this.output = outputData;
}

function problemdata(desc, cas, titl){
    this.description = desc;
    this.cases = cas;
    this.title=titl;
}
function generateCase(num){
    let int = new Array();
    let out = new Array();

    int[0] = new data(0xFFF0, 0xFFF1, [num]);
    out[0] = new data(0xFFFF, 0x10000, [validate(int[0].content[0])]);
    return new testcase(""+int[0].content[0], ""+out[0].content[0], int, out);


}

function validatea(n){
    let s = ""+n;
    while(s.length > 1){
        if(s & 1 > 0){
            return 0;
        } 
    }
    return 1;
}



let cases = new Array();
let input = new Array();
let output = new Array();



for(let i = 2; i < 20000; i+= 3){
    cases[i] = generateCase(i);
}
cases = cases.sort(function(a, b){return a.initial[0].content[0] - b.initial[0].content[0];});
let desc =  `<label>Problem #2: Power of two</label>
            <p class="problemdescription"> Powers of two are extrermely important in computer science, between binary numbers, binary trees, and recusrive algorithms like merge sort, they show up everywhere</p>
            <br>
            <p class="problemdescription"> Find out if n is a valid power of 2</p>
            <br>
            <p class="problemdescription"> 0 < n < 20000 will hold for all test cases find out if log_2(n) is an integer</p>
            <br>
            <p class="problemdescription"> The number n will be stored at the memory address #fff0 before the start of execution store your result at address #ffff store 1 if it is a valid power, store 0 if it is not. You will have a maximum of 1,000,000 clock cycles for your program to finish execution</p>
            <img src="2powers.jpg"></img>`

console.log(JSON.stringify(new problemdata(desc, cases, "Powers of 2")));
