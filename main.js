var colors = {
    U: 0xFF3300,
    R: 0x3533bf,
    F: 0x00CC00,
    D: 0xFFFF00,
    L: 0xFF6600,
    B: 0xFF66FF
};
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
Array.prototype.swap = function(x, y) {
    var b = this[x];
    this[x] = this[y];
    this[y] = b;
    return this;
}

function divArr(arr) {
    var res = []
    for (var i = 0; i < 9; i += 3) {
        var valInsert = arr.splice(0, 3)
        res.push(valInsert)
    }
    return res;
}

function transposeArray(arr) {
    var transpose = m => m[0].map((x, i) => m.map(x => x[i]))

    var res = transpose(divArr(arr))

    return res.reduce((a, b) => a.concat(b));


}

function flipArr(arr) {
    var res = divArr(arr)
    res.swap(0, 2);
    return res.reduce((a, b) => a.concat(b));
}

// Cube.initSolver()
class Cube3d {

    constructor(cube,scene) {
      this.flipObj = {
          startFlip: false,
          dir: "-1",
          axis: "y"
      };
      this.empty = false;
        this.group = new THREE.Group();
        this.modifier = new THREE.SubdivisionModifier(2);
        this.cube = cube.clone();
        this.rubikscube = this.cubeMatFromObj(randomCube)
        Cube.asyncInit('lib/worker.js', () =>{
            // Initialized

            Cube._asyncSolve(cube, (algorithm)=> {
                this.solution = algorithm;
                this.solution = this.solution.split(" ");
                console.log("yeee")
            });
        });

    }


    cubeMatFromObj() {
        var cubeStr = this.cube.asString()

        var rubikscube = []
        cubeStr = cubeStr.split("").map(x => colors[x]);
        for (var i = 0; i < 54; i += 9) {
            var valInsert = (cubeStr.splice(0, 9))
                //  console.log(valInsert)

            //  console.log(valInsert)
            rubikscube.push(flipArr(valInsert))
        }
        rubikscube.swap(3, 0)
        rubikscube.swap(2, 1)
        rubikscube.swap(5, 2)
        rubikscube.swap(0, 2)
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

      flip(n, dir, times) {


         this.flipObj.axis = axisProperty[n].p
         var blocksInSide = this.getSideFromGroup(n, this.rubikGroup, true);
         // console.log(blocksInSide)
         var sideToFlip = new THREE.Object3D();
         blocksInSide.forEach(mesh => {

             this.rubikGroup.remove(mesh);
             sideToFlip.add(mesh);
         });

         this.pivot = new THREE.Object3D();
         //  pivot.add(sideToFlip)



         this.pivot.add(sideToFlip)

         this.rubikGroup.add(this.pivot);
         this.flipObj.startFlip = true;
         this.flipObj.dir = dir;
         this.flipObj.times = times;

     }
     drawTheCube() {
         this.rubikGroup = new THREE.Group();
         for (var i = 0; i < 27; i++) {

             var geometry = new THREE.BoxGeometry(1, 1, 1);

             var material = new THREE.MeshLambertMaterial({

                 vertexColors: THREE.FaceColors
             });

             var cube = new THREE.Mesh(geometry, material);

             cube = new LittleCube(this.modifier)
             cube.position.x = (Math.floor(i / 3) % 3) - 1;
             cube.position.y = i % 3 - 1;
             cube.position.z = Math.floor(i / 9) - 1



             this.rubikGroup.add(cube)


         }

         var drawBlock = function(color, g) {

             for (var j = 0; j < g.length; j++) {

                 g[j].color.setHex(color);
             }
         }
         this.rubikscube.forEach((colors, i) => {

             var faces = this.getSideFromGroup(i, this.rubikGroup);

             colors.forEach((color, i) => {
                 drawBlock(color, faces[i]);
             })
         })





         this.group.add(this.rubikGroup);





     }
     getSideFromGroup(n, group, blocks) {

         var obj = axisProperty[n];
         if (blocks) {
             return group.children.filter(function(mesh) {
                 return mesh.position[obj.p] == obj.e - 1;
             });
         } else
             return group.children.filter(function(mesh) {
                 return mesh.position[obj.p] == obj.e - 1;
             }).map(x => {
                 var numberOfFace = x.geometry.faces.length / 6
                 return x.geometry.faces.slice(obj.s * numberOfFace / 2, obj.f * numberOfFace / 2)
             })



     }
     render(){

       this.rubikGroup.rotation.x += 0.001;
       this.rubikGroup.rotation.y += 0.001;
       if (this.empty) {
           var rotationXcube = this.rubikGroup.rotation.x;
           var rotationYcube = this.rubikGroup.rotation.y;
           this.drawTheCube();
           this.rubikGroup.rotation.x = rotationXcube;
           this.rubikGroup.rotation.y = rotationYcube;
           this.empty = false;
       }



       if (this.flipObj.startFlip) {


           var dist = Math.abs(this.pivot.rotation[this.flipObj.axis] - this.flipObj.times * this.flipObj.dir * Math.PI / 2)
           if (dist > 0.001) {

               this.pivot.rotation[this.flipObj.axis] += this.flipObj.dir * Math.PI / 60

           } else {
               this.flipObj.startFlip = false;
           }



       }

     }

     solve(){
      // console.log(this.solution)
       var move = this.solution.splice(0, 1)[0];
       if(!move){return}
    //   console.log("move " + move + "   solution " + this.solution.length)
       this.rubikscube = this.cubeMatFromObj(this.cube.move(move))
       var s = move[0];

       var times = 1;
       if (move[1] == "2") {
           times = 2;
       }
       var dir = -1;
       if (move[1] == "'") {
           dir *= -1;
       }
       if (["L", "D", "B"].includes(s)) {
           dir *= -1;
       }


       //0 back
       //1 front
       //2 down
       //4 left
       //5 right
       var flipMoves = {
           "U": 3,
           "F": 1,
           "R": 5,
           "L": 4,
           "B": 0,
           "D": 2
       }

       this.flip(flipMoves[s], dir, times);
       //console.log(rubikGroup.children.length)

       setTimeout(()=> {

           this.group.remove(this.rubikGroup);

           this.empty = true;
           setTimeout(this.solve.bind(this), 300)

       }, 1200 * times);




     }

  }










        var scene = new Scene();

        var cubes = [];
        var numberOfCubes=5;
        for (var i=0;i<numberOfCubes;i++){
              let cube = new Cube3d(randomCube,scene);
              cubes.push(cube)
              cube.drawTheCube();
                cube.group.position.x = (2*i-numberOfCubes+1)/2*5 ;

              scene.addRender(cube)

        }


        scene.render();
        // arrow = new Arrow()
        // scene.addRender(arrow)



    //
    window.addEventListener("keypress", function(){cubes.forEach(cube=>cube.solve.bind(cube)())}, false);
