
MotionScene = function(settings)
{
    var width = settings.width || window.innerWidth;
    var height = settings.height || window.innerHeight;

    if(settings.orthographic)
    {
        gg.camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 6000 );
    }
    else
    {
        gg.camera = new THREE.PerspectiveCamera( 70, width / height, 1, 1000 );
    }

    gg.camera.position.z = 280;

    gg.spikes = [];

    gg.camera2 = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
    gg.camera2.position.z = 2;
    gg.scene = new THREE.Scene();

    var canvas = document.getElementById("canvas");
    var cw = canvas.width;
    var ch = canvas.height;
    gg.renderer = new THREE.WebGLRenderer({ canvas: canvas });
    gg.renderer.setPixelRatio( window.devicePixelRatio );
    gg.renderer.setSize( cw, ch );

    // document.body.appendChild( gg.renderer.domElement );

    gg.objects = []

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

    // window.addEventListener( 'resize', function ()
    //     {
    //         gg.camera.aspect = window.innerWidth / window.innerHeight;
    //         gg.camera.updateProjectionMatrix();
    //         gg.renderer.setSize( window.innerWidth, window.innerHeight );
    //     }, false );

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



// var lastTime = Date.now();
// var t = 0;

MotionScene.prototype.reset = function()
{
    gg.doReset = true;
}

MotionScene.prototype.trueReset = function()
{
    this.onReset();
    var toRemove = [];
    for(var i = 0; i < gg.objects.length; i++)
    {
        var object = gg.objects[i];
        if(object.onReset != null)
        { 
            if(object.onReset())
            {
                toRemove.push(i);
            }
        }
    }
    for(var i = toRemove.length - 1; i >= 0; i--)
    {
        gg.objects.splice(toRemove[i], 1);
    }
    this.postReset();
}

MotionScene.prototype.onReset = function() {

}

MotionScene.prototype.postReset = function() {

}

MotionScene.prototype.animate = function() {
    if(!gg.stop)
    {

        var ct = Date.now();
        var dt = ct;

        gg.currentTime = ct;

        var toRemove = [];
        for(var i = 0; i < gg.objects.length; i++)
        {
            var object = gg.objects[i];
            if(object.update != null)
            { 
                if(object.update(dt))
                {
                    toRemove.push(i);
                }
            }
        }
        for(var i = toRemove.length - 1; i >= 0; i--)
        {
            gg.objects.splice(toRemove[i], 1);
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

        if(gg.doReset)
        {
            this.trueReset();
            gg.doReset = false;
        }
    }
}
