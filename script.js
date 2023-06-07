var audioPaths = [
    'csgo sfx/ak47_01.wav', //replace for CS2
    'csgo sfx/aug_01.wav',
    'csgo sfx/awp_01.wav',
    'csgo sfx/bizon_01.wav',
    'csgo sfx/butterfly_knife.wav',
    'csgo sfx/c4_initiate.wav',
    'csgo sfx/cz75_01.wav',
    'csgo sfx/deagle_01.wav',
    'csgo sfx/elites_01.wav.wav',
    'csgo sfx/famas_01.wav', //replace for CS2
    'csgo sfx/fiveseven_01.wav',
    'csgo sfx/flashbang_explode1.wav',
    'csgo sfx/g3sg1_01.wav',
    'csgo sfx/galil_01.wav',
    'csgo sfx/glock_01.wav',
    'csgo sfx/knife_bowie_draw.wav',
    'csgo sfx/knife_falchion_draw.wav',
    'csgo sfx/m4a1_silencer_01.wav',
    'csgo sfx/m4a4_01.wav',
    'csgo sfx/m249-1.wav',
    'csgo sfx/mac10_01.wav',
    'csgo sfx/mag7_01.wav',
    'csgo sfx/mp5_01.wav',
    'csgo sfx/mp7_01.wav',
    'csgo sfx/mp9_01.wav',
    'csgo sfx/negev_01.wav',
    'csgo sfx/nova-1.wav',
    'csgo sfx/p90_01.wav',
    'csgo sfx/p250_01.wav',
    'csgo sfx/revolver-1_01.wav',
    'csgo sfx/sawedoff-1.wav',
    'csgo sfx/scar20_01.wav',
    'csgo sfx/sg556_01.wav',
    'csgo sfx/ssg08_01.wav',
    'csgo sfx/stilletto_draw_01.wav',
    'csgo sfx/taser_shoot.wav',
    'csgo sfx/tec9_02.wav',
    'csgo sfx/ump45_02.wav',
    'csgo sfx/usp_01.wav',
    'csgo sfx/xm1014-1.wav'

    // Add more audio paths as needed
];

var selectedSound = getRandomAudio();
var isGuessingMode = false;
var audioContext = new (window.AudioContext || window.webkitAudioContext)();
var analyser = audioContext.createAnalyser();
analyser.fftSize = 2048;

var canvas = document.getElementById('visualizer');
var canvasCtx = canvas.getContext('2d');

var audioElement = new Audio(selectedSound);
var audioSource = audioContext.createMediaElementSource(audioElement);
audioSource.connect(analyser);
audioSource.connect(audioContext.destination);

var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);

function playSound() {
    if (!isGuessingMode) {
        audioElement = new Audio(selectedSound);
        audioSource = audioContext.createMediaElementSource(audioElement);
        audioSource.connect(analyser);
        audioSource.connect(audioContext.destination);
        audioElement.play();
        requestAnimationFrame(drawVisualizer);
    }
}

function checkSelection() {
    var selectElement = document.getElementById('sound-select');
    var incorrect = document.getElementById('incorrect');
    incorrect.style.visibility = 'hidden';
}

function confirmGuess() {
    var selectElement = document.getElementById('sound-select');
    var checkmark = document.getElementById('checkmark');
    var incorrect = document.getElementById('incorrect');

    if (selectElement.value === selectedSound) {
        checkmark.style.visibility = 'visible';
        incorrect.style.visibility = 'hidden';

        // Reset the dropdown menu
        selectElement.value = '';

        // Disable guess button and enable next button
        var guessButton = document.getElementsByClassName('guess-button')[0];
        guessButton.disabled = true;

        var nextButton = document.getElementsByClassName('next-button')[0];
        nextButton.style.display = 'inline-block';

        // Display success message
        var message = document.getElementById('message');

    } else {
        checkmark.style.visibility = 'hidden';
        incorrect.style.visibility = 'visible';
    }
}

function nextQuestion() {
    // Enable guess button and disable next button
    var guessButton = document.getElementsByClassName('guess-button')[0];
    guessButton.disabled = false;

    var nextButton = document.getElementsByClassName('next-button')[0];
    nextButton.style.display = 'none';

    // Generate a new random audio for the next round
    selectedSound = getRandomAudio();

    // Clear the checkmark, incorrect symbol, and message
    var checkmark = document.getElementById('checkmark');
    var incorrect = document.getElementById('incorrect');
    var message = document.getElementById('message');

    checkmark.style.visibility = 'hidden';
    incorrect.style.visibility = 'hidden';
    message.innerHTML = '';

    // Play the new audio
    playSound();
}

function getRandomAudio() {
    var randomIndex = Math.floor(Math.random() * audioPaths.length);
    return audioPaths[randomIndex];
}

function drawVisualizer() {
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(255, 255, 255)';
    canvasCtx.beginPath();

    var sliceWidth = canvas.width * 1.0 / bufferLength;
    var x = 0;

    for (var i = 0; i < bufferLength; i++) {
        var v = dataArray[i] / 128.0;
        var y = v * canvas.height / 2;

        if (i === 0) {
            canvasCtx.moveTo(x, y);
        } else {
            canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();

    requestAnimationFrame(drawVisualizer);
}