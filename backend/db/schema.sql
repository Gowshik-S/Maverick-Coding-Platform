CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    resume_text TEXT,
    skills JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assessments (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    question TEXT,
    user_code TEXT,
    score INT DEFAULT 0,
    feedback TEXT,
    improvement TEXT,
    skill_area VARCHAR(50),
    difficulty FLOAT DEFAULT 0.5,
    time_taken INT,
    hints_used INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS learning_paths (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    path JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hackathons (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    theme VARCHAR(100),
    duration_hours INT DEFAULT 36,
    organizer_id INT REFERENCES users(id),
    challenges JSONB DEFAULT '[]'::jsonb,
    milestones JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hackathon_submissions (
    id SERIAL PRIMARY KEY,
    hackathon_id INT REFERENCES hackathons(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    code TEXT,
    challenge_title VARCHAR(200),
    score INT DEFAULT 0,
    plagiarism_score FLOAT DEFAULT 0.0,
    feedback TEXT,
    submitted_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS badges (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    badge_name VARCHAR(100),
    badge_icon VARCHAR(10),
    reason TEXT,
    earned_at TIMESTAMP DEFAULT NOW()
);
