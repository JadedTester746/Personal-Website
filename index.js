

async function loadBlog(){
    const indexFile = await fetch("Blog Posts/index.json");
    const projectNames = JSON.parse(await indexFile.text());

    blog = [];
    for(let i = 0; i < projectNames.projects.length; i++){
        const curr = JSON.parse(await (await fetch(projectNames.projects[i])).text());
        blog[i] = curr;
    }
}

function loadPage(index){

}

function loadTableOfContents(){

}

let blog = null;
let index = -1;

function incrementIndex(){
    if(index + 1 < blog.length){
        index++;
        loadPage(index);
    }
}

function decrementIndex(){
    if(index -1 >= 0){
        index--;
        loadPage(index);
    }
}

loadBlog();

