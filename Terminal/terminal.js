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
    const indexFile = await fetch("../Projects/index.json");
    const projectNames = JSON.parse(await indexFile.text());

    for(let i = 0; i < projectNames.projects.length; i++){
        const curr = JSON.parse(await (await fetch(projectNames.projects[i])).text());
        projects.set(curr, new Set());
    }
}

function calculateRouteToProject(target){
    let queue = [];

    let seen = new Set();
    queue.push({node: start, prev: null});
    let out = null;
    while(queue.length> 0){
        let node = queue.shift();
        seen.add(node.node);
        if(node.node == target){out = node;}
        else{
            for(let n in map.get(node.node)){
                if(!seen.contains(n)){queue.push({node: n, prev:node});}
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
    for(let entry in projects.entries){
        out[i] = `{object:${entry.key}, distance:${levenshteindistance(context, entry.key.name)}}`;
    }
    out.sort(function(a, b){return a.distance-b.distance;});
    return out;
}

function displaySearchResults(results){
    //Set top results
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

/*
    Project JSON
    - Name
    - Href
    - Description
    - Type(domain or project)
    - Connections array
*/

let projects = new Map();
const start = null;
loadProjects().then(function(map){alert(projects.toString());}, function(){alert("Failed to load projects, website will not display as intended!")});


