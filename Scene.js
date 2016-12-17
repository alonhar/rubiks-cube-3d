class Scene{
  constructor(){

    this.initScene();
    this.addLight();




  }

  initScene(){

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xffffff);
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.001, 4000);

        this.controls = new THREE.TrackballControls(this.camera);
        this.controls.target.set(0, 0, 0)
        this.controls.zoomSpeed=0.1

        this.camera.position.z = 15;
        this.camera.position.x = 4;
        this.camera.position.y = 4;

        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

  }
  addLight(){
    //Light
    var light = new THREE.AmbientLight(0x404040, 1); // soft white light
    this.scene.add(light);

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(100, 100, 100);

    spotLight.castShadow = true;

    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;

    this.scene.add(spotLight);

  }
  addRender(obj){
    if(!this.renderObj){this.renderObj=[]}
    this.renderObj.push(obj);
    this.scene.add(obj.group)
  }
  render(obj) {

      this.controls.update();
      //camera.position.z += 0.01;
      if(this.renderObj){
        this.renderObj.forEach(function(obj){
          if (obj.render){
          obj.render.bind(obj)()
        }



        })


      }


      requestAnimationFrame(function(){this.render()}.bind(this))
      this.renderer.render(this.scene, this.camera);

  }



}
