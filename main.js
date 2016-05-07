function preload(){
  gg.sound = loadSound('assets/bass1.mp3');
}

function setup(){
    var cnv = createCanvas(100,100);
    // cnv.mouseClicked(togglePlay);
    gg.fft = new p5.FFT();
    var mic = new p5.AudioIn();
    // gg.fft.setInput(mic);
    gg.sound.amp(0.2);
    // togglePlay();

    // start the Audio Input.
    // By default, it does not .connect() (to the computer speakers)
    // mic.start();
    // mic.connect();
}

// fade gg.sound if mouse is over canvas
function togglePlay() {
  if (gg.sound.isPlaying()) {
    gg.sound.pause();
  } else {
    gg.sound.loop();
  }
}

init();
animate();
function init() {

    gg.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    gg.camera.position.z = 400;
    gg.scene = new THREE.Scene();

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    directionalLight.position.set( 0, 1000, 0 );
    gg.scene.add( directionalLight );
    
    var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    gg.scene.add( light );
    // gg.scene.fog = new THREE.FogExp2( 0x4459cc, 0.0035); //p1

    gg.renderer = new THREE.WebGLRenderer();
    gg.renderer.setPixelRatio( window.devicePixelRatio );
    gg.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( gg.renderer.domElement );

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


    gg.mesh = new THREE.Mesh( new THREE.DodecahedronGeometry( 2 , 2),  new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
    // gg.mesh = new THREE.Mesh( new THREE.DodecahedronGeometry( 2 , 2), new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide } ) );
    gg.mesh.scale.set(50,50,50);
    gg.mesh.position.x = -100;
    // gg.scene.add( gg.mesh );

    gg.objects = []
    for(var i = 0; i < 1; i++)
    {
        var object = new THREE.Mesh( new THREE.DodecahedronGeometry( 2 , 2), new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide } ) );
        object.position.x = 100;
        object.scale.set(50,50,50);
        object.geometry.computeVertexNormals();
        // gg.scene.add(object);
        // gg.push(object);

        gg.obj = new MotionObject(new THREE.DodecahedronGeometry( 2 , 2), 0xcc4459);
        gg.obj.obj.geometry.computeVertexNormals();
        gg.scene.add(gg.obj.obj);
    }

    gg.anim = generators.generateSpine(spineData,false);

    gg.anim.position.y = -200;
    gg.anim.position.z = -150;
    // gg.scene.add(gg.anim);

    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round(percentComplete, 2) + '% downloaded' );
        }
    };
    var onError = function ( xhr ) { };
    THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setBaseUrl( 'assets/obj/' );
    mtlLoader.setPath( 'assets/obj/' );
    mtlLoader.load( 'model_mesh.obj.mtl', function( materials ) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.setPath( 'assets/obj/' );
        objLoader.load( 'model_mesh.obj', function ( object ) {
            // object.position.y = - 95;
            // gg.scene.add( object );
            object.scale.set(500,500,500);
            gg.faceObj = object;
        }, onProgress, onError );
    });
    
        // anim.state.setAnimationByName(0, 'jump', false);
        // anim.state.addAnimationByName(0, 'run', true, 0);

    window.addEventListener( 'resize', onWindowResize, false );
    document.addEventListener("mousedown", function(){},false);
}
function onWindowResize() {
    gg.camera.aspect = window.innerWidth / window.innerHeight;
    gg.camera.updateProjectionMatrix();
    gg.renderer.setSize( window.innerWidth, window.innerHeight );
}

var lastTime = Date.now();
function animate() {
    requestAnimationFrame( animate );
    var binSums = [];
    var binCount = [];
    var binAverages = [];
    var numBins = 5;
    for(var i = 0; i < numBins; i++)
    {
        binSums.push(0);
        binCount.push(0);
    }

    var t = Date.now();
        
    if(gg.anim.obj2 != null)
    {
        gg.anim.update((t - lastTime) / 1000);
        gg.anim.obj2.update((t - lastTime) / 1000);

        // animationTime += delta;
        // gg.anim.state.apply(gg.anim.skeleton, t/1000, true); //* true is for loop
        // gg.anim.skeleton.updateWorldTransform();
    }
    lastTime = t;
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
        gg.mesh.rotation.x = bins[0]/255 * 3;
        gg.mesh.position.y = gg.fft.getEnergy(100);
        gg.bins = bins;
    }
    for(var object of gg.objects)
    {
        // object.update();
    }
    if(gg.faceObj)
    {
        gg.faceObj.position.y = -10;
        gg.faceObj.rotation.x = -.3;
        gg.faceObj.rotation.y += .1;
        gg.obj.obj.rotation.y += .01;
    }
    gg.renderer.render( gg.scene, gg.camera );
}
