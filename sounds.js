// Sound effects manager
class SoundManager {
    constructor() {
        this.sounds = {};
        this.enabled = true;
        this.incomingCallAudio = null;
        
        // Preload sounds
        this.loadSound('message', './sounds/message.mp3');
        this.loadSound('incoming-call', './sounds/incoming-call.mp3');
        this.loadSound('call-connected', './sounds/call-connected.mp3');
        this.loadSound('friend-request', './sounds/friend-request.mp3');
        this.loadSound('call-ended', './sounds/call-ended.mp3'); // Optional
    }

    loadSound(name, url) {
        const audio = new Audio(url);
        audio.preload = 'auto';
        audio.onerror = () => {
            console.warn(`Failed to load sound: ${url}, using fallback`);
        };
        this.sounds[name] = audio;
    }

    // Message notification sound
    playMessageSound() {
        if (!this.enabled) return;
        
        if (this.sounds['message']) {
            const audio = this.sounds['message'].cloneNode();
            audio.volume = 0.5;
            audio.play().catch(e => console.error('Error playing message sound:', e));
        }
    }

    // Incoming call sound (ringtone)
    playIncomingCallSound() {
        if (!this.enabled) return;
        
        this.stopIncomingCallSound(); // Stop previous if playing
        
        if (this.sounds['incoming-call']) {
            this.incomingCallAudio = this.sounds['incoming-call'].cloneNode();
            this.incomingCallAudio.loop = true;
            this.incomingCallAudio.volume = 0.6;
            this.incomingCallAudio.play().catch(e => console.error('Error playing incoming call sound:', e));
        }
    }

    stopIncomingCallSound() {
        if (this.incomingCallAudio) {
            this.incomingCallAudio.pause();
            this.incomingCallAudio.currentTime = 0;
            this.incomingCallAudio = null;
        }
    }

    // Call connected sound
    playCallConnectedSound() {
        if (!this.enabled) return;
        
        if (this.sounds['call-connected']) {
            const audio = this.sounds['call-connected'].cloneNode();
            audio.volume = 0.5;
            audio.play().catch(e => console.error('Error playing call connected sound:', e));
        }
    }

    // Friend request sound
    playFriendRequestSound() {
        if (!this.enabled) return;
        
        if (this.sounds['friend-request']) {
            const audio = this.sounds['friend-request'].cloneNode();
            audio.volume = 0.5;
            audio.play().catch(e => console.error('Error playing friend request sound:', e));
        }
    }

    // Call ended sound (optional)
    playCallEndedSound() {
        if (!this.enabled) return;
        
        if (this.sounds['call-ended']) {
            const audio = this.sounds['call-ended'].cloneNode();
            audio.volume = 0.5;
            audio.play().catch(e => console.error('Error playing call ended sound:', e));
        }
    }

    toggleSound() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}

// Export singleton instance
const soundManager = new SoundManager();
