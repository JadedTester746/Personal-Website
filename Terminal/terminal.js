function drawLineBetweenDivs(element1, element2){
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    const svgRect = document.getElementById("linesvg").getBoundingClientRect();

    document.getElementById("linesvg").innerHTML += `<line id=${"line" + element1.id.toString() + element2.id.toString()} class="line" x1="${rect1.left - svgRect.left + rect1.width / 2}" y1="${rect1.top - svgRect.top + rect1.height/2}" x2="${rect2.left - svgRect.left + rect2.width / 2}" y2="${rect2.top - svgRect.top + rect2.height/2}"/>`

}

function updateVisualMap(map){
    for(entry in map.entries()){
        for(connection in map.value){
            drawLineBetweenDivs(entry.value, connection);
        }
    }
}
async function loadProjects(){
    const indexFile = await fetch("../Projects/index.json");
    const projectNames = JSON.parse(await indexFile.text());


    for(let i = 0; i < projectNames.projects.length; i++){
        const curr = JSON.parse(await (await fetch(projectNames.projects[i])).text());
        projects.set(curr, new Set());
        nameToProject.set(curr.name, curr);
    }
    generateGraph(projects);
    start = nameToProject.get("Universe");

}

function generateGraph(map){
    for(let project of nameToProject.values()){
        for(let i = 0; i < project.connections.length; i++){
            map.get(nameToProject.get(project.connections[i])).add(project);
        }
    }
}

function calculateRouteToProject(target){
    let queue = [];

    let seen = new Set();
    let begin = {};

    begin.node = start;
    begin.prev = null;

    queue.push(begin);

    let out = null;
    while(queue.length> 0){
        let node = queue.shift();
        seen.add(node.node);
        if(node.node === target){
            out = node; 
            break;
        }
        else{
            for(let n of projects.get(node.node)){
                if(!seen.has(n)){
                    let temp = {};
                    temp.node = n;
                    temp.prev = node;
                    queue.push(temp);
                }
            }
        }
    }

    let route = [];
    while(out.prev != null){
        route.push(out.node);
        out = out.prev;
    }
    route.push(start);
    route.reverse();
    return route;
}

function highlightRoute(route){
    //set class of the svg for each edge to highlighted
}

function routeToString(route){
    let routeString = "";
    for(let i = 0; i < route.length; i++){
        routeString += route[i].name + "->";
    }
    return routeString.substring(0, routeString.length - 2);
}

function setRouteText(route){
    document.getElementById("routetext").innerHTML = `Route: ${routeToString(route)}`;
}

function projectQuickTravel(project){
    window.open(project.href, '_blank');
}

function rankSearchResults(context){
    let out = new Array();
    let i = 0;
    for(const [key, value] of projects.entries()){
        let addition = {};
        addition.object = key;
        addition.distance = levenshteindistance(context, key.name);
        out[i] = addition;
        i++;
    }
    out.sort(function(a, b){return a.distance-b.distance;});
    return out;
}

function displaySearchResults(results){
    document.getElementById("rank1").innerHTML = `<p class="searchresulttext">${results[0].object.name}</p>`;
    document.getElementById("rank2").innerHTML = `<p class="searchresulttext">${results[1].object.name}</p>`;
    document.getElementById("rank3").innerHTML = `<p class="searchresulttext">${results[2].object.name}</p>`;

}

function levenshteindistance(a, b){
    let m = a.length;
    let n = b.length;

    const dp = new Array(m + 1).fill(null).map(() => new Array(n + 1).fill(0));

    for(let i = 0; i <= m; i++){
        dp[i][0] = i;
    }

    for(let i = 0; i <= n; i++){
        dp[0][i] = i;
    }

    for(let i = 1; i <= m; i++){
        for(let j = 1; j <= n; j++){
            if(a[i-1] === b[j-1]){
                dp[i][j] = dp[i-1][j-1];
            }
            else{
                dp[i][j] = 1+ Math.min(dp[i][j-1], Math.min(dp[i-1][j], dp[i-1][j-1]));
            }
        }
    }
    return dp[m][n];
}

function generateVisualMap(){
    let out = [];
    let begin = {};
    begin.node = start;
    begin.layer = 0;
    begin.min = 0;
    begin.max = 360;

    out.push(begin);

    let queue = [];
    queue.push(begin);

    while(queue.length > 0){
        let node = queue.shift();
        let connections = projects.get(node.node);
        let n = connections.size;
        let angleDelta = (node.max - node.min)/n;
        let angle = node.min; 
        console.log(connections);
        for(let connection of connections){
            let temp = {};
            temp.node = connection;
            temp.min = angle;
            temp.max = angle + angleDelta;
            temp.layer = node.layer + 1;
            out.push(temp);
            queue.push(temp);
            angle += angleDelta;
        }
    }

    return out;
}

function randomBetween(min, max){
    return min + Math.random() * (max - min);
}

function renderVisualMap(map){
    for(let node of map){
        console.log(node);
        let angle = randomBetween(node.min, node.max);
        let radius = layerRadiusDelta * node.layer;
        let deltaX = radius * Math.cos(angle * degreesToRadians);
        let deltaY = radius * Math.sin(angle * degreesToRadians);

        let newDiv = document.createElement('div');
        newDiv.className = "project";
        newDiv.id = node.node.name;
        newDiv.style.top = `${50 - deltaY}%`;
        newDiv.style.left = `${50 + deltaX}%`;
        document.getElementById("projects").appendChild(newDiv);
    }
    for(let node of map){
        let connections = node.node.connections;
        for(let connection of connections){
            console.log(connection);
            drawLineBetweenDivs(document.getElementById(node.node.name), document.getElementById(connection)); 
        }
    }
}

/*
    Project JSON
    - Name
    - Href
    - Description
    - Type(domain or project)
    - Connections array
*/

let layerRadiusDelta = 10;
let degreesToRadians = Math.PI / 180;

let projects = new Map();
let nameToProject = new Map();
let start = null;
loadProjects().then(function(map){
    console.log(projects);
    renderVisualMap(generateVisualMap());
}, function(){alert("Failed to load projects, website will not display as intended!")});

setInterval(function(){
    displaySearchResults(rankSearchResults(document.getElementById("searchbar").value));
}, 500);

