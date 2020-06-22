const video = document.querySelector("video");
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const debounceHelperFunc = (callback, delay = 500) => {
	let timeOutId;
	// It returns a function which serves as a shield or better still, a wrapper around the function
	return (...args) => {
		// If timeout is defined as in if time out has a value, clear the time out.
		// This if statment prevents the function from saerching the aPI because it'll have cleared the interval 
		// before 1000 milliseconds
		if (timeOutId) {
			clearTimeout(timeOutId);
		}
		timeOutId = setTimeout(() => {
			callback.apply(null, args);
		}, delay);
	};
}

class Player {
	constructor(sounds) {
		this.sounds = sounds;
		this.index = 0;
	}

	pickSound (files) {
		return files[Math.floor(Math.random() * files.length)];
	}
 
	async playSound () {

		const soundIndex = this.index;
		const soundFile = this.sounds[soundIndex];
		let sound;

		// If the sound has been loaded up use it
		if(soundFile.howl) {
			this.sound = soundFile.howl;
		} // Else load up a new sound
		else {
			try {
				this.sound = new Audio(`./audio/${soundFile.file}.mp3`);
				const playPromise = await this.sound.play();
			} catch (err) {
				// Show DOM to prevent playing
				console.log(err);
			}
			soundFile.howl = this.sound;
		}
	}

	async stopSound () {
		// await this.sound.pause();
		this.sound.src = '';
		this.sound.currentTime = 0;
	}

	async isPlaying () {
		return this.sound
	        && this.currentTime > 0
	        && !this.sound.paused
	        && !this.sound.ended
	        && this.sound.readyState > 2;
	}
}

tracking.initUserMedia_ = async () => {
	let stream = null;

	try {
		stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
		video.srcObject = stream;
	}
	catch(err) {
		console.log(err);
	}
}

const startTracking = async (event) => {

	if (event.length === 0) {

	    // No objects were detected in this frame.
	    console.log(`Put your face in the frame`); 

		if (soundPlayer.isPlaying() === false) {
			soundPlayer.stopSound();	
  	} else {

	    event.forEach( async (rect) => {
	    	soundPlayer.playSound();

	        context.strokeStyle = '#fff';
	        context.strokeRect(rect.x, rect.y, rect.width, rect.height);
	    });
  	}
}

const soundPlayer = new Player ([

	{
	    title: 'Rave Digger',
	    file: 'rave_digger',
	    howl: null
  	},
  	{
	    title: '80s Vibe',
	    file: '80s_vibe',
	    howl: null
  	},
  	{
	    title: 'Running Out',
	    file: 'running_out',
	    howl: null
  	}
]);

const  tracker = new tracking.ObjectTracker(['face', 'eye', 'mouth']);
tracker.setInitialScale(4);
tracker.setStepSize(2);
tracker.setEdgesDensity(0.1);

tracking.track('#video', tracker, { camera: true });


tracker.on('track', (event) => {
	context.clearRect(0, 0, canvas.width, canvas.height);
	debounceHelperFunc(startTracking(event.data), 5000);
})
