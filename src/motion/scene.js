
MotionScene = function()
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
                // var cnv = createCanvas(100,100);
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


    gg.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    gg.camera.position.y = 40;
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

     var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    gg.scene.add( light ); 

    // var colora = 0x439E65;
    // var colorb = 0xCDF9AD;
    var colora =  Math.floor(0xffffff*Math.random());
    var colorb =  Math.floor(0xffffff*Math.random());
    gg.scene.fog = new THREE.FogExp2( colora, 0.0035); //p1

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

    gg.mesh = new THREE.Mesh( new THREE.DodecahedronGeometry( 2 , 2),  new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
    // gg.mesh = new THREE.Mesh( new THREE.DodecahedronGeometry( 2 , 2), new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide } ) );
    gg.mesh.scale.set(50,50,50);
    gg.mesh.position.x = -100;
    gg.scene.add( gg.mesh );

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
            object.scale.set(500,500,500);
            gg.faceObj = object;
        });

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

    window.addEventListener( 'resize', function ()
        {
            gg.camera.aspect = window.innerWidth / window.innerHeight;
            gg.camera.updateProjectionMatrix();
            gg.renderer.setSize( window.innerWidth, window.innerHeight );
        }, false );
    document.addEventListener("mousedown", function(){},false);

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
        if(gg.obj)
        {
    /*         gg.faceObj.position.y = -1;
            gg.faceObj.rotation.x = -.3;
            gg.faceObj.rotation.y += .1; */

            gg.obj.obj.position.z = 100;
            gg.obj.obj.position.y = -100;

            gg.container.obj.rotation.x = Math.PI/4*1.5;
            gg.container.obj.position.z = -100;

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
        // gg.mainBoxObject.z -= .1;
    }
}
