// Settings functionality
class SettingsManager {
    constructor() {
        this.selectedDevices = {
            microphone: null,
            camera: null,
            speaker: null
        };
        
        this.init();
    }
    
    init() {
        // Settings button
        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.openSettings());
        }
        
        // Close settings
        const closeSettings = document.getElementById('closeSettings');
        if (closeSettings) {
            closeSettings.addEventListener('click', () => this.closeSettings());
        }
        
        // Close on background click
        const settingsModal = document.getElementById('settingsModal');
        if (settingsModal) {
            settingsModal.addEventListener('click', (e) => {
                if (e.target === settingsModal) {
                    this.closeSettings();
                }
            });
        }
        
        // Test buttons
        document.getElementById('testMicrophone')?.addEventListener('click', () => this.testMicrophone());
        document.getElementById('testCamera')?.addEventListener('click', () => this.testCamera());
        document.getElementById('testSpeaker')?.addEventListener('click', () => this.testSpeaker());
        
        // Close test video
        document.getElementById('closeTestVideo')?.addEventListener('click', () => this.closeTestVideo());
        
        // Device change listeners
        document.getElementById('microphoneSelect')?.addEventListener('change', (e) => {
            this.selectedDevices.microphone = e.target.value;
            localStorage.setItem('selectedMicrophone', e.target.value);
        });
        
        document.getElementById('cameraSelect')?.addEventListener('change', (e) => {
            this.selectedDevices.camera = e.target.value;
            localStorage.setItem('selectedCamera', e.target.value);
        });
        
        document.getElementById('speakerSelect')?.addEventListener('change', (e) => {
            this.selectedDevices.speaker = e.target.value;
            localStorage.setItem('selectedSpeaker', e.target.value);
        });
    }
    
    async openSettings() {
        const modal = document.getElementById('settingsModal');
        if (modal) {
            modal.classList.remove('hidden');
            await this.loadDevices();
        }
    }
    
    closeSettings() {
        const modal = document.getElementById('settingsModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }
    
    async loadDevices() {
        try {
            // Try to get devices without requesting permissions first
            let devices = await navigator.mediaDevices.enumerateDevices();
            
            // If devices have no labels, request permissions
            if (devices.length > 0 && !devices[0].label) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
                    // Stop tracks immediately
                    stream.getTracks().forEach(track => track.stop());
                    // Get devices again with labels
                    devices = await navigator.mediaDevices.enumerateDevices();
                } catch (permError) {
                    console.warn('Permission denied, showing devices without labels:', permError);
                }
            }
            
            const microphones = devices.filter(d => d.kind === 'audioinput');
            const cameras = devices.filter(d => d.kind === 'videoinput');
            const speakers = devices.filter(d => d.kind === 'audiooutput');
            
            this.populateDeviceSelect('microphoneSelect', microphones, 'selectedMicrophone');
            this.populateDeviceSelect('cameraSelect', cameras, 'selectedCamera');
            this.populateDeviceSelect('speakerSelect', speakers, 'selectedSpeaker');
            
        } catch (error) {
            console.error('Error loading devices:', error);
            // Show message in UI instead of alert
            ['microphoneSelect', 'cameraSelect', 'speakerSelect'].forEach(id => {
                const select = document.getElementById(id);
                if (select) {
                    select.innerHTML = '<option>Unable to load devices</option>';
                }
            });
        }
    }
    
    populateDeviceSelect(selectId, devices, storageKey) {
        const select = document.getElementById(selectId);
        if (!select) return;
        
        select.innerHTML = '';
        
        if (devices.length === 0) {
            const option = document.createElement('option');
            option.textContent = 'No devices found';
            select.appendChild(option);
            return;
        }
        
        const savedDevice = localStorage.getItem(storageKey);
        
        devices.forEach((device, index) => {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.textContent = device.label || `Device ${index + 1}`;
            
            if (savedDevice === device.deviceId) {
                option.selected = true;
            }
            
            select.appendChild(option);
        });
    }
    
    async testMicrophone() {
        try {
            const deviceId = document.getElementById('microphoneSelect').value;
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: { deviceId: deviceId ? { exact: deviceId } : undefined }
            });
            
            // Create audio context to visualize
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const microphone = audioContext.createMediaStreamSource(stream);
            microphone.connect(analyser);
            
            alert('Microphone test started! Speak into your microphone. Click OK to stop.');
            
            // Stop test
            stream.getTracks().forEach(track => track.stop());
            audioContext.close();
            
        } catch (error) {
            console.error('Microphone test error:', error);
            alert('Failed to test microphone: ' + error.message);
        }
    }
    
    async testCamera() {
        try {
            const deviceId = document.getElementById('cameraSelect').value;
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    deviceId: deviceId ? { exact: deviceId } : undefined,
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });
            
            const preview = document.getElementById('testVideoPreview');
            const video = document.getElementById('testVideo');
            
            if (preview && video) {
                video.srcObject = stream;
                preview.classList.remove('hidden');
                
                // Store stream to stop later
                this.testStream = stream;
            }
            
        } catch (error) {
            console.error('Camera test error:', error);
            alert('Failed to test camera: ' + error.message);
        }
    }
    
    closeTestVideo() {
        const preview = document.getElementById('testVideoPreview');
        const video = document.getElementById('testVideo');
        
        if (this.testStream) {
            this.testStream.getTracks().forEach(track => track.stop());
            this.testStream = null;
        }
        
        if (video) {
            video.srcObject = null;
        }
        
        if (preview) {
            preview.classList.add('hidden');
        }
    }
    
    async testSpeaker() {
        try {
            const audio = new Audio('/sounds/message.mp3');
            const deviceId = document.getElementById('speakerSelect').value;
            
            if (audio.setSinkId && deviceId) {
                await audio.setSinkId(deviceId);
            }
            
            audio.play();
            
        } catch (error) {
            console.error('Speaker test error:', error);
            alert('Failed to test speaker: ' + error.message);
        }
    }
    
    // Get selected device for use in calls
    getSelectedDevice(type) {
        return this.selectedDevices[type] || localStorage.getItem(`selected${type.charAt(0).toUpperCase() + type.slice(1)}`);
    }
}

// Initialize settings manager
let settingsManager;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        settingsManager = new SettingsManager();
    });
} else {
    settingsManager = new SettingsManager();
}
