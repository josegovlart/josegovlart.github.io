window.onload = () => {
  if (!('mediaDevices' in navigator) || !('getUserMedia' in navigator.mediaDevices)) return;

  console.log('mediaDevices is available!');

  const getAvailableDevices = () => {
    const deviceList = document.getElementById("device-list");
    console.log('antes return');
    return navigator.mediaDevices.enumerateDevices()
      .then((devices) => {
        console.log('.then');
        devices.forEach((device) => {
          deviceList.innerHTML += `<li>${device.kind}: ${device.label} id = ${device.deviceId}</li>`;
          console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
        });
      })
      .catch((err) => {
        console.error(`${err.name}: ${err.message}`);
      });
  };
  
  const handleSuccess = (stream) => {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    const canvas = document.getElementById('waveformCanvas');
    const ctx = canvas.getContext('2d');

    source.connect(analyser);

    // Set up the drawing parameters
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Draw the waveform
    function draw() {
        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;

        analyser.getByteTimeDomainData(dataArray);

        ctx.fillStyle = 'rgb(200, 200, 200)';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgb(0, 0, 0)';

        ctx.beginPath();

        const sliceWidth = WIDTH * 1.0 / bufferLength;
        let x = 0;

        for(let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = v * HEIGHT/2;

            if(i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        ctx.lineTo(canvas.width, canvas.height/2);
        ctx.stroke();

        requestAnimationFrame(draw);
    }

    draw();
  };

  const allow = async (mic, cam) => {
    if (!mic && !cam) return;

    if (mic && cam) {
      console.log('Trying to use microphone and camera.');
    } else if (mic) {          
      console.log('Trying to use microphone.');
    } else if (cam) {
      console.log('Trying to use camera.');
    }
    console.log('before await');
    await getAvailableDevices();
    console.log('after await');

    const constraints = { audio:mic, video: cam };
    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        if (constraints.video) {
          const video = document.getElementById('videoElement');
          video.srcObject = stream
        }

        if (constraints.audio) {
          handleSuccess(stream);
        }
        console.log('Success on using getUserMedia', constraints);
      })
      .catch(err => {
        console.log('error on accessing mic:' + mic + ' and cam: ' + cam);
        console.error(err);
      });
  };

  document.getElementById('cam').addEventListener("click", () => allow(false, true));
  document.getElementById('mic').addEventListener("click", () => allow(true, false));
  document.getElementById('miccam').addEventListener("click", () => allow(true, true));
  document.getElementById('refresh').addEventListener("click", () => window.location.reload());
};
