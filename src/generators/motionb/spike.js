
generators.motionb_spike = function(scene,color)
{
    var spike = new THREE.Mesh( new THREE.DodecahedronGeometry( 2 , 4), new THREE.MeshBasicMaterial( { color: color, side: THREE.DoubleSide } ) );
    spike.scale.set(15,15,15);
    spike.position.x = -100;
    spike.vx = 0.1;
    spike.vy = 0;

    spike.update = function()
        {

            // if(gg.mousedown)
            // {
            //     gg.acceleration = .8;
            //     var dx = gg.touch.x - spike.position.x;
            //     var dy = gg.touch.y - spike.position.y;
            //     var m = Math.sqrt(dx*dx + dy*dy);

            //     if(m < 100)
            //     {
            //         dx /= m;
            //         dy /= m;
            //         spike.vx = -dx*10;
            //         spike.vy = -dy*10;
            //         gg.mousedown = false;
            //     }
            //     else if (m < Math.sqrt((gg.indicator.size + .01)) + 100)
            //     {
            //         dx *= gg.acceleration/(m);
            //         dy *= gg.acceleration/(m);

            //         spike.vx += dx;
            //         spike.vy += dy;
            //     }
            // }
            spike.position.x += spike.vx;
            spike.position.y += spike.vy;
        };

    gg.scene.add( spike );

    return spike;
}