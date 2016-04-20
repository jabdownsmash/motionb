function preload(){
  gameGlobals.sound = loadSound('assets/bass1.mp3');
}

function setup(){
    var cnv = createCanvas(100,100);
    // cnv.mouseClicked(togglePlay);
    gameGlobals.fft = new p5.FFT();
    var mic = new p5.AudioIn();
    // gameGlobals.fft.setInput(mic);
    gameGlobals.sound.amp(0.2);
    // togglePlay();

    // start the Audio Input.
    // By default, it does not .connect() (to the computer speakers)
    mic.start();
    mic.connect();
}

function draw(){
    background(0);

    var spectrum = gameGlobals.fft.analyze(); 
    noStroke();
    fill(0,255,0); // spectrum is green
    for (var i = 0; i< spectrum.length; i++){
        var x = map(i, 0, spectrum.length, 0, width);
        var h = -height + map(spectrum[i], 0, 255, height, 0);
        rect(x, height, width / spectrum.length, h )
    }

    var waveform = gameGlobals.fft.waveform();
    noFill();
    beginShape();
    stroke(255,0,0); // waveform is red
    strokeWeight(1);
    for (var i = 0; i< waveform.length; i++){
        var x = map(i, 0, waveform.length, 0, width);
        var y = map( waveform[i], -1, 1, 0, height);
        vertex(x,y);
    }
    endShape();

    text('click to play/pause', 4, 10);
}

// fade gameGlobals.sound if mouse is over canvas
function togglePlay() {
  if (gameGlobals.sound.isPlaying()) {
    gameGlobals.sound.pause();
  } else {
    gameGlobals.sound.loop();
  }
}

init();
animate();
function init() {

    gameGlobals.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    gameGlobals.camera.position.z = 400;
    gameGlobals.scene = new THREE.Scene();

    gameGlobals.mesh = new THREE.Mesh( new THREE.DodecahedronGeometry( 2 , 2),  new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
    // gameGlobals.mesh = new THREE.Mesh( new THREE.DodecahedronGeometry( 2 , 2), new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide } ) );
    gameGlobals.mesh.scale.set(50,50,50);
    gameGlobals.mesh.position.x = -100;
    gameGlobals.scene.add( gameGlobals.mesh );

    gameGlobals.objects = []
    for(var i = 0; i < 1; i++)
    {
        var object = new THREE.Mesh( new THREE.DodecahedronGeometry( 2 , 2), new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide } ) );
        object.position.x = 100;
        object.scale.set(50,50,50);
        gameGlobals.scene.add(object);
        // gameGlobals.push(object);
    }

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    directionalLight.position.set( 0, 1000, 0 );
    gameGlobals.scene.add( directionalLight );
    
    var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    gameGlobals.scene.add( light );

    gameGlobals.renderer = new THREE.WebGLRenderer();
    gameGlobals.renderer.setPixelRatio( window.devicePixelRatio );
    gameGlobals.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( gameGlobals.renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
    gameGlobals.camera.aspect = window.innerWidth / window.innerHeight;
    gameGlobals.camera.updateProjectionMatrix();
    gameGlobals.renderer.setSize( window.innerWidth, window.innerHeight );
}
function animate() {
    requestAnimationFrame( animate );
    var binSums = [];
    var binCount = [];
    var binAverages = [];
    var numBins = 3;
    for(var i = 0; i < numBins; i++)
    {
        binSums.push(0);
        binCount.push(0);
    }
    if(gameGlobals.fft != null)
    {
        var spectrum = gameGlobals.fft.analyze(); 
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
        gameGlobals.mesh.rotation.x = bins[0]/255 * 3;
        gameGlobals.mesh.position.y = gameGlobals.fft.getEnergy(100);
    }
    for(var object of gameGlobals.objects)
    {
        // object.update();
    }
    gameGlobals.renderer.render( gameGlobals.scene, gameGlobals.camera );
}
