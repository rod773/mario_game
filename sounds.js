class SoundManager {
    constructor() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
        this.isPlayingMusic = false;
        
        // Classic Mario theme first phrase (simplified frequencies)
        // E5 E5 E5 C5 E5 G5 G4
        this.melody = [
            659.25, 659.25, 0, 659.25, 0, 523.25, 659.25, 0,
            783.99, 0, 0, 0, 392.00, 0, 0, 0
        ];
        this.noteLength = 0.15;
    }

    playTone(freq, type, duration, vol=0.1) {
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
        
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
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
        
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
    }

    playStomp() {
        this.playTone(150, 'square', 0.15, 0.05);
    }
    
    playBump() {
        this.playTone(100, 'square', 0.1, 0.05);
    }

    playGameOver() {
        this.stopMusic();
        if(this.ctx.state === 'suspended') this.ctx.resume();
        // Play descending notes
        const notes = [400, 350, 300, 250];
        notes.forEach((freq, i) => {
            setTimeout(() => {
                this.playTone(freq, 'square', 0.3, 0.05);
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
            
            gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
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
