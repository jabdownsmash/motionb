var generators =
    {
        generateSpine : function (settings)
            {
                obj = new SpineAnimation(settings.spineName, settings.dir, 1);
                // gg.scene.add(obj);
                obj.addEventListener(SpineAnimation.SKELETON_DATA_LOADED, function () {
                    for( var i = 0; i < settings.mixes; i++ )
                    {
                        obj.stateData.setMixByName(settings.mixes[i].from,settings.mixes[i].to,from.settings.mixes[i].amount);
                    }

                    obj.state.setAnimationByName(0, settings.startAnimation || "default", true);

                    // obj.stateData.setMixByName('walk', 'jump', 0.2);
                    // obj.stateData.setMixByName('run', 'jump', 0.2);
                    // obj.stateData.setMixByName('jump', 'run', 0.2);
                    // obj.state.setAnimationByName(0, 'walk', true);
                });

                return obj;
            },
    };