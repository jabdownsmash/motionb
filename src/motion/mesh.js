
MotionMesh = function(geom,color)
{
    this.material = new THREE.MeshPhongMaterial( { color: color, specular: 0x009900, shininess: 0 } );
    // this.material = new THREE.MeshPhongMaterial( { color: color, specular: 0x009900, shininess: 0, shading: THREE.FlatShading } );
    // this.material = new THREE.MeshLambertMaterial( { color: color, side: THREE.DoubleSide } ); //p1
    // this.material = new THREE.MeshBasicMaterial( { color: color, side: THREE.DoubleSide } ); //p1
    // this.material = new THREE.MeshBasicMaterial( { color: 0x3FB8AF } ); //p1
    var object = new THREE.Object3D( geom, this.material );
    // var object = new THREE.Mesh( geom, new THREE.MeshNormalMaterial() );

    this.obj = object;

    this.passes = [];

    var kek = this;

    this.addOriginalVertices();
    geom.uvsNeedUpdate = true;
    // this.obj.scale.set(50,50,50);
    // var self = this;
    // this.pulse = function(){if(self.pulseFunc){self.pulseFunc(self)};};
    // this.obj.rotation.z = -Math.PI/2;
}

MotionMesh.prototype.constructor = MotionMesh

MotionMesh.prototype.addOriginalVertices = function()
{
    this.originalGeom = [];
    for(var i = 0; i < this.obj.geometry.vertices.length; i++)
    {
        var vertex = this.obj.geometry.vertices[i];
        vertex.speed = {x:0,y:0,z:0};
        var v3 = new THREE.Vector3(vertex.x,vertex.y,vertex.z);
        this.originalGeom.push(v3);
    }
}

MotionMesh.prototype.setTo = function(other)
{
    var vertices = this.obj.geometry.vertices;
    var otherVertices = other.obj.geometry.vertices;
    for(var i = 0; i < vertices.length; i++)
    {
        var j = i;
        j = Math.min(otherVertices.length - 1,i);
        vertices[i].copy(otherVertices[j]);
    }
}

MotionMesh.prototype.update = function()
{
    for(var i = 0; i < this.passes.length; i++)
    {
        this.passes[i](this);
    }
}

MotionMesh.prototype.reset = function()
{
    for(var i = 0; i < this.originalGeom.length;i++)
    {
        this.obj.geometry.vertices[i].set(this.originalGeom[i].x,this.originalGeom[i].y,this.originalGeom[i].z);
    }
}
