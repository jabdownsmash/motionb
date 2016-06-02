
MotionScene = function(settings)
{

    var sketch = function( p ) {
            /* var client_id = 'd7039372b7bf2eee25ff93253c0623e8';
            var url = 'https://soundcloud.com/houseshoes/a-03-what-up-doe?'; */

            var togglePlay = function() {
              if (gg.sound.isPlaying()) {
                gg.sound.pause();
              } else {
                gg.sound.loop();
              }
            }

            p.preload = function(){
              gg.sound = p.loadSound('assets/song.mp3');

            //     s.background(0);
            //     gg.sound = loadSound( sound.stream_url + '?client_id=' + client_id );
            }

            p.setup = function(){
                // var cnv = 0q(100,100);
                // cnv.mouseClicked(togglePlay);
                gg.fft = new p5.FFT();
            //     var mic = new p5.AudioIn();
                // gg.fft.setInput(mic);
                gg.sound.amp(0.2);
                // togglePlay();

                // start the Audio Input.
                // By default, it does not .connect() (to the computer speakers)
                // mic.start();
                // mic.connect();
            }
        };

    this.p5 = new p5(sketch);

    if(settings.orthographic)
    {
        gg.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 );
    }
    else
    {
        gg.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    }
    // gg.camera.position.y = 40;
    gg.camera.position.z = 280;


    var width = window.innerWidth;
    var height = window.innerHeight;
    //Note that we're using an orthographic camera here rather than a prespective
    gg.camera2 = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
    gg.camera2.position.z = 2;
    gg.scene = new THREE.Scene();

/*     var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    directionalLight.position.set( 0, 1000, 0 );
    gg.scene.add( directionalLight ); */

     var light = new THREE.AmbientLight( 0xffffbb, 0x080820, 1 );
     // var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    // gg.scene.add( light ); 

    // var colora = 0x439E65;
    // var colorb = 0xCDF9AD;
    var colora =  Math.floor(0xffffff*Math.random());
    var colorb =  Math.floor(0xffffff*Math.random());
    gg.scene.fog = new THREE.FogExp2( colora, 2); //p1

    gg.renderer = new THREE.WebGLRenderer();
    gg.renderer.setPixelRatio( window.devicePixelRatio );
    gg.renderer.setSize( window.innerWidth, window.innerHeight );
    gg.renderer.setClearColor(colora);
//     gg.renderer.setClearColor(0x595B5A);
    document.body.appendChild( gg.renderer.domElement );

    if(gg.showSpine)
    {
        var spineData = {
                spineName : "spineboy",
                dir : "spine-threejs/example/data/",
                mixes: [
                        {from: 'walk', to: 'jump', value: 0.2},
                        {from: 'run', to: 'jump', value: 0.2},
                        {from: 'jump', to: 'run', value: 0.2}
                    ],
                proceduralAnims : {
                        walk :
                            {
                                head:
                                    {
                                        mirror : 1,
                                        transform : function()
                                        {

                                        },
                                    },
                                front_shin:
                                    {
                                        mirror : 1,

                                    }
                            },
                    },
                startAnimation: "walk",
            };

        gg.anim = generators.generateSpine(spineData);

        // gg.anim.scale.set(5,5,5);
        gg.anim.position.y = -200;
        gg.anim.position.z = -150;
        gg.scene.add(gg.anim);
    }

    gg.indicator = {};

    gg.indicator.mtl = new THREE.MeshBasicMaterial( { color: 0xff0000, side: THREE.DoubleSide } );
    gg.indicator.mtl.transparent = true;
    gg.indicator.mtl.opacity = .3;
    gg.indicator.obj = new THREE.Mesh( new THREE.CircleGeometry( 1, 32 ),  gg.indicator.mtl);
    gg.indicator.obj.scale.set(50,50,50);
    // gg.indicator.obj.position.z = (-100);
    gg.scene.add(gg.indicator.obj);

    gg.indicator.size = 0;
    
    // this.material = new THREE.MeshBasicMaterial( { color: color, side: THREE.DoubleSide } ); //p1
    // gg.mesh = new THREE.Mesh( new THREE.DodecahedronGeometry( 2 , 4),  new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
    gg.mesh = new THREE.Mesh( new THREE.DodecahedronGeometry( 2 , 4), new THREE.MeshBasicMaterial( { color: 0xff0000, side: THREE.DoubleSide } ) );
    gg.mesh.scale.set(50,50,50);
    gg.mesh.position.x = -100;
    gg.mesh.vx = 0;
    gg.mesh.vy = 0;
    gg.scene.add( gg.mesh );


    gg.touch = {
        x : 0,
        y : 0
    };


    gg.obj = generators.generateTree({
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
/*
     gg.obj = new MotionObject(
            new THREE.CylinderGeometry( 10,10, 50),
            0xa89888);
 */
    gg.scene.add(gg.obj.obj);

    gg.container = new MotionContainer();


    // gg.stop = true;

    gg.objects = []

    for(var i = 0; i < 8; i++)
    {
        var row = [];
        for(var j = 0; j < 8; j++)
        {
            var obj = generators.generateTree({
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
            // obj.obj.geometry.computeVertexNormals();
            // obj.obj.add(object);
            gg.container.add(obj);
            row.push(obj);
        }
        gg.objects.push(row);
    }
    gg.scene.add(gg.container.obj);

    if(gg.faceMesh)
    {
        generators.generateMTLMesh(
            {            
                path : "assets/obj/",
                objFilename : "model_mesh.obj",
                mtlFilename : "model_mesh.obj.mtl",
            },
            function ( object )
            {
                // object.position.y = - 95;
                gg.scene.add( object );
                object.scale.set(50,50,50);
                gg.faceObj = object;
            });
    }

        // anim.state.setAnimationByName(0, 'jump', false);
        // anim.state.addAnimationByName(0, 'run', true, 0);


    gg.bufferTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter});

    var boxMaterial = new THREE.MeshBasicMaterial({map:gg.bufferTexture});
    var bufferMaterial = new THREE.ShaderMaterial( {
                uniforms: {
                 bufferTexture: { type: "t", value: gg.bufferTexture },
                 res : {type: 'v2',value:new THREE.Vector2(window.innerWidth,window.innerHeight)}//Keeps the resolution
                },
                fragmentShader: document.getElementById( 'fragShader' ).innerHTML
            } );
    gg.scene2 = new THREE.Scene();
    // var boxGeometry2 = new THREE.BoxGeometry( 500, 500, 500 );
    // gg.mainBoxObject = new THREE.Mesh(boxGeometry2,boxMaterial);
    // gg.scene2.add(gg.mainBoxObject);
    var plane = new THREE.PlaneBufferGeometry( window.innerWidth, window.innerHeight );
    gg.mainBoxObject = new THREE.Mesh( plane, bufferMaterial );
     
    // Move it back so we can see it
    // gg.mainBoxObject.position.z = -10;
    // Add it to the main scene
    gg.scene2.add(gg.mainBoxObject);

    // gg.plane = new THREE.Mesh(
    //     new THREE.PlaneBufferGeometry( 2000, 2000, 8, 8 ),
    //     new THREE.MeshBasicMaterial( { visible: false } )
    // );
    // scene.add( gg.plane );
     gg.faceObj = (new MotionObject(
                 new THREE.TorusKnotGeometry( 30, 15, 10, 20 ),
                 0xa89888)).obj;
    gg.scene.add(gg.faceObj);
                gg.faceObj.visible = false;

    window.addEventListener( 'resize', function ()
        {
            gg.camera.aspect = window.innerWidth / window.innerHeight;
            gg.camera.updateProjectionMatrix();
            gg.renderer.setSize( window.innerWidth, window.innerHeight );
        }, false );
    document.addEventListener("mousedown", 
            function ( event ) {
                event.preventDefault();
                console.log(gg.touch.y);
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

    var self = this;
    this.start = function(){
        var animate2 = null;

        animate2 = function()
            {

                requestAnimationFrame( animate2 );
                self.animate();
            }
        animate2();
    };


    gg.raycaster = new THREE.Raycaster();

}

MotionScene.prototype.constructor = MotionScene



var lastTime = Date.now();
var t = 0;


MotionScene.prototype.animate = function() {
    if(!gg.stop)
    {
        var binSums = [];
        var binCount = [];
        var binAverages = [];
        var numBins = 5;
        for(var i = 0; i < numBins; i++)
        {
            binSums.push(0);
            binCount.push(0);
        }

        var ct = Date.now();
        var dt = ct - lastTime;
        if(gg.anim && gg.anim.obj2 != null)
        {
            gg.anim.update((t - lastTime) / 1000);
            gg.anim.obj2.update((t - lastTime) / 1000);
            console.log('ayyyy');

            // animationTime += delta;
            // gg.anim.state.apply(gg.anim.skeleton, t/1000, true); //* true is for loop
            // gg.anim.skeleton.updateWorldTransform();
        }
        lastTime = ct;
        if(gg.fft != null)
        {
            var spectrum = gg.fft.analyze();
            for (var i = 0; i< spectrum.length; i++){
                var bin = Math.floor(i/spectrum.length*3);
                binSums[bin] += spectrum[i];
                binCount[bin] += 1;
            }

            var bins = []
            for(var i = 0; i < numBins; i++)
            {
                bins.push(binSums[i]/binCount[i]);
            }
            // gg.mesh.rotation.y = Math.PI/2;
    /*         gg.mesh.rotation.x = bins[0]/255 * 3;
            gg.mesh.position.y = gg.fft.getEnergy(100); */
            gg.bins = bins;
        }

        if(gg.bins)
        {
            t += dt * (1 + gg.bins[0]*80)/1600;
        }
        else
        {
            t += dt
        }

        for(var object of gg.objects)
        {
            // object.update();
        }

        if(gg.faceObj)
        {
            gg.faceObj.position.x = gg.touch.x;
            gg.faceObj.position.y = gg.touch.y;

            gg.faceObj.rotation.x += .2;
            gg.faceObj.rotation.y += .13;
            gg.faceObj.rotation.z += .07;
            // gg.faceObj.position.x = 100;
            // gg.faceObj.position.y = 10;
            console.log(gg.faceObj.position.y);
        }

        if(gg.obj)
        {
    /*         gg.faceObj.position.y = -1;
            gg.faceObj.rotation.x = -.3;
            gg.faceObj.rotation.y += .1; */

            gg.obj.obj.position.z = 100;
            gg.obj.obj.position.y = -100;

            gg.container.obj.rotation.x = Math.PI/4*1.5;
            gg.container.obj.position.z = -200;

    //         gg.obj.obj.scale.x = ((gg.bins[0]/255*2 + 1));

    //         gg.obj.obj.rotation.y += .0035;

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

            for(var i = 0; i < gg.objects.length; i++)
            {
                for(var j = 0; j < gg.objects[i].length; j++)
                {
                    var obj = gg.objects[i][j].obj;
                    obj.position.x = i*space - space*(gg.objects.length - 1)/2;
                    obj.position.z = j*space - space*(gg.objects[i].length - 1)/2;
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
                    process(gg.objects[i][j]);
                }
            }
        }
        if(gg.rtt)
        {
            gg.renderer.render( gg.scene, gg.camera, gg.bufferTexture );
            gg.renderer.render( gg.scene2, gg.camera2 );
        }
        else
        {
            gg.renderer.render( gg.scene, gg.camera);
        }
            gg.mesh.position.x += gg.mesh.vx;
            gg.mesh.position.y += gg.mesh.vy;

        if(gg.mousedown)
        {
            gg.acceleration = .8;
            var dx = gg.touch.x - gg.mesh.position.x;
            var dy = gg.touch.y - gg.mesh.position.y;
            var m = Math.sqrt(dx*dx + dy*dy);

            console.log(m);
            if(m < 100)
            {
                dx /= m;
                dy /= m;
                gg.mesh.vx = -dx*10;
                gg.mesh.vy = -dy*10;
                gg.mousedown = false;
            }
            else if (m < Math.sqrt((gg.indicator.size + .01)) + 100)
            {
                dx *= gg.acceleration/(m);
                dy *= gg.acceleration/(m);

                gg.mesh.vx += dx;
                gg.mesh.vy += dy;
            }

            gg.indicator.size += 10000;
            gg.indicator.obj.scale.set(Math.sqrt((gg.indicator.size + .01)),Math.sqrt((gg.indicator.size + .01)),Math.sqrt((gg.indicator.size + .01)));
            gg.indicator.obj.visible = true;
            gg.indicator.obj.position.x = gg.touch.x;
            gg.indicator.obj.position.y = gg.touch.y;
            gg.indicator.obj.opacity = 1/(Math.sqrt((gg.indicator.size + .01)) + 1);
        }
        else
        {
            gg.indicator.obj.visible = false;
        }

        // gg.mesh.vx *= .995;
        // gg.mesh.vy *= .995;

        // gg.mainBoxObject.z -= .1;
    }
}
