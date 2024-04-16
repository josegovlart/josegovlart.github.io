window.onload = () => {
  if (!('mediaDevices' in navigator) || !('getUserMedia' in navigator.mediaDevices)) return;

  console.log('mediaDevices is available!');

  const allow = (mic, cam) => {
    if (!mic && !cam) return;

    if (mic && cam) {
      console.log('Trying to use microphone and camera.');
    } else if (mic) {          
      console.log('Trying to use microphone.');
    } else if (cam) {
      console.log('Trying to use camera.');
    }

    navigator.mediaDevices.getUserMedia({audio:mic, video: cam})
      .catch(err => {
        console.log('error on accessing mic:' + mic + ' and cam: ' + cam);
        console.error(err);
      });
  };

  document.getElementById('cam').addEventListener("click", () => allow(false, true));
  document.getElementById('mic').addEventListener("click", () => allow(true, false));
  document.getElementById('miccam').addEventListener("click", () => allow(true, true));
};
