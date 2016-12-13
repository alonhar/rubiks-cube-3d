var colors = {U:0xFF3300, R:0x3533bf, F:0x00CC00, D:0xFFFF00, L:0xFF6600, B:0xFF66FF};
var axisProperty = [{
    p: "z",
    e: 0,
    s: 10,
    f: 12
}, {
    p: "z",
    e: 2,
    s: 8,
    f: 10
}, {
    p: "y",
    e: 0,
    s: 6,
    f: 8
}, {
    p: "y",
    e: 2,
    s: 4,
    f: 6
}, {
    p: "x",
    e: 0,
    s: 2,
    f: 4
}, {
    p: "x",
    e: 2,
    s: 0,
    f: 2
}, ]
randomCube = Cube.random();
// randomCube.identity();
Array.prototype.swap = function (x,y) {
  var b = this[x];
  this[x] = this[y];
  this[y] = b;
  return this;
}
function divArr(arr){
  var res = []
  for (var i=0;i<9;i+=3){
    var valInsert = arr.splice(0, 3)
     res.push(valInsert)
  }
  return res;
}
function transposeArray(arr){
  var transpose = m => m[0].map((x,i) => m.map(x => x[i]))

     var res = transpose(divArr(arr))

    return res.reduce((a,b)=>a.concat(b));


}
function flipArr(arr){
  var res = divArr(arr)
  res.swap(0,2);
  return res.reduce((a,b)=>a.concat(b));
}

// Cube.initSolver()


 Cube.asyncInit('lib/worker.js', function() {
     // Initialized

     Cube._asyncSolve(randomCube, function(algorithm) {
          solution = algorithm;
          solution = solution.split(" ");
         console.log("yeee")
     });
 });

function cubeMatFromObj(cube) {
  cubeStr = cube.asString()

    var rubikscube = []
    cubeStr = cubeStr.split("").map(x=>colors[x]);
    for (i = 0; i < 54; i += 9) {
       var valInsert = (cubeStr.splice(0, 9))
      //  console.log(valInsert)

      //  console.log(valInsert)
        rubikscube.push(flipArr(valInsert))
    }
     rubikscube.swap(3,0)
     rubikscube.swap(2,1)
     rubikscube.swap(5,2)
     rubikscube.swap(0,2)
    //  console.log( rubikscube[1]);
    //0 back
    //1 front
    //2 down
    //4 left
    //5 right



     rubikscube[1] = transposeArray(rubikscube[1])
      rubikscube[0] = flipArr(transposeArray(rubikscube[0]))
       rubikscube[2] = ((rubikscube[2]))
        rubikscube[3] = flipArr(rubikscube[3])
      rubikscube[4] = transposeArray(rubikscube[4])
      rubikscube[5] = flipArr(transposeArray(rubikscube[5]))
    return rubikscube;
}
rubikscube = cubeMatFromObj(randomCube)





var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);

controls = new THREE.TrackballControls(camera);
controls.target.set(0, 0, 0)


var renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Light
var light = new THREE.AmbientLight(0x404040,1); // soft white light
scene.add(light);

var spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(100, 100, 100);

spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

spotLight.shadow.camera.near = 500;
spotLight.shadow.camera.far = 4000;
spotLight.shadow.camera.fov = 30;

scene.add(spotLight);

//geometry


var geometry = new THREE.Geometry();

geometry.vertices.push(
	new THREE.Vector3( -0.5,  0.5, 0 ),
	new THREE.Vector3( -0.5, -0.5, 0 ),
	new THREE.Vector3(  0.5, -0.5, 0 ),
  new THREE.Vector3(  0.5, -0.5, 1 ),
  new THREE.Vector3(  -0.5, 0.5, 1 ),
  new THREE.Vector3(  -0.5, -0.5, 1 )
);

geometry.faces.push( new THREE.Face3( 0, 1, 2 ),new THREE.Face3( 3, 4, 5 ),new THREE.Face3( 2, 1, 5 ) );

geometry.computeBoundingSphere();
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var mesh = new THREE.Mesh( geometry, material ) ;
mesh.position.x=4
scene.add( mesh );








//

var rubikGroup = new THREE.Object3D();
var getSideFromGroupl
function drawTheCube(){
rubikGroup = new THREE.Group();
  for (var i = 0; i < 27; i++) {

      var geometry = new THREE.BoxGeometry(1, 1, 1);
      for (var j = 0; j < geometry.faces.length; j++) {
          geometry.faces[j].color.setHex(0xffffff);
      }
      var material = new THREE.MeshLambertMaterial({

          vertexColors: THREE.FaceColors
      });

      var cube = new THREE.Mesh(geometry, material);
      cube.position.x =  (Math.floor(i / 3) % 3)  -1;
      cube.position.y = i % 3 -1;
      cube.position.z = Math.floor(i / 9)-1

      rubikGroup.add(cube)


  }
   getSideFromGroup = function(n, group,blocks) {

      obj = axisProperty[n];
      if (blocks){
        return group.children.filter(function(mesh) {
            return mesh.position[obj.p] == obj.e-1;
        });
      }else
      return group.children.filter(function(mesh) {
          return mesh.position[obj.p] == obj.e-1;
      }).map(x => x.geometry.faces.slice(obj.s, obj.f))



  }
  var drawBlock = function(color, g) {

      for (var j = 0; j < g.length; j++) {

          g[j].color.setHex(color);
      }
  }
  rubikscube.forEach((colors, i) => {

      var faces = getSideFromGroup(i, rubikGroup);

      colors.forEach((color, i) => {
          drawBlock(color, faces[i]);
      })
  })





  scene.add(rubikGroup);





}
drawTheCube()
camera.position.z = 10;
camera.position.x=10;
camera.position.y=10;
function render() {

    controls.update();
    //camera.position.z += 0.01;
    rubikGroup.rotation.x+=0.001;
    rubikGroup.rotation.y+=0.001;
  if(empty){
    var rotationXcube = rubikGroup.rotation.x;
    var rotationYcube = rubikGroup.rotation.y;
    drawTheCube();
    rubikGroup.rotation.x = rotationXcube;
    rubikGroup.rotation.y = rotationYcube;
    empty = false;
  }



  if (flipObj.startFlip){

    // pivot.rotation.z = PI
      var dist = Math.abs(pivot.rotation[flipObj.axis]-flipObj.times*flipObj.dir*Math.PI/2)
      if(dist>0.0001){

          pivot.rotation[flipObj.axis] += flipObj.dir*Math.PI /60

      }else{
        flipObj.startFlip=false;
      }



  }
  // if(sideToFlip.rotation.z==1){
  //
  // }






    requestAnimationFrame(render);
    renderer.render(scene, camera);

}
var empty = false;
var flipObj = {startFlip:false,dir:"-1",axis:"y"};
render();

function flip(n,dir,times){


  flipObj.axis = axisProperty[n].p
    var blocksInSide = getSideFromGroup(n,rubikGroup,true);
    // console.log(blocksInSide)
     sideToFlip = new  THREE.Object3D();
    blocksInSide.forEach(mesh=>{

      rubikGroup.remove(mesh);
        sideToFlip.add(mesh);
    });

    pivot = new   THREE.Object3D();
  //  pivot.add(sideToFlip)



pivot.add(sideToFlip)

    rubikGroup.add(pivot);
    flipObj.startFlip = true;
    flipObj.dir=dir;
    flipObj.times=times;

}




function keyPressed(e) {
    var move = solution.splice(0,1)[0];
  console.log("move "+move  + "   solution "+solution.length)
  rubikscube = cubeMatFromObj(randomCube.move(move))
  var s = move[0];

  var times = 1;
  if (move[1] == "2"){
    times=2;
  }
  var dir=-1;
  if (move[1]=="'"){
    dir*=-1;
  }
  if(["L","D","B"].includes(s)){
    dir*=-1;
  }


  //0 back
  //1 front
  //2 down
  //4 left
  //5 right
  flipMoves ={"U":3,"F":1,"R":5,"L":4,"B":0,"D":2}
   flip(flipMoves[s],dir,times);
  //console.log(rubikGroup.children.length)

  setTimeout(function(){

    scene.remove(rubikGroup);

  empty = true;
  setTimeout(keyPressed,300)},1200);

}




window.addEventListener("keypress", keyPressed, false);
