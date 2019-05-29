var OpenSurf = {

    Json: [],
    Player: false,

    Spot: {
        Load: function(id) {

            spotData = OpenSurf.Json[id];

            switch (spotData.source.type) {

                case 'streaming':
                    OpenSurf.Streaming.Load(spotData.source.content);
                    break;

                case 'youtube':
                    OpenSurf.YouTube.Load(spotData.source.content);
                    break;
            }

            $('.camera .card-title').text(spotData.title);
            $('.wave iframe').attr('src', spotData.wave);
            $('.wind iframe').attr('src', spotData.wind);
            $('.location iframe').attr('src', spotData.location);
        }
    },

    Streaming:  {
        Load: function(url) {

            if (OpenSurf.Player) {
                OpenSurf.Player.destroy();
            }

            OpenSurf.Player = new Clappr.Player({
                source: url,
                parentId: "#camera",
                watermark: '',
                watermarkLink: '',
                width: 'auto',
                height: '100%',
                plugins: {
                    playback: [RTMP]
                },
                rtmpConfig: {
                    bufferTime: 1,
                    startLevel: 0,
                    switchRules: {
                        SufficientBandwidthRule: {
                            bandwidthSafetyMultiple: 1.15,
                            minDroppedFps: 2
                        },
                        InsufficientBufferRule: {
                            minBufferLength: 2
                        },
                        DroppedFramesRule: {
                            downSwitchByOne: 10,
                            downSwitchByTwo: 20,
                            downSwitchToZero: 24
                        },
                        InsufficientBandwidthRule: {
                            bitrateMultiplier: 1.15
                        }
                    }
                },
            });

            OpenSurf.Player.play();
        }
    },

    YouTube: {
        Load: function (code) {

            if (OpenSurf.Player) {
                OpenSurf.Player.destroy();
            }

            OpenSurf.Player = new Clappr.Player({
                watermark: '',
                watermarkLink: '',
                width: 'auto',
                height: '100%',
                sources: [code],
                poster: 'https://i.ytimg.com/vi/'+code+'/hqdefault.jpg',
                parentId: '#camera',
                plugins: {
                    playback: [YoutubePlayback]
                }
            });

            OpenSurf.Player.play();
        }
    }
}

$(document).ready(function() {

    $.get('assets/json/opensurf.json', function(data) {

        OpenSurf.Json = data;

        $.each(data, function(idx, data){

            item = $('.spot-menu a').first().clone();
            item.removeClass('d-none');
            item.text(data.title);

            item.click(function(){
                OpenSurf.Spot.Load(idx);
            });

            $('.spot-menu').append(item);
        });
    });
});