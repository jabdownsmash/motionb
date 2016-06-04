
generators.motionb_spike = function(scene,color,x,y,vx,vy)
{
    var motionObj = new MotionObject( new THREE.DodecahedronGeometry( 1 , 1), color);
    var spike = motionObj.obj;
    spike.radius = 30;
    spike.scale.set(spike.radius,spike.radius,spike.radius);
    spike.position.x = x || 0;
    spike.position.y = y || 0;
    spike.vx = vx || 0;
    spike.vy = vy || 0;

    var subIndicator = {}
    subIndicator.obj = new THREE.Mesh( new THREE.ConeGeometry( 25, 5, 3),  motionObj.obj.material);
    subIndicator.obj.scale.set(8,8,.01);
    subIndicator.obj.position.z = (100);
    // subIndicator.obj.visible = false;
    scene.add(subIndicator.obj);

    motionObj.addOriginalVertices();

    spike.onReset = function()
        {
            scene.remove(spike);
            scene.remove(subIndicator.obj);
            return true;
        };

    var mult = Math.random();

    motionPasses.addRandomLength(.5)(motionObj);
    spike.hit = function()
    {
        motionPasses.randomizeVerticesLength(3)(motionObj);
        gg.sounds.smack.play();
    }

    spike.update = function(t)
        {
            spike.position.x += spike.vx;
            spike.position.y += spike.vy;

            subIndicator.obj.position.x = spike.position.x;
            subIndicator.obj.position.y = spike.position.y;
            subIndicator.obj.scale.x = 1;

            var indicatorMargin = 50 + Math.sin(t/50 + mult*1000)*10;
            if(spike.position.x < -gg.width/2)
            {
                subIndicator.obj.position.x = -gg.width/2 + indicatorMargin;
                subIndicator.obj.rotation.z = Math.PI/2;
            }
            else if(spike.position.x > gg.width/2)
            {
                subIndicator.obj.position.x = gg.width/2 + -indicatorMargin;
                subIndicator.obj.rotation.z = -Math.PI/2;
            }
            else if(spike.position.y < -gg.height/2)
            {
                subIndicator.obj.position.y = -gg.height/2 + indicatorMargin;
                subIndicator.obj.rotation.z = Math.PI;
            }
            else if(spike.position.y > gg.height/2)
            {
                subIndicator.obj.position.y = gg.height/2 + -indicatorMargin;
                subIndicator.obj.rotation.z = 0;
            }
            spike.rotation.z += mult/10;
            spike.rotation.y += .1;

            var dx = spike.position.x - gg.mesh.position.x;
            var dy = spike.position.y - gg.mesh.position.y;
            var dist = Math.sqrt((dx + dx)*(dx + dx) + (dy + dy)*(dy + dy));
            if(!gg.transition && dist < (spike.radius + gg.mesh.radius)*2 - 1)
            {
                var speed = gg.mesh.vx*gg.mesh.vx + gg.mesh.vy*gg.mesh.vy;
                dx /= dist;
                dy /= dist;
                if(speed < 20*20)
                {
                    gg.mesh.vx = -dx*50;
                    gg.mesh.vy = -dy*50;
                }
                else
                {
                    gg.mesh.vx = -dx*2;
                    gg.mesh.vy = -dy*2;
                    spike.vx = dx*50;
                    spike.vy = dy*50;
                    spike.dead = true;
                    gg.kills += 1;
                }
                // if(gg.connected)
                // {
                //     gg.faceObj.visible = false;
                //     gg.mousedown = false;
                // }
                spike.hit();
            }
            var margin = 200;
            var test = function()
            {
                if(spike.dead)
                {
                    scene.remove(spike);
                    scene.remove(subIndicator.obj);
                    return true;
                }
            }
            if(spike.position.x < -gg.width/2 - margin)
            {
                if(test()) {return true};
                spike.position.x = gg.width/2 + margin;
            }
            if(spike.position.x > gg.width/2 + margin)
            {
                if(test()) {return true};
                spike.position.x = -gg.width/2 - margin;
            }
            if(spike.position.y < -gg.height/2 - margin)
            {
                if(test()) {return true};
                spike.position.y = gg.height/2 + margin;
            }
            if(spike.position.y > gg.height/2 + margin)
            {
                if(test()) {return true};
                spike.position.y = -gg.height/2 - margin;
            }
            motionPasses.springPass(50*(Math.sin(t + mult*1000) + 2.1)/2,1)(motionObj);
        };

    scene.add( spike );

    return spike;
}