var generators =
    {
        generateSpine : function (settings)
            {
                obj = new SpineAnimation(settings.spineName, settings.dir, 1);
                obj.settings = settings;

                obj.addEventListener(SpineAnimation.SKELETON_DATA_LOADED, function () {
                    for( var i = 0; i < settings.mixes; i++ )
                    {
                        obj.stateData.setMixByName(settings.mixes[i].from,settings.mixes[i].to,from.settings.mixes[i].amount);
                    }

                    
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

                        obj.state.setAnimationByName(0, settings.startAnimation || "default", true);
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
    };