// Profile page functionality
const token = localStorage.getItem('token');
let userId = localStorage.getItem('userId');

if (!token) {
    window.location.href = '/login.html';
}

// Get userId from currentUser if not in localStorage
if (!userId) {
    const currentUserStr = localStorage.getItem('currentUser');
    if (currentUserStr) {
        try {
            const currentUser = JSON.parse(currentUserStr);
            userId = currentUser.id;
            localStorage.setItem('userId', userId);
        } catch (e) {
            console.error('Error parsing currentUser:', e);
            window.location.href = '/login.html';
        }
    } else {
        window.location.href = '/login.html';
    }
}

// Load user profile
async function loadProfile() {
    try {
        const response = await fetch(`/api/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Profile load error:', response.status, errorText);
            throw new Error('Failed to load profile');
        }
        
        const user = await response.json();
        
        // Update UI
        document.getElementById('displayName').textContent = user.display_name || user.username;
        document.getElementById('userTag').textContent = user.user_tag ? `@${user.user_tag}` : `@${user.username}`;
        document.getElementById('avatarLetter').textContent = (user.display_name || user.username).charAt(0).toUpperCase();
        document.getElementById('userBio').textContent = user.bio || 'No bio yet...';
        document.getElementById('memberSince').textContent = new Date(user.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Music
        if (user.profile_music) {
            try {
                const music = JSON.parse(user.profile_music);
                document.getElementById('musicTitle').textContent = music.title;
                document.getElementById('musicArtist').textContent = music.artist;
                document.getElementById('playMusicBtn').style.display = 'flex';
                document.getElementById('playMusicBtn').onclick = () => {
                    if (music.url) {
                        window.open(music.url, '_blank');
                    }
                };
            } catch (e) {
                console.error('Error parsing music:', e);
            }
        }
        
        // Banner
        if (user.banner) {
            document.getElementById('profileBanner').style.backgroundImage = `url(${user.banner})`;
            document.getElementById('profileBanner').style.backgroundSize = 'cover';
            document.getElementById('profileBanner').style.backgroundPosition = 'center';
        }
        
    } catch (error) {
        console.error('Error loading profile:', error);
        
        // Show error in UI instead of alert
        const profileContainer = document.querySelector('.profile-container');
        if (profileContainer) {
            profileContainer.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; color: #dcddde;">
                    <h2 style="color: #ed4245; margin-bottom: 20px;">⚠️ Failed to load profile</h2>
                    <p style="margin-bottom: 20px;">Unable to load your profile data. Please try again.</p>
                    <button onclick="location.reload()" style="
                        background: #5865f2;
                        color: #fff;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 4px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                    ">Reload Page</button>
                    <button onclick="location.href='/index.html'" style="
                        background: #4f545c;
                        color: #fff;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 4px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        margin-left: 12px;
                    ">Go Back</button>
                </div>
            `;
        }
    }
}

// Edit Bio
document.getElementById('editBioBtn').addEventListener('click', () => {
    const modal = document.getElementById('editBioModal');
    const bioInput = document.getElementById('bioInput');
    const currentBio = document.getElementById('userBio').textContent;
    
    if (currentBio !== 'No bio yet...') {
        bioInput.value = currentBio;
    }
    
    updateCharCount();
    modal.classList.remove('hidden');
});

document.getElementById('closeBioModal').addEventListener('click', () => {
    document.getElementById('editBioModal').classList.add('hidden');
});

document.getElementById('cancelBio').addEventListener('click', () => {
    document.getElementById('editBioModal').classList.add('hidden');
});

document.getElementById('bioInput').addEventListener('input', updateCharCount);

function updateCharCount() {
    const bioInput = document.getElementById('bioInput');
    const charCount = document.getElementById('bioCharCount');
    charCount.textContent = bioInput.value.length;
}

document.getElementById('saveBio').addEventListener('click', async () => {
    const bio = document.getElementById('bioInput').value.trim();
    
    try {
        const response = await fetch(`/api/users/${userId}/profile`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ bio })
        });
        
        if (!response.ok) throw new Error('Failed to update bio');
        
        document.getElementById('userBio').textContent = bio || 'No bio yet...';
        document.getElementById('editBioModal').classList.add('hidden');
        
    } catch (error) {
        console.error('Error updating bio:', error);
        alert('Failed to update bio');
    }
});

// Edit Music
document.getElementById('editMusicBtn').addEventListener('click', () => {
    document.getElementById('editMusicModal').classList.remove('hidden');
});

document.getElementById('closeMusicModal').addEventListener('click', () => {
    document.getElementById('editMusicModal').classList.add('hidden');
});

document.getElementById('cancelMusic').addEventListener('click', () => {
    document.getElementById('editMusicModal').classList.add('hidden');
});

document.getElementById('saveMusic').addEventListener('click', async () => {
    const title = document.getElementById('musicTitleInput').value.trim();
    const artist = document.getElementById('musicArtistInput').value.trim();
    const url = document.getElementById('musicUrlInput').value.trim();
    
    if (!title || !artist) {
        alert('Please fill in song title and artist');
        return;
    }
    
    const music = JSON.stringify({ title, artist, url });
    
    try {
        const response = await fetch(`/api/users/${userId}/profile`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ profile_music: music })
        });
        
        if (!response.ok) throw new Error('Failed to update music');
        
        document.getElementById('musicTitle').textContent = title;
        document.getElementById('musicArtist').textContent = artist;
        document.getElementById('playMusicBtn').style.display = 'flex';
        document.getElementById('playMusicBtn').onclick = () => {
            if (url) {
                window.open(url, '_blank');
            }
        };
        
        document.getElementById('editMusicModal').classList.add('hidden');
        
        // Clear inputs
        document.getElementById('musicTitleInput').value = '';
        document.getElementById('musicArtistInput').value = '';
        document.getElementById('musicUrlInput').value = '';
        
    } catch (error) {
        console.error('Error updating music:', error);
        alert('Failed to update music');
    }
});

// Support Developer
document.getElementById('supportDevBtn').addEventListener('click', () => {
    document.getElementById('supportModal').classList.remove('hidden');
});

document.getElementById('closeSupportModal').addEventListener('click', () => {
    document.getElementById('supportModal').classList.add('hidden');
});

// Close modals on background click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
});

// Settings button
document.getElementById('settingsBtn').addEventListener('click', () => {
    window.location.href = '/index.html';
});

// Edit Profile button
document.getElementById('editProfileBtn').addEventListener('click', () => {
    alert('Edit profile feature coming soon!');
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        window.location.href = '/login.html';
    }
});

// Custom Status functionality
let selectedEmoji = '😎';

document.getElementById('editStatusBtn')?.addEventListener('click', () => {
    document.getElementById('editStatusModal').classList.remove('hidden');
});

document.getElementById('closeStatusModal')?.addEventListener('click', () => {
    document.getElementById('editStatusModal').classList.add('hidden');
});

document.getElementById('cancelStatus')?.addEventListener('click', () => {
    document.getElementById('editStatusModal').classList.add('hidden');
});

// Emoji selection
document.querySelectorAll('.emoji-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedEmoji = btn.dataset.emoji;
    });
});

// Status input character count
document.getElementById('statusInput')?.addEventListener('input', () => {
    const input = document.getElementById('statusInput');
    const count = document.getElementById('statusCharCount');
    count.textContent = input.value.length;
});

// Save status
document.getElementById('saveStatus')?.addEventListener('click', async () => {
    const statusText = document.getElementById('statusInput').value.trim();
    
    try {
        const response = await fetch(`/api/users/${userId}/profile`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 
                custom_status: statusText,
                status_emoji: selectedEmoji
            })
        });
        
        if (!response.ok) throw new Error('Failed to update status');
        
        // Update UI
        document.getElementById('previewEmoji').textContent = selectedEmoji;
        document.getElementById('previewText').textContent = statusText || 'Set your custom status...';
        
        if (statusText) {
            document.getElementById('customStatusDisplay').style.display = 'flex';
            document.getElementById('statusEmojiDisplay').textContent = selectedEmoji;
            document.getElementById('statusTextDisplay').textContent = statusText;
        }
        
        document.getElementById('editStatusModal').classList.add('hidden');
        
    } catch (error) {
        console.error('Error updating status:', error);
        alert('Failed to update status');
    }
});

// Clear status
document.getElementById('clearStatus')?.addEventListener('click', async () => {
    try {
        const response = await fetch(`/api/users/${userId}/profile`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 
                custom_status: '',
                status_emoji: ''
            })
        });
        
        if (!response.ok) throw new Error('Failed to clear status');
        
        document.getElementById('customStatusDisplay').style.display = 'none';
        document.getElementById('previewEmoji').textContent = '😎';
        document.getElementById('previewText').textContent = 'Set your custom status...';
        document.getElementById('statusInput').value = '';
        document.getElementById('editStatusModal').classList.add('hidden');
        
    } catch (error) {
        console.error('Error clearing status:', error);
        alert('Failed to clear status');
    }
});

// Theme switching with animation
const themes = {
    dark: {
        '--bg-primary': '#36393f',
        '--bg-secondary': '#2f3136',
        '--bg-tertiary': '#202225',
        '--text-primary': '#dcddde',
        '--text-secondary': '#b9bbbe',
        '--accent': '#5865f2'
    },
    light: {
        '--bg-primary': '#ffffff',
        '--bg-secondary': '#f2f3f5',
        '--bg-tertiary': '#e3e5e8',
        '--text-primary': '#2e3338',
        '--text-secondary': '#4e5058',
        '--accent': '#5865f2'
    },
    amoled: {
        '--bg-primary': '#000000',
        '--bg-secondary': '#0a0a0a',
        '--bg-tertiary': '#141414',
        '--text-primary': '#ffffff',
        '--text-secondary': '#b9bbbe',
        '--accent': '#5865f2'
    },
    purple: {
        '--bg-primary': '#2b2d42',
        '--bg-secondary': '#1a1b2e',
        '--bg-tertiary': '#16213e',
        '--text-primary': '#edf2f4',
        '--text-secondary': '#8d99ae',
        '--accent': '#7289da'
    }
};

function applyTheme(themeName) {
    const theme = themes[themeName];
    const root = document.documentElement;
    
    // Add transition class
    document.body.classList.add('theme-transition');
    
    // Apply theme colors
    Object.keys(theme).forEach(property => {
        root.style.setProperty(property, theme[property]);
    });
    
    // Update active theme
    document.querySelectorAll('.theme-option').forEach(opt => {
        opt.classList.remove('active');
    });
    document.querySelector(`[data-theme="${themeName}"]`)?.classList.add('active');
    
    // Remove transition class after animation
    setTimeout(() => {
        document.body.classList.remove('theme-transition');
    }, 300);
    
    // Save to localStorage
    localStorage.setItem('theme', themeName);
}

// Theme option click handlers
document.querySelectorAll('.theme-option').forEach(option => {
    option.addEventListener('click', async () => {
        const themeName = option.dataset.theme;
        applyTheme(themeName);
        
        // Save to database
        try {
            await fetch(`/api/users/${userId}/profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ theme: themeName })
            });
        } catch (error) {
            console.error('Error saving theme:', error);
        }
    });
});

// Load saved theme on page load
const savedTheme = localStorage.getItem('theme') || 'dark';
applyTheme(savedTheme);

// Load profile on page load
loadProfile();
