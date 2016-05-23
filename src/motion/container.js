
MotionContainer = function(geom,color)
{
    var object = new THREE.Object3D();

    this.obj = object;

}

MotionContainer.prototype.constructor = MotionContainer

MotionContainer.prototype.add = function(obj)
{
  this.obj.add(obj.obj);
}

/*

MotionContainer.prototype.setTo = function(other)
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

MotionContainer.prototype.update = function()
{
    for(var i = 0; i < this.passes.length; i++)
    {
        this.passes[i](this);
    }
}

MotionContainer.prototype.reset = function()
{
    for(var i = 0; i < this.originalGeom.length;i++)
    {
        this.obj.geometry.vertices[i].set(this.originalGeom[i].x,this.originalGeom[i].y,this.originalGeom[i].z);
    }
} */
