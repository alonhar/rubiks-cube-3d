
  class LittleCube{
      constructor(modifier){
        var geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
        geometry.mergeVertices();
        modifier.modify(geometry);
        var cube = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
            vertexColors: THREE.FaceColors,


        }));
        cube.geometry.faces.forEach(face => face.color.setHex(0x000000))
            // console.log(cube.geometry.faces)
        return cube;
      }

  }
