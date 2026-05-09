class SoundManager {
    constructor() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
        this.isPlayingMusic = false;
        
        // Note Frequencies
        const G4=392.00, Ab4=415.30, A4=440.00, Bb4=466.16, B4=493.88;
        const C5=523.25, D5=587.33, Eb5=622.25, E5=659.25, F5=698.46, Gb5=739.99, G5=783.99, A5=880.00, B5=987.77;
        const C6=1046.50;
        const E4=329.63;

        // Complete Classic Mario Overworld Theme (Simplified to single channel)
        this.melody = [
            // Intro
            E5, E5, 0, E5, 0, C5, E5, 0, G5, 0, 0, 0, G4, 0, 0, 0,
            
            // Part 1
            C5, 0, 0, G4, 0, 0, E4, 0, 0, A4, 0, B4, 0, Bb4, A4, 0,
            G4, E5, G5, A5, 0, F5, G5, 0, E5, 0, C5, D5, B4, 0, 0, 0,
            
            C5, 0, 0, G4, 0, 0, E4, 0, 0, A4, 0, B4, 0, Bb4, A4, 0,
            G4, E5, G5, A5, 0, F5, G5, 0, E5, 0, C5, D5, B4, 0, 0, 0,

            // Part 2
            0, 0, G5, Gb5, F5, Eb5, 0, E5, 0, Ab4, A4, C5, 0, A4, C5, D5,
            0, 0, G5, Gb5, F5, Eb5, 0, E5, 0, C6, 0, C6, C6, 0, 0, 0,
            0, 0, G5, Gb5, F5, Eb5, 0, E5, 0, Ab4, A4, C5, 0, A4, C5, D5,
            0, 0, Eb5, 0, 0, D5, 0, 0, C5, 0, 0, 0, 0, 0, 0, 0
        ];
        this.noteLength = 0.15;
    }

    playTone(freq, type, duration, vol=0.5) {
        if(this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playJump() {
        if(this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        
        osc.frequency.setValueAtTime(400, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
    }

    playCoin() {
        if(this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        
        osc.frequency.setValueAtTime(987.77, this.ctx.currentTime); // B5
        osc.frequency.setValueAtTime(1318.51, this.ctx.currentTime + 0.08); // E6
        
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
    }

    playStomp() {
        this.playTone(150, 'square', 0.15, 0.3);
    }
    
    playBump() {
        this.playTone(100, 'square', 0.1, 0.3);
    }

    playPowerup() {
        if(this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(300, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(800, this.ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.4);
    }

    playPowerdown() {
        if(this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(300, this.ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.4);
    }

    playGameOver() {
        this.stopMusic();
        if(this.ctx.state === 'suspended') this.ctx.resume();
        // Play descending notes
        const notes = [400, 350, 300, 250];
        notes.forEach((freq, i) => {
            setTimeout(() => {
                this.playTone(freq, 'square', 0.3, 0.3);
            }, i * 300);
        });
    }

    playMusic() {
        if (this.isPlayingMusic) return;
        if(this.ctx.state === 'suspended') this.ctx.resume();
        this.isPlayingMusic = true;
        this.playMelodyStep(0);
    }
    
    stopMusic() {
        this.isPlayingMusic = false;
    }

    playMelodyStep(index) {
        if (!this.isPlayingMusic) return;
        
        const freq = this.melody[index];
        if (freq > 0) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.value = freq;
            
            gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + this.noteLength * 0.9);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + this.noteLength);
        }
        
        setTimeout(() => {
            this.playMelodyStep((index + 1) % this.melody.length);
        }, this.noteLength * 1000);
    }
}
