var Color = net.brehaut.Color;
MotionB = function(settings)
{
     var light = new THREE.AmbientLight( 0xffffbb, 0x080820, 1 );
     // var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    // gg.scene.add( light ); 

    // var colora = 0x439E65;
    // var colorb = 0xCDF9AD;
    var colora =  Math.floor(0xffffff*Math.random());
    var cjs = Color("#" + colora.toString(16));
    var colorb =  cjs.shiftHue(180).saturateByAmount(.5).toCSS();
    // var colorb =  Math.floor(0xffffff*Math.random());

    // gg.renderer.sortObjects = false;

    gg.trees = [];
    gg.scene.fog = new THREE.FogExp2( colora, 2); //p1

    gg.renderer.setClearColor(colora);
//     gg.renderer.setClearColor(0x595B5A);

    gg.indicator = generators.motionb_indicator(gg.scene,colora);
    gg.objects.push(gg.indicator);


    gg.faceObj = (new MotionObject(
                 new THREE.TorusKnotGeometry( 30, 15, 10, 20 ),
                 colorb)).obj;

    gg.faceObj.radius = 50;
    gg.faceObj.update = function()
    {
        gg.faceObj.position.x = gg.touch.x;
        gg.faceObj.position.y = gg.touch.y;

        gg.faceObj.rotation.x += .2;
        gg.faceObj.rotation.y += .13;
        gg.faceObj.rotation.z += .07;
    }
    gg.objects.push(gg.faceObj);
    gg.faceObj.visible = false;
    gg.scene.add(gg.faceObj);


    // this.material = new THREE.MeshBasicMaterial( { color: color, side: THREE.DoubleSide } ); //p1
    // gg.mesh = new THREE.Mesh( new THREE.DodecahedronGeometry( 2 , 4),  new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
    gg.mesh = new THREE.Mesh( new THREE.DodecahedronGeometry( 2 , 4), new THREE.MeshBasicMaterial( { color: colorb, side: THREE.DoubleSide } ) );
    gg.mesh.radius = 25
    gg.mesh.scale.set(gg.mesh.radius,gg.mesh.radius,gg.mesh.radius);
    gg.mesh.position.x = -100;
    gg.mesh.vx = 0;
    gg.mesh.vy = 0;

    gg.mesh.update = function()
        {

            if(gg.mousedown)
            {
                gg.acceleration = .8;
                var dx = gg.touch.x - gg.mesh.position.x;
                var dy = gg.touch.y - gg.mesh.position.y;
                var m = Math.sqrt(dx*dx + dy*dy);

                if(m < gg.mesh.radius + gg.faceObj.radius)
                {
                    dx /= m;
                    dy /= m;
                    gg.mesh.vx = -dx*10;
                    gg.mesh.vy = -dy*10;
                    gg.mousedown = false;
                }
                else if (m < Math.sqrt((gg.indicator.size + .01)) + gg.mesh.radius + gg.faceObj.radius)
                {
                    dx *= gg.acceleration/(m);
                    dy *= gg.acceleration/(m);

                    gg.mesh.vx += dx;
                    gg.mesh.vy += dy;
                }
            }
            gg.mesh.position.x += gg.mesh.vx;
            gg.mesh.position.y += gg.mesh.vy;
        };

    gg.scene.add( gg.mesh );
    gg.objects.push(gg.mesh);

    gg.spike = generators.motionb_spike(gg.scene,colorb)
    gg.objects.push(gg.spike);

    gg.touch = {
        x : 0,
        y : 0
    };


    gg.obj = generators.motiona.generateTree({
        radius : 10,
        length : 80,
        branch : 0,
        last : {
            radius : 2,
            length : 10,
            branch : 2
        },
        curve : {
            base: Math.PI/8,
            random: Math.PI/8,
        },
        numSections : 5,
        color: colorb,
    });

    gg.obj.update = function(t)
    {
        // gg.obj.obj.position.z = 100;
        // gg.obj.obj.position.y = -100;

        gg.container.obj.rotation.x = Math.PI/4*2.3;
        gg.container.obj.position.z = -300;

        var k = 0;
        var process;
        process = function(obj) {
            if(obj.branch)
            {
                process(obj.branch);
                obj.obj.rotation.y = t/5000 - k;
            }
            k++;
            if(obj.child) process(obj.child);
        }
        process(gg.obj);

        gg.container.obj.rotation.y -= .0035;

        var cosT = Math.cos(t/10000);
        var sinT = Math.sin(t/10000);
        var space = 100 + 50*(cosT*cosT*cosT*cosT*cosT*cosT - sinT*sinT*sinT + 1)/2;

        for(var i = 0; i < gg.trees.length; i++)
        {
            for(var j = 0; j < gg.trees[i].length; j++)
            {
                var obj = gg.trees[i][j].obj;
                obj.position.x = i*space - space*(gg.trees.length - 1)/2;
                obj.position.z = j*space - space*(gg.trees[i].length - 1)/2;
                obj.position.y = Math.sin(i*.4 + j*.6 + t/6500)*30;

                obj.rotation.y = t;

                if(gg.fft)
                {
                    obj.rotation.z -= (obj.rotation.z - gg.fft.getEnergy((i+1)*(j+1)*50)/200)/3;
                }

                var k = 0;
                var process;
                process = function(obj) {
                    if(obj.branch)
                    {
                        process(obj.branch);
                        obj.obj.rotation.y = (t/3000) - k;
                    }
                    k++;
                    if(obj.child) process(obj.child);
                }
                process(gg.trees[i][j]);
            }
        }
    }

    gg.objects.push(gg.obj);
    // gg.scene.add(gg.obj.obj);

    gg.container = new MotionContainer();

    for(var i = 0; i < 8; i++)
    {
        var row = [];
        for(var j = 0; j < 8; j++)
        {
            var obj = generators.motiona.generateTree({
                    radius : 5,
                    length : 60,
                    branch : 0,
                    last : {
                            radius : 1,
                            length : 50,
                            branch : 3
                        },
                    numSections : 2,
                    color: colorb,
                });

//             obj.obj.position.x = i*100 - 250
            obj.obj.position.z = j*1 - 250

            gg.container.add(obj);
            row.push(obj);
        }
        gg.trees.push(row);
    }
    gg.scene.add(gg.container.obj);

    document.addEventListener("mousedown", 
            function ( event ) {
                event.preventDefault();
                // console.log(gg.touch.y);
                gg.touch.x = ( event.clientX  ) - window.innerWidth/2 ;
                gg.touch.y = - (( event.clientY  ) - window.innerHeight/2) ;
                gg.mousedown = true;
                gg.faceObj.visible = true;
            },false);
    document.addEventListener("mouseup", 
            function ( event ) {
                event.preventDefault();
                gg.mousedown = false;
                gg.faceObj.visible = false;
                gg.indicator.size = 0;
            },false);

}

MotionB.prototype = new MotionScene({orthographic:true});
MotionB.prototype.constructor = MotionB
