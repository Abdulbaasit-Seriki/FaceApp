const video = document.querySelector("video");
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

tracking.initUserMedia_ =  () => {
	navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  	.then(stream => video.srcObject = stream)
  	.catch(e => console.log(e.name + ": "+ e.message));
}

const  tracker = new tracking.ObjectTracker(['face', 'eye', 'mouth']);
tracker.setInitialScale(4);
tracker.setStepSize(2);
tracker.setEdgesDensity(0.1);

tracking.track('#video', tracker, { camera: true });

tracker.on('track', (event) => {

  context.clearRect(0, 0, canvas.width, canvas.height);

  if (event.data.length === 0) {
    // No objects were detected in this frame.
    console.log(`Put your face in the frame`)
  } else {
    event.data.forEach( (rect) => {
      console.log(rect)
      context.strokeStyle = '#a64ceb';
      context.strokeRect(rect.x, rect.y, rect.width, rect.height);
      context.font = '11px Helvetica';
      context.fillStyle = "#fff";
      context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
      context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
    });
  }

});

