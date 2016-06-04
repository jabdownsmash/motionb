
generators.motionb_indicator = function(scene,color)
{
    var indicator = {};
    indicator.mtl = new THREE.MeshBasicMaterial( { color: color, side: THREE.DoubleSide } );
    indicator.mtl.transparent = true;
    indicator.mtl.opacity = 1;
    indicator.obj = new THREE.Mesh( new THREE.CircleGeometry( 1, 32 ),  indicator.mtl);
    indicator.obj.scale.set(50,50,50);
    indicator.obj.position.z = (-100);

    var subIndicator = {}
    subIndicator.mtl = new THREE.MeshBasicMaterial( { color: color, side: THREE.DoubleSide } );
    subIndicator.mtl.transparent = true;
    subIndicator.mtl.opacity = 1;
    subIndicator.obj = new THREE.Mesh( new THREE.CircleGeometry( 1, 128 ),  subIndicator.mtl);
    subIndicator.obj.scale.set(50,50,50);
    subIndicator.obj.position.z = (272);
    subIndicator.obj.visible = false;
    scene.add(subIndicator.obj);

    indicator.update = function(t)
    {
        if(gg.transition)
        {
            // if(indicator.size > 2000)
            if(indicator.mtl.opacity >= 2.5)
            {
                if(!subIndicator.obj.visible)
                {
                    toggle();
                    generateColors();
                    var col = net.brehaut.Color(gg.colora);
                    gg.sounds.fadein.play();
                    subIndicator.mtl.color.r = col.getRed();
                    subIndicator.mtl.color.g = col.getGreen();
                    subIndicator.mtl.color.b = col.getBlue();
                    subIndicator.obj.position.x = indicator.obj.position.x;
                    subIndicator.obj.position.y = indicator.obj.position.y;
                    subIndicator.mtl.opacity = 1;
                    subIndicator.obj.visible = true;
                    subIndicator.size = 0;
                    subIndicator.obj.scale.set(((subIndicator.size + .01)),((subIndicator.size + .01)),((subIndicator.size + .01)));
                }
                else
                {
                    if(subIndicator.size > 3000)
                    {
                        gg.reset();
                    }
                    else
                    {
                        subIndicator.size += 100;
                        // indicator.size += 80;
                        subIndicator.obj.scale.set(((subIndicator.size + .01)),((subIndicator.size + .01)),((subIndicator.size + .01)));
                    }
                }
            }
            else
            {
                indicator.obj.position.z = (270);
                indicator.size = 8000;
                indicator.obj.scale.set(((indicator.size + .01)),((indicator.size + .01)),((indicator.size + .01)));
                indicator.mtl.opacity += .05;
                // indicator.size += 80;
                // indicator.obj.scale.set(((indicator.size + .01)),((indicator.size + .01)),((indicator.size + .01)));
            }
            indicator.obj.visible = true;
            indicator.obj.position.x = gg.mesh.position.x;
            indicator.obj.position.y = gg.mesh.position.y;
        }
        else
        {
            if(subIndicator.obj.visible)
            {
                subIndicator.mtl.opacity -= .05;
                if(subIndicator.mtl.opacity < 0)
                {
                    subIndicator.mtl.opacity = 0;
                    subIndicator.obj.visible = false;
                }
            }
            indicator.obj.position.z = (-100);
            if(gg.mousedown)
            {
                indicator.mtl.opacity = 1;
                if(!gg.connected)
                {
                    indicator.size += 10000;
                }
                indicator.obj.scale.set(Math.sqrt((indicator.size + .01)),Math.sqrt((indicator.size + .01)),Math.sqrt((indicator.size + .01)));
                indicator.obj.visible = true;
                indicator.obj.position.x = gg.touch.x;
                indicator.obj.position.y = gg.touch.y;
            }
            else
            {
                // indicator.obj.visible = false;
                indicator.mtl.opacity -= .1;
                if(indicator.mtl.opacity < 0)
                {
                    indicator.mtl.opacity = 0;
                    indicator.obj.visible = false;
                }
            }
        }
    }

    indicator.onReset = function()
    {
        var col = net.brehaut.Color(gg.colora);
        indicator.mtl.color.r = col.getRed();
        indicator.mtl.color.g = col.getGreen();
        indicator.mtl.color.b = col.getBlue();
    }

    indicator.disconnect = function()
    {
        gg.sounds.attractor.fadeOut(0,300);
        gg.mousedown = false;
        gg.faceObj.visible = false;
        gg.connected = false;
        gg.indicator.size = 0;
    }

    indicator.size = 0;
    scene.add(indicator.obj);

    return indicator;
}