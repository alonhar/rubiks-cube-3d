class Arrow{
    constructor(){

      var curve = new THREE.EllipseCurve(
  0, 0,             // ax, aY
  7, 7,            // xRadius, yRadius
  0, 3/2 * Math.PI, // aStartAngle, aEndAngle
  false             // aClockwise
);

var points = curve.getSpacedPoints( 20 );

var path = new THREE.Path();
var geometry = path.createGeometry( points );

var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
material.linewidth=10

var line = new THREE.Line( geometry, material );

var d= points[points.length-1]
var dir = new THREE.Vector3(1 , 0, 0 );
var origin = new THREE.Vector3( d.x, d.y, 0 );
var length = 300;
var hex = 0xff0000;
var arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
arrowHelper.line.material.linewidth=material.linewidth
arrowHelper.setLength(3,2,2)
this.group = new THREE.Group()
this.group.add(line);
this.group.add(arrowHelper);
    }







}
