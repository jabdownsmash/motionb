var Color = net.brehaut.Color;

var generateColors = function()
{
    gg.colora =  randomColor();
    var cjs = Color(gg.colora);
    gg.colorb =  cjs.shiftHue(180).toCSS();
}

var generateSpike = function()
{
    var angle = Math.random()*Math.PI*2;
    var x = Math.random()*gg.width - gg.width/2;
    var y = Math.random()*gg.height - gg.height/2;
    var vx = Math.cos(angle)*3;
    var vy = Math.sin(angle)*3;
    if(Math.abs(vx) > Math.abs(vy))
    {
        x = -Math.sign(vx) * (gg.width/2 + 200);
    }
    else
    {
        y = -Math.sign(vy) * (gg.height/2 + 200);
    }
    spike = generators.motionb_spike(gg.scene,gg.colorb,x,y,vx,vy);
    gg.objects.push(spike);
}

var getScore = function()
{
    var a = (gg.currentTime - gg.start)/1000*2;
    var b = gg.kills*5;
    return a + b + 100;
}

var generateLevel = function()
{
    for(var i = 0; i < 10; i++)
    {
        generateSpike();
    }

    var container = new MotionContainer();

    var mtl = new THREE.MeshBasicMaterial( { color: gg.colorb, side: THREE.DoubleSide } );
    for(var k = 0; k < 10; k++)
    {
        var plane = [];
        for(var i = 0; i < 10; i++)
        {
            var row = [];
            for(var j = 0; j < 10; j++)
            {
                var obj = new THREE.Mesh( new THREE.CylinderGeometry( 10, 10, 20, 16 ),  mtl);
                // var obj = generators.motiona.generateTree({
                //         radius : 5,
                //         length : 60,
                //         branch : 0,
                //         last : {
                //                 radius : 1,
                //                 length : 50,
                //                 branch : 3
                //             },
                //         numSections : 2,
                //         color: gg.colorb,
                //     });

                var test = {obj:obj}
                container.add(test);
                row.push(obj);
            }
            plane.push(row);
        }
        gg.trees.push(plane);
    }

    container.update = function(t)
        {
            container.obj.rotation.x = Math.PI/4*1.3;
            container.obj.position.z = -1200;
            container.obj.position.y = 100;
            container.obj.rotation.y -= .0035;
            container.obj.rotation.z = .15;

            var cosT = Math.cos(t/10000);
            var sinT = Math.sin(t/10000);
            var space = 100;
            // var space = 100 + 50*(cosT*cosT*cosT*cosT*cosT*cosT - sinT*sinT*sinT + 1)/2;

            for(var k = 0; k < 10; k++)
            {
                for(var i = 0; i < 10; i++)
                {
                    for(var j = 0; j < 10; j++)
                    {
                        var obj = gg.trees[k][i][j];
                        obj.position.x = i*space - space*(9)/2;
                        obj.position.z = j*space - space*(9)/2;
                        // obj.position.y = Math.sin(i*.4 + j*.6 + t/6500)*30;
                        obj.position.y = k*space - space*(9)/2;

                        obj.rotation.x = t*(10 - j)/1000;
                        obj.rotation.y = t/1000;

                        var score = getScore();
                        var scale = 0;
                        obj.visible = false;
                            // console.log(score);
                        if(score - 10> k*100 + i*10 + j)
                        {
                            obj.visible = true;
                        }
                    }
                }
            }
        };

    container.onReset = function()
    {
        gg.scene.remove(container.obj);
        gg.trees = [];
        return true;
    }

    gg.start = Date.now();
    gg.kills = 0;
    gg.lastSpawn = Date.now();
    gg.spawnTime = 3000;

    gg.scene.add(container.obj);
    gg.objects.push(container);
}

var onDeath = function()
{
    gg.transition = true;
    gg.sounds.fail.play();
    gg.indicator.disconnect();
    gg.sounds.bgm.fadeOut(0,300,function(){gg.sounds.bgm.stop()});
}

MotionB = function(settings)
{
    gg.sounds = {};
    var sounds = {}
    sounds.fail = new Howl({
      urls: ['assets/motionb/fail.ogg'],
    });
    sounds.smack = new Howl({
      urls: ['assets/motionb/smack.ogg'],
    });
    sounds.smacklight = new Howl({
      urls: ['assets/motionb/smacklight.ogg'],
      volume: .5,
    });
    gg.sounds.fail = {
        play:function()
        {
            // sounds.fail._rate = 1 + Math.random()*.3;
            // sounds.fail.play();
            gg.sounds.weird._rate = 1 + Math.random()*.3;
            gg.sounds.weird.play();
        }
    }
    gg.sounds.smack = {
        play:function()
        {
            sounds.smack._rate = .8 + Math.random()*.4;
            sounds.smack.play();
        }
    }
    gg.sounds.smacklight = {
        play:function()
        {
            sounds.smacklight._rate = .9 + Math.random()*.2;
            sounds.smacklight.play();
        }
    }
    gg.sounds.weird = new Howl({
      urls: ['assets/motionb/weird.ogg'],
    });
    gg.sounds.fadein = new Howl({
      urls: ['assets/motionb/fadein.ogg'],
    });
    gg.sounds.attractorhit = new Howl({
      urls: ['assets/motionb/attractorhit.ogg'],
      volume: .2,
    });
    gg.sounds.attractor = new Howl({
      urls: ['assets/motionb/attractor.ogg'],
      loop: true,
      autoplay: true,
      volume: 0,
    });
    gg.sounds.bgm = new Howl({
      urls: ['assets/motionb/song.ogg'],
      autoplay: true,
      loop: true,
      volume: 0.5,
      // rate: 1 + .5*Math.random(),
      // onend: function() {
      //   alert('Finished!');
      // }
    });
     var light = new THREE.AmbientLight( 0xffffff, 0x080820, 1 );
     // var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    // gg.scene.add( light ); 

    // var colora = 0x439E65;
    // var colorb = 0xCDF9AD;
    // var colora =  Math.floor(0xffffff*Math.random());
    // var gg.colorb =  Math.floor(0xffffff*Math.random());
    generateColors();

    // gg.renderer.sortObjects = false;

    gg.trees = [];
    // gg.scene.fog = new THREE.FogExp2( gg.colora, 2); //p1

    gg.renderer.setClearColor(gg.colora);
//     gg.renderer.setClearColor(0x595B5A);

    gg.indicator = generators.motionb_indicator(gg.scene,gg.colora);
    gg.objects.push(gg.indicator);


    gg.faceObj = (new MotionObject(
                 new THREE.TorusKnotGeometry( 30, 15, 10, 20 ),
                 gg.colorb)).obj;

    gg.faceObj.radius = 30;
    gg.faceObj.update = function()
    {
        gg.faceObj.position.x = gg.touch.x;
        gg.faceObj.position.y = gg.touch.y;

        gg.faceObj.rotation.x += .2;
        gg.faceObj.rotation.y += .13;
        gg.faceObj.rotation.z += .07;
    }

    gg.faceObj.onReset = function()
    {
        var col = net.brehaut.Color(gg.colorb);
        gg.faceObj.material.color.r = col.getRed();
        gg.faceObj.material.color.g = col.getGreen();
        gg.faceObj.material.color.b = col.getBlue();
    }
    gg.objects.push(gg.faceObj);
    gg.faceObj.visible = false;
    gg.scene.add(gg.faceObj);

    gg.kills = 0;

    // this.material = new THREE.MeshBasicMaterial( { color: color, side: THREE.DoubleSide } ); //p1
    // gg.mesh = new THREE.Mesh( new THREE.DodecahedronGeometry( 2 , 4),  new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
    gg.mesh = new THREE.Mesh( new THREE.DodecahedronGeometry( 1 , 4), new THREE.MeshBasicMaterial( { color: gg.colorb, side: THREE.DoubleSide } ) );
    gg.mesh.radius = 50
    gg.mesh.scale.set(gg.mesh.radius,gg.mesh.radius,gg.mesh.radius);
    gg.mesh.position.x = -100;
    gg.mesh.vx = 0;
    gg.mesh.vy = 0;

    gg.mesh.update = function(t)
        {
            if(t - gg.lastSpawn > gg.spawnTime)
            {
                generateSpike();
                gg.lastSpawn = t;
                gg.spawnTime *= 1.05;
            }
            if(!gg.transition)
            { 
                if(gg.mousedown)
                {
                    gg.acceleration = .2;
                    var dx = gg.touch.x - gg.mesh.position.x;
                    var dy = gg.touch.y - gg.mesh.position.y;
                    var m = Math.sqrt(dx*dx + dy*dy);

                    if(m < gg.mesh.radius + gg.faceObj.radius)
                    {
                        dx /= m;
                        dy /= m;
                        gg.mesh.vx = -dx*10;
                        gg.mesh.vy = -dy*10;
                        gg.indicator.disconnect();
                        gg.sounds.smacklight.play();
                    }
                    else if (m < (Math.sqrt((gg.indicator.size + .01)) + gg.mesh.radius + gg.faceObj.radius) || gg.connected)
                    {
                        if(!gg.connected)
                        {
                            gg.sounds.attractorhit.play();
                            gg.sounds.attractor.fadeIn(.5,100);
                            gg.connected = true;
                        }
                        gg.indicator.size = m*m - gg.mesh.radius - gg.faceObj.radius;
                        dx *= gg.acceleration/(m);
                        dy *= gg.acceleration/(m);

                        gg.mesh.vx += dx;
                        gg.mesh.vy += dy;
                    }
                }
                gg.mesh.position.x += gg.mesh.vx;
                gg.mesh.position.y += gg.mesh.vy;

                var margin = 100;

                if(gg.mesh.position.x < -margin - gg.width/2)
                {
                    onDeath();
                }
                if(gg.mesh.position.x > margin + gg.width/2)
                {
                    onDeath();
                }
                if(gg.mesh.position.y < -margin - gg.height/2)
                {
                    onDeath();
                }
                if(gg.mesh.position.y > margin + gg.height/2)
                {
                    onDeath();
                }
            }
        };

    gg.mesh.onReset = function()
    {
        gg.mesh.position.x = -100;
        gg.mesh.position.y = 0;
        gg.mesh.vx = 0;
        gg.mesh.vy = 0;

        gg.indicator.disconnect();

        var col = net.brehaut.Color(gg.colorb);
        gg.mesh.material.color.r = col.getRed();
        gg.mesh.material.color.g = col.getGreen();
        gg.mesh.material.color.b = col.getBlue();
    }

    gg.scene.add( gg.mesh );
    gg.objects.push(gg.mesh);

    gg.touch = {
        x : 0,
        y : 0
    };

    generateLevel();

    var canvas = document.getElementById("canvas");
    canvas.addEventListener("mousedown", 
            function ( event ) {
                event.preventDefault();
                var rect = canvas.getBoundingClientRect();
                var scale = 4/3;
                gg.touch.x = ( event.clientX*scale  - gg.width/2 - rect.left*scale) ;
                gg.touch.y = - (( event.clientY*scale  - gg.height/2 - rect.top*scale)) ;
                if(!gg.transition)
                {
                    gg.mousedown = true;
                    gg.sounds.attractor.fadeIn(.1,100);
                    gg.faceObj.visible = true;
                }
            },false);
    canvas.addEventListener("mouseup", 
            function ( event ) {
                event.preventDefault();
                if(!gg.transition)
                {
                    gg.indicator.disconnect();
                }
            },false);

}

gg.width = 1200;
gg.height = 800;
MotionB.prototype = new MotionScene({orthographic:true,width:gg.width,height:gg.height});
MotionB.prototype.constructor = MotionB

MotionB.prototype.onReset = function()
{
    gg.transition = false;
    var rate = 1 + Math.random()*.5;
    gg.sounds.attractor.stop();
    gg.sounds.attractorhit._rate = rate;
    gg.sounds.attractor._rate = rate;
    gg.sounds.bgm._rate = rate;
    gg.sounds.bgm.volume(.5);
    gg.sounds.attractor.play();
    // gg.sounds.bgm = new Howl({
    //   urls: ['assets/motionb/song.ogg'],
    //   autoplay: true,
    //   loop: true,
    //   rate: 1 + .5*Math.random(),
    //   volume: 0.5,
    //   onend: function() {
    //     alert('Finished!');
    //   }
    // });
    gg.sounds.bgm.play();
    gg.renderer.setClearColor(gg.colora);
}

MotionB.prototype.postReset = function()
{
    generateLevel();
}
