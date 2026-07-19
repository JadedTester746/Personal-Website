function drawLineBetweenDivs(element1, element2){
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    document.getElementById("linesvg").innerHTML += `<line id=${"line" + element1.id.toString() + element2.id.toString()} class="line" x1="${rect1.left}" y1="${rect1.top - rect1.height/2}" x2="${rect2.left}" y2="${rect2.top - rect2.height/2}"/>`
}


function updateVisualMap(map){
    for(entry in map.entries()){
        for(connection in map.value){
            drawLineBetweenDivs(entry.value, connection);
        }
    }
}
async function loadProjects(){
    //create node for all the projects on first pass
    //add edges on second pass
}

function calculateRouteToProject(target){
    //breadth first search from start
}

function highlightRoute(route){
    //set class of the svg for each edge to highlighted
}

function routeToString(route){

}

function setRouteText(route){

}

function projectQuickTravel(project){

}

function rankSearchResults(context){
    //get levenshtein distance to each name
}

function displaySearchResults(){

}

function levenshteindistance(a, b){

}

/*
    Project JSON
    - Name
    - Href
    - Description
    - Type(domain or project)
*/

let projects = new Map();
loadProjects().then(function(map){projects = map;}, function(){alert("Failed to load projects, website will not display as intended!")});


