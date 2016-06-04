var shapePasses =
    {
        translate : function ( x, y, z ) 
            {
                return function(obj) {
                    for(var i = 0; i < obj.originalGeom.length; i++)
                    {
                        var vertex = obj.originalGeom[i];
                        vertex.x += x;
                        vertex.y += y;
                        vertex.z += z;
                    }
                };
            },
        rotate : function ( x, y, z ) 
            {
                var m = new THREE.Matrix4();

                var m1 = new THREE.Matrix4();
                var m2 = new THREE.Matrix4();
                var m3 = new THREE.Matrix4();

                m1.makeRotationX( x );
                m2.makeRotationY( y );
                m3.makeRotationZ( z );

                m.multiplyMatrices( m1, m2 );
                m.multiply( m3 );

                return function(obj) {
                    for(var i = 0; i < obj.originalGeom.length; i++)
                    {
                        obj.originalGeom[i].applyMatrix4(m);
                    }
                };
            },
        linearExpandPass : function( startWidth , endWidth , height , offset)
            {
                return function(obj) {
                    for(var i = 0; i < obj.originalGeom.length; i++)
                    {
                        var vertex = obj.originalGeom[i];
                        var multiplier = startWidth + (endWidth - startWidth)*((vertex.y - offset)/height + 1/2);
                        vertex.x *= multiplier;
                        vertex.z *= multiplier;
                    }
                };
            },
        quadExpandPass : function( startWidth , endWidth , height , offset)
            {
                return function(obj) {
                    for(var i = 0; i < obj.originalGeom.length; i++)
                    {
                        var vertex = obj.originalGeom[i];
                        var multiplier = startWidth + (endWidth - startWidth)*((vertex.y - offset)/height + 1/2);
                        vertex.x *= multiplier*multiplier;
                        vertex.z *= multiplier*multiplier;
                    }
                };
            },
        spinPass : function( spinMultiplier )
            {
                return function(obj) {
                    if(!spinMultiplier)
                    {
                        spinMultiplier = 1;
                    }
                    for(var i = 0; i < obj.originalGeom.length; i++)
                    {
                        var vertex = obj.originalGeom[i];
                        // var radius = Math.sqrt(vertex.x*vertex.x + vertex.y*vertex.y + vertex.z*vertex.z);

                        if(vertex.z > 0)
                        {
                            vertex.applyAxisAngle(new THREE.Vector3(0,1,0),spinMultiplier*vertex.y);
                        }
                        else
                        {
                            vertex.applyAxisAngle(new THREE.Vector3(0,-1,0),spinMultiplier*vertex.y);
                        }
                        // vertex.z *= multiplier*multiplier;
                    }
                };
            },
    };
var motionPasses = {};
motionPasses = {

    everyXDo : function(changeEveryX, callback)
        {
            var animateCounter = 0;
            return function(obj)
                {
                    if(animateCounter++ > changeEveryX)
                    {
                        animateCounter = 0;
                        callback(obj);
                    }
                };
        },

    applyVertexFilter : function(filter)
        {
            return function(obj)
                {
                    var geom = obj.originalGeom;
                    if(obj.hasCustomGeom)
                    {
                        geom = obj.customGeom;
                    }
                    for(var i = 0; i < obj.originalGeom.length; i++)
                    {
                        filter(obj.obj.geometry.vertices[i],geom[i]);
                    }
                    obj.obj.geometry.verticesNeedUpdate = true;
                }
        },

    randomizeVertices : function(randWidth)
        {
            return motionPasses.applyVertexFilter(function(v,o)
                {
                    v.x = o.x + Math.random()*randWidth - randWidth/2;
                    v.y = o.y + Math.random()*randWidth - randWidth/2;
                    v.z = o.z + Math.random()*randWidth - randWidth/2;
                });
        },

    randomizeVerticesLength : function(randLength)
        {
            return motionPasses.applyVertexFilter(function(v,o)
                {
                    var rand = Math.random()*randLength;
                    v.x = o.x*rand;
                    v.y = o.y*rand;
                    v.z = o.z*rand;
                });
        },

    addRandom : function(randWidth)
        {
            return motionPasses.applyVertexFilter(function(v,o)
                {
                    v.x = v.x + Math.random()*randWidth - randWidth/2;
                    v.y = v.y + Math.random()*randWidth - randWidth/2;
                    v.z = v.z + Math.random()*randWidth - randWidth/2;
                });
        },

    addRandomLength : function(randLength)
        {
            return motionPasses.applyVertexFilter(function(v,o)
                {
                    var rand = Math.random()*randLength;
                    v.x = v.x + v.x*rand - randLength/2;
                    v.y = v.y + v.y*rand - randLength/2;
                    v.z = v.z + v.z*rand - randLength/2;
                });
        },

    expoPass : function(mult)
        {
            return motionPasses.applyVertexFilter(function(v,o)
                {
                    v.x += (o.x  - v.x)/mult;
                    v.y += (o.y  - v.y)/mult;
                    v.z += (o.z  - v.z)/mult;
                });
        },

    springPass : function(speedModifier,multiplier)
        {
            return motionPasses.applyVertexFilter(function(v,o)
                {
                    v.speed.x += (o.x  - v.x)/speedModifier;
                    v.speed.y += (o.y  - v.y)/speedModifier;
                    v.speed.z += (o.z  - v.z)/speedModifier;

                    v.speed.x *= multiplier || .9;
                    v.speed.y *= multiplier || .9;
                    v.speed.z *= multiplier || .9;

                    v.x += v.speed.x;
                    v.y += v.speed.y;
                    v.z += v.speed.z;

                    if(Math.abs(v.x) < Math.abs(o.x))
                    {
                        v.speed.x += (o.x - v.x)/speedModifier;    
                    }
                    if(Math.abs(v.y) < Math.abs(o.y))
                    {
                        v.speed.y += (o.y - v.y)/speedModifier;    
                    }
                    if(Math.abs(v.z) < Math.abs(o.z))
                    {
                        v.speed.z += (o.z - v.z)/speedModifier;    
                    }
                });
        },
}