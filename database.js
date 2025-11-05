const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'discord_clone.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
function initializeDatabase() {
    db.serialize(() => {
        // Users table
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                display_name TEXT,
                user_tag TEXT UNIQUE,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                avatar TEXT,
                banner TEXT,
                bio TEXT,
                profile_music TEXT,
                status TEXT DEFAULT 'Online',
                custom_status TEXT,
                status_emoji TEXT,
                game_status TEXT,
                theme TEXT DEFAULT 'dark',
                achievements TEXT,
                profile_views INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Add new columns if they don't exist (migration)
        db.run(`ALTER TABLE users ADD COLUMN display_name TEXT`, () => {});
        db.run(`ALTER TABLE users ADD COLUMN user_tag TEXT UNIQUE`, () => {});
        db.run(`ALTER TABLE users ADD COLUMN banner TEXT`, () => {});
        db.run(`ALTER TABLE users ADD COLUMN bio TEXT`, () => {});
        db.run(`ALTER TABLE users ADD COLUMN profile_music TEXT`, () => {});
        db.run(`ALTER TABLE users ADD COLUMN custom_status TEXT`, () => {});
        db.run(`ALTER TABLE users ADD COLUMN status_emoji TEXT`, () => {});
        db.run(`ALTER TABLE users ADD COLUMN theme TEXT DEFAULT 'dark'`, () => {});
        db.run(`ALTER TABLE users ADD COLUMN achievements TEXT`, () => {});
        db.run(`ALTER TABLE users ADD COLUMN profile_views INTEGER DEFAULT 0`, () => {});

        // Servers table
        db.run(`
            CREATE TABLE IF NOT EXISTS servers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                icon TEXT,
                owner_id INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (owner_id) REFERENCES users(id)
            )
        `);

        // Channels table
        db.run(`
            CREATE TABLE IF NOT EXISTS channels (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                type TEXT NOT NULL,
                server_id INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (server_id) REFERENCES servers(id)
            )
        `);

        // Messages table
        db.run(`
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                content TEXT NOT NULL,
                user_id INTEGER,
                channel_id INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (channel_id) REFERENCES channels(id)
            )
        `);

        // Direct messages table
        db.run(`
            CREATE TABLE IF NOT EXISTS direct_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                content TEXT NOT NULL,
                sender_id INTEGER,
                receiver_id INTEGER,
                read BOOLEAN DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (sender_id) REFERENCES users(id),
                FOREIGN KEY (receiver_id) REFERENCES users(id)
            )
        `);

        // File uploads table
        db.run(`
            CREATE TABLE IF NOT EXISTS file_uploads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                filename TEXT NOT NULL,
                filepath TEXT NOT NULL,
                filetype TEXT,
                filesize INTEGER,
                user_id INTEGER,
                channel_id INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (channel_id) REFERENCES channels(id)
            )
        `);

        // Reactions table
        db.run(`
            CREATE TABLE IF NOT EXISTS reactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                emoji TEXT NOT NULL,
                message_id INTEGER,
                user_id INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (message_id) REFERENCES messages(id),
                FOREIGN KEY (user_id) REFERENCES users(id),
                UNIQUE(message_id, user_id, emoji)
            )
        `);

        // Server members table
        db.run(`
            CREATE TABLE IF NOT EXISTS server_members (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                server_id INTEGER,
                user_id INTEGER,
                joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (server_id) REFERENCES servers(id),
                FOREIGN KEY (user_id) REFERENCES users(id),
                UNIQUE(server_id, user_id)
            )
        `);

        // Friends table
        db.run(`
            CREATE TABLE IF NOT EXISTS friends (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                friend_id INTEGER,
                status TEXT DEFAULT 'pending',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (friend_id) REFERENCES users(id),
                UNIQUE(user_id, friend_id)
            )
        `);

        console.log('Database initialized successfully');
    });
}

// User operations
const userDB = {
    create: (username, email, hashedPassword) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
            db.run(sql, [username, email, hashedPassword], function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, username, email });
            });
        });
    },

    findByEmail: (email) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE email = ?';
            db.get(sql, [email], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    findById: (id) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT id, username, email, avatar, status, game_status FROM users WHERE id = ?';
            db.get(sql, [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    updateStatus: (id, status) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE users SET status = ? WHERE id = ?';
            db.run(sql, [status, id], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    },

    updateGameStatus: (id, gameStatus) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE users SET game_status = ? WHERE id = ?';
            db.run(sql, [gameStatus, id], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    },

    getAll: () => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT id, username, email, avatar, status, game_status FROM users';
            db.all(sql, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    getById: (id) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE id = ?';
            db.get(sql, [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    getByUserTag: (userTag) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE user_tag = ?';
            db.get(sql, [userTag], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    updateProfile: (id, data) => {
        return new Promise((resolve, reject) => {
            const fields = [];
            const values = [];
            
            if (data.bio !== undefined) {
                fields.push('bio = ?');
                values.push(data.bio);
            }
            if (data.profile_music !== undefined) {
                fields.push('profile_music = ?');
                values.push(data.profile_music);
            }
            if (data.banner !== undefined) {
                fields.push('banner = ?');
                values.push(data.banner);
            }
            if (data.display_name !== undefined) {
                fields.push('display_name = ?');
                values.push(data.display_name);
            }
            if (data.user_tag !== undefined) {
                fields.push('user_tag = ?');
                values.push(data.user_tag);
            }
            if (data.custom_status !== undefined) {
                fields.push('custom_status = ?');
                values.push(data.custom_status);
            }
            if (data.status_emoji !== undefined) {
                fields.push('status_emoji = ?');
                values.push(data.status_emoji);
            }
            if (data.theme !== undefined) {
                fields.push('theme = ?');
                values.push(data.theme);
            }
            
            if (fields.length === 0) {
                return resolve();
            }
            
            values.push(id);
            const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
            
            db.run(sql, values, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
};

// Message operations
const messageDB = {
    create: (content, userId, channelId) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO messages (content, user_id, channel_id) VALUES (?, ?, ?)';
            db.run(sql, [content, userId, channelId], function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, content, userId, channelId });
            });
        });
    },

    getByChannel: (channelId, limit = 50) => {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT m.*, u.username, u.avatar 
                FROM messages m 
                JOIN users u ON m.user_id = u.id 
                WHERE m.channel_id = ? 
                ORDER BY m.created_at DESC 
                LIMIT ?
            `;
            db.all(sql, [channelId, limit], (err, rows) => {
                if (err) reject(err);
                else resolve(rows.reverse());
            });
        });
    }
};

// Direct message operations
const dmDB = {
    create: (content, senderId, receiverId) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO direct_messages (content, sender_id, receiver_id) VALUES (?, ?, ?)';
            db.run(sql, [content, senderId, receiverId], function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, content, senderId, receiverId });
            });
        });
    },

    getConversation: (userId1, userId2, limit = 50) => {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT dm.*, u.username, u.avatar 
                FROM direct_messages dm 
                JOIN users u ON dm.sender_id = u.id 
                WHERE (dm.sender_id = ? AND dm.receiver_id = ?) 
                   OR (dm.sender_id = ? AND dm.receiver_id = ?)
                ORDER BY dm.created_at DESC 
                LIMIT ?
            `;
            db.all(sql, [userId1, userId2, userId2, userId1, limit], (err, rows) => {
                if (err) reject(err);
                else resolve(rows.reverse());
            });
        });
    },

    markAsRead: (messageId) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE direct_messages SET read = 1 WHERE id = ?';
            db.run(sql, [messageId], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
};

// File operations
const fileDB = {
    create: (filename, filepath, filetype, filesize, userId, channelId) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO file_uploads (filename, filepath, filetype, filesize, user_id, channel_id) VALUES (?, ?, ?, ?, ?, ?)';
            db.run(sql, [filename, filepath, filetype, filesize, userId, channelId], function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, filename, filepath });
            });
        });
    },

    getByChannel: (channelId) => {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT f.*, u.username 
                FROM file_uploads f 
                JOIN users u ON f.user_id = u.id 
                WHERE f.channel_id = ? 
                ORDER BY f.created_at DESC
            `;
            db.all(sql, [channelId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
};

// Reaction operations
const reactionDB = {
    add: (emoji, messageId, userId) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT OR IGNORE INTO reactions (emoji, message_id, user_id) VALUES (?, ?, ?)';
            db.run(sql, [emoji, messageId, userId], function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, emoji, messageId, userId });
            });
        });
    },

    remove: (emoji, messageId, userId) => {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM reactions WHERE emoji = ? AND message_id = ? AND user_id = ?';
            db.run(sql, [emoji, messageId, userId], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    },

    getByMessage: (messageId) => {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT r.emoji, COUNT(*) as count, GROUP_CONCAT(u.username) as users
                FROM reactions r
                JOIN users u ON r.user_id = u.id
                WHERE r.message_id = ?
                GROUP BY r.emoji
            `;
            db.all(sql, [messageId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
};

// Friend operations
const friendDB = {
    sendRequest: (userId, friendId) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT OR IGNORE INTO friends (user_id, friend_id, status) VALUES (?, ?, "pending")';
            db.run(sql, [userId, friendId], function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    },

    acceptRequest: (userId, friendId) => {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                // Update the request status
                const sql1 = 'UPDATE friends SET status = "accepted" WHERE user_id = ? AND friend_id = ?';
                db.run(sql1, [friendId, userId], (err) => {
                    if (err) return reject(err);
                });

                // Create reverse relationship
                const sql2 = 'INSERT OR IGNORE INTO friends (user_id, friend_id, status) VALUES (?, ?, "accepted")';
                db.run(sql2, [userId, friendId], function(err) {
                    if (err) reject(err);
                    else resolve();
                });
            });
        });
    },

    rejectRequest: (userId, friendId) => {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM friends WHERE user_id = ? AND friend_id = ?';
            db.run(sql, [friendId, userId], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    },

    removeFriend: (userId, friendId) => {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                const sql1 = 'DELETE FROM friends WHERE user_id = ? AND friend_id = ?';
                const sql2 = 'DELETE FROM friends WHERE user_id = ? AND friend_id = ?';
                
                db.run(sql1, [userId, friendId], (err) => {
                    if (err) return reject(err);
                });
                
                db.run(sql2, [friendId, userId], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        });
    },

    getFriends: (userId) => {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT DISTINCT u.id, u.username, u.email, u.avatar, u.status, u.game_status
                FROM friends f
                JOIN users u ON (f.friend_id = u.id OR f.user_id = u.id)
                WHERE (f.user_id = ? OR f.friend_id = ?) 
                AND f.status = 'accepted'
                AND u.id != ?
            `;
            db.all(sql, [userId, userId, userId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    getPendingRequests: (userId) => {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT u.id, u.username, u.email, u.avatar, u.status
                FROM friends f
                JOIN users u ON f.user_id = u.id
                WHERE f.friend_id = ? AND f.status = 'pending'
            `;
            db.all(sql, [userId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    checkFriendship: (userId, friendId) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM friends WHERE user_id = ? AND friend_id = ? AND status = "accepted"';
            db.get(sql, [userId, friendId], (err, row) => {
                if (err) reject(err);
                else resolve(!!row);
            });
        });
    }
};

// Server operations
const serverDB = {
    create: (name, ownerId) => {
        return new Promise((resolve, reject) => {
            const icon = name.charAt(0).toUpperCase();
            const sql = 'INSERT INTO servers (name, icon, owner_id) VALUES (?, ?, ?)';
            db.run(sql, [name, icon, ownerId], function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, name, icon, ownerId });
            });
        });
    },

    getUserServers: (userId) => {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT s.* FROM servers s
                JOIN server_members sm ON s.id = sm.server_id
                WHERE sm.user_id = ?
                ORDER BY s.created_at ASC
            `;
            db.all(sql, [userId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    addMember: (serverId, userId) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT OR IGNORE INTO server_members (server_id, user_id) VALUES (?, ?)';
            db.run(sql, [serverId, userId], function(err) {
                if (err) reject(err);
                else resolve();
            });
        });
    },

    getMembers: (serverId) => {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT u.id, u.username, u.avatar, u.status
                FROM users u
                JOIN server_members sm ON u.id = sm.user_id
                WHERE sm.server_id = ?
            `;
            db.all(sql, [serverId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
};

module.exports = {
    db,
    initializeDatabase,
    userDB,
    messageDB,
    dmDB,
    fileDB,
    reactionDB,
    friendDB,
    serverDB
};