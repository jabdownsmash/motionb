
generators.motionb_indicator = function(scene,color)
{
    var indicator = {};
    indicator.mtl = new THREE.MeshBasicMaterial( { color: color, side: THREE.DoubleSide } );
    indicator.mtl.transparent = true;
    indicator.mtl.opacity = .7;
    indicator.obj = new THREE.Mesh( new THREE.CircleGeometry( 1, 32 ),  indicator.mtl);
    indicator.obj.scale.set(50,50,50);
    indicator.obj.position.z = (-100);

    indicator.update = function(t)
    {
        if(gg.mousedown)
        {
            indicator.size += 10000;
            indicator.obj.scale.set(Math.sqrt((indicator.size + .01)),Math.sqrt((indicator.size + .01)),Math.sqrt((indicator.size + .01)));
            indicator.obj.visible = true;
            indicator.obj.position.x = gg.touch.x;
            indicator.obj.position.y = gg.touch.y;
            indicator.obj.opacity = 1/(Math.sqrt((indicator.size + .01)) + 1);
        }
        else
        {
            indicator.obj.visible = false;
        }
    }
    indicator.size = 0;
    scene.add(indicator.obj);

    return indicator;
}