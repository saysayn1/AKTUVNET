// Voice Message Recorder
class VoiceRecorder {
    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.isRecording = false;
        this.startTime = null;
        this.timerInterval = null;
    }

    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];
            
            this.mediaRecorder.ondataavailable = (event) => {
                this.audioChunks.push(event.data);
            };
            
            this.mediaRecorder.onstop = () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
                this.onRecordingComplete(audioBlob);
                
                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };
            
            this.mediaRecorder.start();
            this.isRecording = true;
            this.startTime = Date.now();
            
            // Update UI
            const recordBtn = document.getElementById('voiceRecordBtn');
            const recordingIndicator = document.getElementById('voiceRecordingIndicator');
            const messageInputWrapper = document.querySelector('.message-input-wrapper');
            
            recordBtn.classList.add('recording');
            recordingIndicator.style.display = 'flex';
            messageInputWrapper.style.display = 'none';
            
            // Start timer
            this.startTimer();
            
            return true;
        } catch (error) {
            console.error('Error starting recording:', error);
            alert('Failed to access microphone. Please check permissions.');
            return false;
        }
    }

    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            this.stopTimer();
            this.resetUI();
        }
    }

    cancelRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            this.audioChunks = [];
            this.stopTimer();
            this.resetUI();
        }
    }

    startTimer() {
        const timeDisplay = document.querySelector('.recording-time');
        this.timerInterval = setInterval(() => {
            const elapsed = Date.now() - this.startTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Auto-stop after 5 minutes
            if (elapsed >= 300000) {
                this.stopRecording();
            }
        }, 100);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    resetUI() {
        const recordBtn = document.getElementById('voiceRecordBtn');
        const recordingIndicator = document.getElementById('voiceRecordingIndicator');
        const messageInputWrapper = document.querySelector('.message-input-wrapper');
        const timeDisplay = document.querySelector('.recording-time');
        
        recordBtn.classList.remove('recording');
        recordingIndicator.style.display = 'none';
        messageInputWrapper.style.display = 'flex';
        timeDisplay.textContent = '00:00';
    }

    onRecordingComplete(audioBlob) {
        // This will be overridden
        console.log('Recording complete:', audioBlob);
    }
}

// Initialize voice recorder
const voiceRecorder = new VoiceRecorder();

// Setup event listeners
document.addEventListener('DOMContentLoaded', () => {
    const voiceRecordBtn = document.getElementById('voiceRecordBtn');
    const cancelBtn = document.querySelector('.cancel-recording-btn');
    const sendBtn = document.querySelector('.send-recording-btn');
    
    if (voiceRecordBtn) {
        voiceRecordBtn.addEventListener('click', () => {
            if (!voiceRecorder.isRecording) {
                voiceRecorder.startRecording();
            }
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            voiceRecorder.cancelRecording();
        });
    }
    
    if (sendBtn) {
        sendBtn.addEventListener('click', () => {
            voiceRecorder.stopRecording();
        });
    }
    
    // Override onRecordingComplete to send the voice message
    voiceRecorder.onRecordingComplete = async (audioBlob) => {
        try {
            const formData = new FormData();
            formData.append('file', audioBlob, `voice-${Date.now()}.webm`);
            
            if (currentView === 'dm' && currentDMUserId) {
                formData.append('receiverId', currentDMUserId);
            } else if (currentView === 'server') {
                const channelId = getChannelIdByName(currentChannel);
                formData.append('channelId', channelId);
            }
            
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            
            if (!response.ok) {
                throw new Error('Upload failed');
            }
            
            const fileData = await response.json();
            
            // Send message with voice attachment
            const message = {
                text: '🎤 Voice Message',
                file: fileData,
                isVoice: true
            };
            
            if (socket && socket.connected) {
                if (currentView === 'dm' && currentDMUserId) {
                    socket.emit('send-dm', {
                        receiverId: currentDMUserId,
                        message: message
                    });
                } else if (currentView === 'server') {
                    const channelId = getChannelIdByName(currentChannel);
                    socket.emit('send-message', {
                        channelId: channelId,
                        message: message
                    });
                }
            }
            
        } catch (error) {
            console.error('Error sending voice message:', error);
            alert('Failed to send voice message');
        }
    };
});
