var scene = new Scene();
var cubes = [];
var numberOfCubes = 6;
for (var i = 0; i < numberOfCubes; i++) {
    let cube = new Cube3d(randomCube, scene);
    cubes.push(cube)
    cube.drawTheCube();
    cube.group.position.x = (i % 2) * 5 - (i % 2) * 10+ 3;
    cube.group.position.y = (i % 3) * 5 - (i % 3) * 10 + 5;
    if (i == 5) {
        cube.group.rotation.x += Math.PI * (i / 2)
    } else if (i == 4) {
        cube.group.rotation.x += Math.PI * 1.5

    } else {
        cube.group.rotation.y = Math.PI * i / 2
    }
    scene.addRender(cube)
}

cubes[0].cubeSolution(solution => {
    cubes.forEach(cube => cube.solution = solution.slice())
})

scene.render();


window.addEventListener("keypress", function() {

    cubes.forEach(cube =>{if(!cube.solveStart)cube.solve.bind(cube)();})

}, false);

window.addEventListener("touchstart", function() {
  startTime = new Date();
}, false);


  window.addEventListener("touchend", function() {
    endTime = new Date();
    if(endTime-startTime<100){
      if(this.solveStart == true){
        return;
      }
      cubes.forEach(cube =>{if(!cube.solveStart)cube.solve.bind(cube)();})
    }
  }, false);
