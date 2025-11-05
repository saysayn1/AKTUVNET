// Profile page functionality
const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');

if (!token || !userId) {
    window.location.href = '/login.html';
}

// Load user profile
async function loadProfile() {
    try {
        const response = await fetch(`/api/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to load profile');
        
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
        alert('Failed to load profile');
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

// Load profile on page load
loadProfile();
