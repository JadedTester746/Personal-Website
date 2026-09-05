

async function loadBlog(){
    const indexFile = await fetch("Blog Posts/index.json");
    const projectNames = JSON.parse(await indexFile.text());

    blog = [];
    for(let i = 0; i < projectNames.projects.length; i++){
        const curr = JSON.parse(await (await fetch(projectNames.projects[i])).text());
        blog[i] = curr;
    }
}

function loadPage(newIndex){
    index = newIndex;
    document.getElementById('blogpage').innerHTML = blog[newIndex].content;
    document.getElementById('blogpage').innerHTML += `<button onclick="document.getElementById('blogpage').style.visibility = 'hidden';" class="blogclose">X</button>`;
    if(newIndex > 0){
        document.getElementById('blogpage').innerHTML += `<button onclick="decrementIndex();" class="pagechange">←</button>`;
    }
    if(newIndex < blog.length -1){
        document.getElementById('blogpage').innerHTML += `<button onclick="incrementIndex();" class="pagechange">→</button>`;
    }


}

function loadTableOfContents(){
    document.getElementById('blogpage').innerHTML = `<h2 class="blogheading">Table of Contents</h2>`;
    for(let i = 0; i < blog.length; i++){
        document.getElementById('blogpage').innerHTML += `<p class='bloglink' onclick='loadPage(${i});'>Page ${i+1} ${blog[i].title}</p>`
    }
    document.getElementById('blogpage').innerHTML += `<button onclick="document.getElementById('blogpage').style.visibility = 'hidden';" class="blogclose">X</button>`;
}

let blog = null;
let index = -1;

function incrementIndex(){
    if(index + 1 < blog.length){
        loadPage(index + 1);
    }
}

function decrementIndex(){
    if(index -1 >= 0){
        loadPage(index - 1);
    }
}

loadBlog();

