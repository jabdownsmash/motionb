var generators =
    {
        generateMTLMesh : function(settings, cb)
            {
                 var onProgress = function ( xhr ) {
                    if ( xhr.lengthComputable ) {
                        var percentComplete = xhr.loaded / xhr.total * 100;
                        console.log( Math.round(percentComplete, 2) + '% downloaded' );
                    }
                };
                var onError = function ( xhr ) { };
                THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
                var mtlLoader = new THREE.MTLLoader();
                mtlLoader.setBaseUrl( settings.path );
                mtlLoader.setPath( settings.path );
                mtlLoader.load( settings.mtlFilename, function( materials ) {
                    materials.preload();
                    var objLoader = new THREE.OBJLoader();
                    objLoader.setMaterials( materials );
                    objLoader.setPath( settings.path );
                    objLoader.load( settings.objFilename, cb, onProgress, onError );
                }); 
            },

        generateSpine : function (settings)
            {
                var obj = new SpineAnimation(settings.spineName, settings.dir, 1);
                obj.settings = settings;

                obj.addEventListener(SpineAnimation.SKELETON_DATA_LOADED, function () {
                    // for( var i = 0; i < settings.mixes; i++ )
                    // {
                    //     obj.stateData.setMixByName(settings.mixes[i].from,settings.mixes[i].to,from.settings.mixes[i].amount);
                    // }
                    
                    obj.stateData.setMixByName('walk', 'jump', 0.2);
                    obj.stateData.setMixByName('run', 'jump', 0.2);
                    obj.stateData.setMixByName('jump', 'run', 0.2);
                    obj.state.setAnimationByName(0, 'walk', true);

                    var obj2 = new SpineAnimation(settings.spineName, settings.dir, 1);
                    obj2.scale.x = -1;
                    obj2.spineMirror = true;
                    obj2.settings = settings;

                    obj.obj2 = obj2;
                    obj.add(obj2);

                    obj2.addEventListener(SpineAnimation.SKELETON_DATA_LOADED, function () {
                        for( var i = 0; i < settings.mixes; i++ )
                        {
                            obj2.stateData.setMixByName(settings.mixes[i].from,settings.mixes[i].to,from.settings.mixes[i].amount);
                        }

                        // obj.state.setAnimationByName(0, settings.startAnimation || "default", true);
                        obj2.state.setAnimationByName(0, settings.startAnimation || "default", true);
                        document.onmousedown = function () {
                            obj.state.setAnimationByName(0, 'jump', false);
                            obj.state.addAnimationByName(0, 'run', true, 0);
                            obj2.state.setAnimationByName(0, 'jump', false);
                            obj2.state.addAnimationByName(0, 'run', true, 0);
                        }
                    });
                });

                return obj;
            },


        /**

          Says hello to the user.
          @param string user The user you want to great
          @return void
        */

        generateTree : function (s)
            {
                // var obj = new MotionObject(new THREE.CylinderGeometry( s.radius, s.radius, s.sectionLength), s.color);
                var obj2 = this.generateBranch(s,s.numSections)
                // obj.obj.add(obj2.obj);
                // obj.obj.rotation.x = 2;
                // obj.obj.position.y = -80;
                // obj2.obj.position.y = 50;
                // obj2.obj.rotation.z += .2;
                return obj2;
            },

        generateBranch : function (s, level)
            {
                level = Math.max(0,level)
                var current = (1 - level/s.numSections)
                var next = (1 - (level + 1)/s.numSections)

                var radius = (s.last.radius - s.radius)
                var length = (s.last.length - s.length)
                var random = (s.last.branch - s.branch)
                var branch = {
                    radius : s.radius + current*radius,
                    length : s.length + current*length,
                    random : s.branch + current*random,
                    next : {
                        radius : s.radius + next*radius,
                        length : s.length + next*length,
                        random : s.branch + next*random,
                    },
                }
                var obj = new MotionObject(new THREE.CylinderGeometry( branch.radius, branch.next.radius, branch.length, 10), s.color);
                if(level > 0)
                {
                    var obj2 = this.generateBranch(s,level - 1);
                    obj2.obj.position.y = branch.length;

                    var obj5 = new MotionContainer();
                    if(s.curve)
                    {
    //                     obj5.obj.rotation.z += Math.PI/8 + .01*Math.PI/8;
                        obj5.obj.rotation.z += s.curve.base + Math.random()*s.curve.random;
                    }
                    obj5.obj.rotation.y += Math.random()*Math.PI*2;
                    obj5.add(obj2);
                    obj.obj.add(obj5.obj);
                    obj.child = obj2;

//                     while(Math.random() > branch.random)
                    for(var i = 0, ii = Math.floor(branch.random); i < ii; i++)
                    {
                        var obj3 = new MotionContainer();
//                         obj3.obj.rotation.z += Math.PI/8 + 3*Math.PI/8;
                        obj3.obj.rotation.z += Math.PI/8;
                        // obj3.obj.rotation.z += Math.PI/8 + Math.random()*Math.PI/8;
                        obj3.obj.rotation.y += Math.random()*Math.PI*2;

                        var obj4 = this.generateBranch(s,level - 1);
                        obj4.obj.position.y = branch.length/2;
                        obj3.add(obj4);

                        obj.obj.add(obj3.obj);

                        obj.branch = obj4;
                    }

                }

/*                 var obj2 = new MotionContainer();

                obj.obj.position.y = branch.length/2;
                obj2.add(obj);
                return obj2; */
                return obj;
            },

        // generateLeafBranch : function (s)
        //     {

        //     },
    };
