-- Sample Projects Data for Cyberodyssey
-- Run this after schema.sql to populate the database with example projects

-- First, insert some mock users (if they don't exist)
INSERT INTO users (id, email, full_name, username, bio, role)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'sarah@example.com', 'Sarah Chen', 'sarahchen', 'Senior Software Engineer at Google. Passionate about distributed systems and ML.', 'senior_mentor'),
    ('00000000-0000-0000-0000-000000000002', 'james@example.com', 'James Wilson', 'jameswilson', 'Full-stack developer and tech lead. Love mentoring new developers.', 'mentor'),
    ('00000000-0000-0000-0000-000000000003', 'maria@example.com', 'Maria Garcia', 'mariag', 'Mobile developer specializing in React Native and iOS.', 'student'),
    ('00000000-0000-0000-0000-000000000004', 'alex@example.com', 'Alex Kumar', 'alexk', 'Security researcher and CTF enthusiast.', 'student'),
    ('00000000-0000-0000-0000-000000000005', 'emily@example.com', 'Emily Zhang', 'emilyz', 'Data science student. Learning ML one failure at a time.', 'student'),
    ('00000000-0000-0000-0000-000000000006', 'mike@example.com', 'Michael Brown', 'mikeb', 'DevOps engineer learning cloud architecture.', 'student'),
    ('00000000-0000-0000-0000-000000000007', 'priya@example.com', 'Priya Sharma', 'priyas', 'Computer Science student interested in cybersecurity.', 'student'),
    ('00000000-0000-0000-0000-000000000008', 'david@example.com', 'David Lee', 'davidl', 'Aspiring web developer. Building projects to learn.', 'student'),
    ('00000000-0000-0000-0000-000000000009', 'anna@example.com', 'Anna Kowalski', 'annak', 'Backend developer learning system design.', 'student'),
    ('00000000-0000-0000-0000-000000000010', 'raj@example.com', 'Raj Patel', 'rajp', 'Student exploring AI and machine learning.', 'student')
ON CONFLICT (id) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (id, user_id, title, slug, description, status, technologies, repository_url, demo_url)
VALUES 
    -- Project 1: Password Manager
    ('11111111-1111-1111-1111-111111111001', '00000000-0000-0000-0000-000000000004', 
     'SecureVault - Password Manager', 'securevault-password-manager',
     'A secure password manager built with Python and SQLite. Features include AES-256 encryption, master password protection, password generation, and browser extension integration. This project taught me the importance of proper key derivation and the dangers of storing sensitive data incorrectly.',
     'completed', ARRAY['Python', 'SQLite', 'Cryptography', 'Flask'],
     'https://github.com/alexk/securevault', 'https://securevault.demo.com'),
    
    -- Project 2: Network Scanner
    ('11111111-1111-1111-1111-111111111002', '00000000-0000-0000-0000-000000000007', 
     'NetScan - Network Vulnerability Scanner', 'netscan-vulnerability-scanner',
     'A Python-based network vulnerability scanner that identifies open ports, running services, and potential security issues. Uses Nmap integration and custom detection rules. Built to understand how attackers think.',
     'in_progress', ARRAY['Python', 'Nmap', 'Socket Programming', 'Linux'],
     'https://github.com/priyas/netscan', NULL),
    
    -- Project 3: JWT Auth System
    ('11111111-1111-1111-1111-111111111003', '00000000-0000-0000-0000-000000000003', 
     'AuthFlow - JWT Authentication System', 'authflow-jwt-authentication',
     'A complete authentication system with JWT tokens, refresh token rotation, and OAuth integration. Made many mistakes with token storage before getting it right. Now used as a template for all my projects.',
     'completed', ARRAY['Node.js', 'Express', 'JWT', 'PostgreSQL', 'Redis'],
     'https://github.com/mariag/authflow', 'https://authflow.vercel.app'),
    
    -- Project 4: Rate Limiter
    ('11111111-1111-1111-1111-111111111004', '00000000-0000-0000-0000-000000000009', 
     'RateLimiter Pro - API Protection', 'ratelimiter-api-protection',
     'Implemented multiple rate limiting algorithms: Token Bucket, Sliding Window, and Fixed Window. Built as a middleware for Express.js applications. Performance tested with 10K concurrent requests.',
     'completed', ARRAY['Node.js', 'Redis', 'Express', 'Docker'],
     'https://github.com/annak/ratelimiter-pro', NULL),
    
    -- Project 5: SQL Injection Lab
    ('11111111-1111-1111-1111-111111111005', '00000000-0000-0000-0000-000000000004', 
     'SQLi Lab - Learning SQL Injection', 'sqli-lab-learning',
     'A deliberately vulnerable web application for practicing SQL injection attacks. Includes 15 challenges from basic to advanced. Built to understand attack vectors before learning to defend against them.',
     'completed', ARRAY['PHP', 'MySQL', 'Docker', 'HTML/CSS'],
     'https://github.com/alexk/sqli-lab', NULL),
    
    -- Project 6: E2E Encrypted Chat
    ('11111111-1111-1111-1111-111111111006', '00000000-0000-0000-0000-000000000008', 
     'SecureChat - End-to-End Encrypted Messenger', 'securechat-e2e-messenger',
     'Real-time chat application with end-to-end encryption using the Signal Protocol. Learned about key exchange, forward secrecy, and the challenges of implementing crypto correctly.',
     'in_progress', ARRAY['React', 'Node.js', 'WebSocket', 'libsignal'],
     'https://github.com/davidl/securechat', NULL),
    
    -- Project 7: ML Malware Detector
    ('11111111-1111-1111-1111-111111111007', '00000000-0000-0000-0000-000000000005', 
     'MalDetect - ML-Based Malware Classification', 'maldetect-ml-classification',
     'Using machine learning to classify malware families based on behavioral analysis. Currently achieving 94% accuracy on the test set. Learning about feature engineering for security applications.',
     'in_progress', ARRAY['Python', 'TensorFlow', 'scikit-learn', 'Pandas'],
     'https://github.com/emilyz/maldetect', NULL),
    
    -- Project 8: Container Security
    ('11111111-1111-1111-1111-111111111008', '00000000-0000-0000-0000-000000000006', 
     'DockerGuard - Container Security Scanner', 'dockerguard-container-scanner',
     'Scans Docker images for vulnerabilities, misconfigurations, and secrets. Integrates with CI/CD pipelines. Built after accidentally pushing API keys in an image.',
     'completed', ARRAY['Go', 'Docker', 'Trivy', 'GitHub Actions'],
     'https://github.com/mikeb/dockerguard', NULL),
    
    -- Project 9: OAuth Implementation
    ('11111111-1111-1111-1111-111111111009', '00000000-0000-0000-0000-000000000003', 
     'OAuthKit - OAuth 2.0 From Scratch', 'oauthkit-from-scratch',
     'Implemented OAuth 2.0 authorization server from scratch to deeply understand the protocol. Supports authorization code, PKCE, and refresh tokens. Many security lessons learned.',
     'completed', ARRAY['TypeScript', 'Node.js', 'PostgreSQL', 'Jest'],
     'https://github.com/mariag/oauthkit', NULL),
    
    -- Project 10: Keylogger Detection
    ('11111111-1111-1111-1111-111111111010', '00000000-0000-0000-0000-000000000007', 
     'KeyShield - Keylogger Detection Tool', 'keyshield-keylogger-detection',
     'A Windows tool that detects keyloggers by monitoring keyboard hooks and suspicious processes. Research project for my cybersecurity course.',
     'completed', ARRAY['C#', 'Windows API', '.NET', 'WPF'],
     'https://github.com/priyas/keyshield', NULL),
    
    -- Project 11: Phishing Detector
    ('11111111-1111-1111-1111-111111111011', '00000000-0000-0000-0000-000000000005', 
     'PhishNet - ML Phishing Detection', 'phishnet-ml-detection',
     'Machine learning model to detect phishing URLs and emails. Uses NLP for email analysis and URL feature extraction. Part of my journey into security ML.',
     'in_progress', ARRAY['Python', 'BERT', 'Flask', 'scikit-learn'],
     'https://github.com/emilyz/phishnet', NULL),
    
    -- Project 12: Zero Trust API
    ('11111111-1111-1111-1111-111111111012', '00000000-0000-0000-0000-000000000009', 
     'ZeroTrust API Gateway', 'zerotrust-api-gateway',
     'Implementing zero-trust architecture principles in an API gateway. Features: mutual TLS, token validation, request signing, and audit logging.',
     'in_progress', ARRAY['Go', 'Envoy', 'gRPC', 'HashiCorp Vault'],
     'https://github.com/annak/zerotrust-gateway', NULL),
    
    -- Project 13: Secure File Share
    ('11111111-1111-1111-1111-111111111013', '00000000-0000-0000-0000-000000000008', 
     'SafeShare - Encrypted File Sharing', 'safeshare-encrypted-files',
     'Client-side encrypted file sharing platform. Files are encrypted before upload with user-controlled keys. Zero-knowledge architecture.',
     'completed', ARRAY['React', 'TypeScript', 'Web Crypto API', 'S3'],
     'https://github.com/davidl/safeshare', 'https://safeshare.demo.com'),
    
    -- Project 14: WAF Implementation
    ('11111111-1111-1111-1111-111111111014', '00000000-0000-0000-0000-000000000006', 
     'SimpleWAF - Web Application Firewall', 'simplewaf-firewall',
     'A simple WAF that blocks common web attacks: XSS, SQLi, CSRF. Built as a reverse proxy in Go. Great learning experience for understanding attack patterns.',
     'completed', ARRAY['Go', 'Lua', 'OpenResty', 'ModSecurity Rules'],
     'https://github.com/mikeb/simplewaf', NULL),
    
    -- Project 15: Blockchain Identity
    ('11111111-1111-1111-1111-111111111015', '00000000-0000-0000-0000-000000000010', 
     'BlockID - Decentralized Identity', 'blockid-decentralized-identity',
     'Exploring decentralized identity using blockchain. Implementing DID standards and verifiable credentials. Lots of learning about Web3 security.',
     'in_progress', ARRAY['Solidity', 'Hardhat', 'React', 'ethers.js'],
     'https://github.com/rajp/blockid', NULL)

ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    status = EXCLUDED.status,
    technologies = EXCLUDED.technologies;

-- Insert failure logs for these projects
INSERT INTO failure_logs (id, user_id, project_id, title, slug, what_i_was_trying, what_went_wrong, what_i_learned, emotional_journey, time_spent_minutes, is_resolved)
VALUES
    -- Failure Log 1: Password Manager - Plaintext storage
    ('22222222-2222-2222-2222-222222222001', '00000000-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111001',
     'Stored passwords in plaintext like a rookie', 'stored-passwords-plaintext',
     'I was trying to quickly prototype my password manager and wanted to get the basic CRUD operations working first.',
     'I stored passwords in plaintext in SQLite, thinking I would "add encryption later." When I reviewed my code a week later, I realized how dangerous this was - even for a demo. Anyone with access to the database file could see all passwords.',
     'Never, ever store sensitive data in plaintext, even for testing. I learned about proper key derivation using PBKDF2, salting, and why we use bcrypt for password hashing vs AES for data encryption. Also learned about secure deletion - my old plaintext database might still be recoverable!',
     'Embarrassed when I realized the mistake. Then grateful I caught it before sharing the repo. Now I understand why security must be built-in from the start, not bolted on later.',
     180, true),
    
    -- Failure Log 2: Network Scanner - Getting IP banned
    ('22222222-2222-2222-2222-222222222002', '00000000-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111002',
     'Accidentally DDoS-ed my own network', 'accidentally-ddosed-network',
     'Testing my network scanner on the home network to find open ports on all devices.',
     'I forgot to add rate limiting and ran an aggressive scan that generated thousands of requests per second. My router crashed, and my ISP temporarily blocked my connection thinking it was a DDoS attack.',
     'Always implement rate limiting in any scanning or automated tool. I learned about proper scanning etiquette, the difference between SYN and connect scans, and why tools like Nmap have timing options (-T1 to -T5). Also learned to always test on isolated VMs first!',
     'Panicked when internet went down. Wife was not happy about missing her video call. Now I have a separate test lab environment.',
     120, true),
    
    -- Failure Log 3: JWT Auth - Token in localStorage
    ('22222222-2222-2222-2222-222222222003', '00000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111003',
     'Stored JWT tokens in localStorage (XSS nightmare)', 'jwt-localstorage-xss',
     'Implementing user authentication with JWT tokens. Needed somewhere to store the token client-side.',
     'I stored JWTs in localStorage because it was easy. Then I realized this makes the app vulnerable to XSS attacks - any malicious script could steal the token. Also, my tokens never expired!',
     'Learned about httpOnly cookies, refresh token rotation, and why token expiry matters. Now I use httpOnly cookies for refresh tokens and short-lived access tokens in memory. Also implemented CSRF protection since cookies need that.',
     'Frustrated at first because cookies felt harder. But now I understand the security tradeoffs and why different storage options exist for different use cases.',
     240, true),
    
    -- Failure Log 4: Rate Limiter - Wrong algorithm choice
    ('22222222-2222-2222-2222-222222222004', '00000000-0000-0000-0000-000000000009', '11111111-1111-1111-1111-111111111004',
     'Fixed window rate limiter allowed burst attacks', 'fixed-window-burst-attack',
     'Implementing rate limiting for an API to prevent abuse.',
     'Used a simple fixed window approach (100 requests per minute). Discovered that users could make 100 requests at 11:59:59 and 100 more at 12:00:01 - effectively 200 requests in 2 seconds!',
     'Learned about different rate limiting algorithms and their tradeoffs. Sliding window is more fair but uses more memory. Token bucket allows controlled bursts. Now I choose the algorithm based on the use case.',
     'Confused at first about why fixed window wasn''t working. Then fascinated by the elegance of sliding window algorithms. Algorithms matter!',
     180, true),
    
    -- Failure Log 5: SQL Injection Lab - Escaped my sandbox
    ('22222222-2222-2222-2222-222222222005', '00000000-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111005',
     'My intentionally vulnerable app was TOO vulnerable', 'sandbox-escape-sqli-lab',
     'Creating a safe environment for practicing SQL injection attacks.',
     'Made the app so vulnerable that a test payload actually affected my host system through a misconfigured Docker volume. Accidentally deleted data from my development database!',
     'Proper isolation is crucial for security labs. Now I use separate Docker networks, read-only volumes, non-root users, and completely isolated test databases. Defense in depth applies to lab environments too.',
     'Scary moment when I saw real data disappear. Valuable lesson about never underestimating what an attacker (or your own testing) can do.',
     90, true),
    
    -- Failure Log 6: E2E Chat - Key management nightmare
    ('22222222-2222-2222-2222-222222222006', '00000000-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111006',
     'Users lost all messages when clearing browser data', 'key-management-message-loss',
     'Implementing end-to-end encryption where only users have the keys.',
     'Stored encryption keys only in IndexedDB. When users cleared browser data or switched devices, they lost access to all their messages forever. No key recovery possible.',
     'Key management is the hardest part of E2E encryption. Now implementing key backup (encrypted with password), key sync across devices, and proper key rotation. Also learned about the UX challenges of secure messaging.',
     'Devastated when a tester lost months of test messages. Realized that security without usability leads to data loss, which is also a security failure.',
     360, false),
    
    -- Failure Log 7: ML Malware - Overfitting on training data
    ('22222222-2222-2222-2222-222222222007', '00000000-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111007',
     '99% accuracy that meant nothing', 'ml-overfitting-malware',
     'Training a classifier to detect malware based on behavioral features.',
     'Got 99% accuracy on training data but only 60% on new samples. Classic overfitting. The model had memorized the training set instead of learning general patterns.',
     'Learned about train/test splits, cross-validation, and the importance of diverse training data. Also learned that security ML needs adversarial testing - attackers will try to evade your model.',
     'Excited by 99% accuracy, then humbled by real-world performance. Good lesson in skepticism and proper ML methodology.',
     480, true),
    
    -- Failure Log 8: Container Security - Missing vulnerability
    ('22222222-2222-2222-2222-222222222008', '00000000-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111008',
     'Scanned image, missed runtime vulnerability', 'missed-runtime-vulnerability',
     'Scanning Docker images for security vulnerabilities before deployment.',
     'My scanner checked the image layers but missed a vulnerability that only appeared at runtime when the container fetched dependencies. A teammate found a high-severity CVE in production.',
     'Static scanning isn''t enough. Implemented runtime scanning, SBOM generation, and continuous monitoring. Also learned about supply chain attacks and how dependencies can be compromised between scan and deploy.',
     'Embarrassed that I marketed the scanner as "complete protection." Now I''m more humble about what any single tool can catch.',
     240, true),
    
    -- Failure Log 9: OAuth - Redirect URI bypass
    ('22222222-2222-2222-2222-222222222009', '00000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111009',
     'My redirect URI validation had an obvious bypass', 'redirect-uri-bypass',
     'Implementing the OAuth 2.0 authorization code flow with redirect URI validation.',
     'Used a simple string prefix match for redirect URI validation. An attacker could register https://evil.com and then use redirect_uri=https://legit.com.evil.com - which passed my validation!',
     'Learned proper URI parsing and validation. Now I do strict matching, normalize URIs, and check for common bypass techniques. Also implemented logging to detect suspicious redirect URIs.',
     'Shocked that such a simple vulnerability could lead to token theft. OAuth is deceptively complex - many ways to get it wrong.',
     150, true),
    
    -- Failure Log 10: Keylogger Detection - False positives
    ('22222222-2222-2222-2222-222222222010', '00000000-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111010',
     'Flagged legitimate software as keyloggers', 'keylogger-false-positives',
     'Detecting keyloggers by monitoring keyboard hooks and process behavior.',
     'My detection logic was too aggressive and flagged password managers, accessibility tools, and gaming software as malicious. Users would disable the protection entirely rather than deal with false alerts.',
     'Learned about the tradeoff between detection rate and false positives. Implemented whitelisting, behavior scoring, and user-friendly alert systems. Also learned that UX in security tools is critical - ignored warnings are useless.',
     'Frustrated when users complained. Then understood that security tools need to work WITH users, not against them.',
     200, true),
    
    -- Failure Log 11: Phishing Detection - Unicode tricks
    ('22222222-2222-2222-2222-222222222011', '00000000-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111011',
     'Phishing URLs using Unicode lookalikes bypassed my detector', 'unicode-bypass-phishing',
     'Building a ML model to detect phishing URLs based on suspicious patterns.',
     'My model failed on URLs using Unicode characters that look identical to ASCII (like Cyrillic "а" vs Latin "a"). Attackers could create аpple.com which looked like apple.com but was completely different.',
     'Added Unicode normalization and Punycode detection to my feature extraction. Learned about IDN homograph attacks and why browsers show "xn--" prefixes. Also realized that attackers are creative!',
     'Humbled by how easily my "smart" ML was bypassed. Great reminder that adversarial thinking is essential in security.',
     180, true),
    
    -- Failure Log 12: Zero Trust - Performance nightmare
    ('22222222-2222-2222-2222-222222222012', '00000000-0000-0000-0000-000000000009', '11111111-1111-1111-1111-111111111012',
     'Zero trust verification added 500ms to every request', 'zerotrust-performance-nightmare',
     'Implementing full verification for every API request (no implicit trust).',
     'My zero-trust implementation checked identity, permissions, and context for every request. But all these checks added up to 500ms latency, making the API unusably slow.',
     'Learned about caching verification results safely, async checks for non-critical paths, and tiered trust levels. Zero trust doesn''t mean zero performance - it means verify continuously but efficiently.',
     'Stressed about choosing between security and usability. Learned that good engineering finds a balance.',
     300, false),
    
    -- Failure Log 13: Secure File Share - Client-side bugs
    ('22222222-2222-2222-2222-222222222013', '00000000-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111013',
     'Encryption key was in the URL fragment (oops)', 'encryption-key-in-url',
     'Sharing encrypted files with recipients who don''t have accounts.',
     'Put the decryption key in the URL hash (#key=abc123) so recipients could decrypt. But this meant the key was in browser history, could be logged by proxies, and was visible in shoulder-surfing.',
     'Implemented password-protected links, time-limited tokens, and recipient email verification. Also added audit logs so senders know who accessed their files.',
     'Facepalmed when I realized how visible URL fragments can be. Security is about the full threat model, not just encryption.',
     120, true),
    
    -- Failure Log 14: WAF - Regex DoS attack
    ('22222222-2222-2222-2222-222222222014', '00000000-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111014',
     'My WAF was vulnerable to ReDoS', 'waf-redos-vulnerability',
     'Writing regex patterns to detect XSS and SQLi attacks.',
     'Complex regex patterns for detecting attacks had exponential backtracking. Attackers could send specially crafted inputs that made my WAF CPU spike to 100%, causing a denial of service.',
     'Learned about ReDoS attacks and how to write safe regex (avoid nested quantifiers). Now I use atomic groups, test patterns with ReDoS checkers, and implement timeouts for pattern matching.',
     'Ironic that my security tool became a vulnerability. Great lesson in understanding the tools you use.',
     150, true),
    
    -- Failure Log 15: Blockchain Identity - Gas cost explosion
    ('22222222-2222-2222-2222-222222222015', '00000000-0000-0000-0000-000000000010', '11111111-1111-1111-1111-111111111015',
     'Simple identity operation cost $50 in gas fees', 'blockchain-gas-explosion',
     'Registering and verifying identity claims on Ethereum.',
     'My naive implementation stored too much data on-chain and used loops. A simple identity verification cost $50 in gas during high network congestion. Nobody would use this!',
     'Learned about on-chain vs off-chain patterns, gas optimization, and why IPFS + on-chain hashes is better than storing data directly. Also explored Layer 2 solutions for cost reduction.',
     'Discouraged by the cost. Then fascinated by the engineering challenges of blockchain scalability.',
     240, false)

ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    what_i_was_trying = EXCLUDED.what_i_was_trying,
    what_went_wrong = EXCLUDED.what_went_wrong,
    what_i_learned = EXCLUDED.what_i_learned;

-- Add some project milestones
INSERT INTO project_milestones (id, project_id, title, description, status, target_date)
SELECT 
    gen_random_uuid(),
    '11111111-1111-1111-1111-111111111001',
    title,
    description,
    status,
    target_date::date
FROM (VALUES 
    ('Initial Prototype', 'Basic CRUD operations for password storage', 'completed', '2024-01-15'),
    ('Implement Encryption', 'Add AES-256 encryption with proper key derivation', 'completed', '2024-01-30'),
    ('Browser Extension', 'Chrome extension for auto-fill', 'completed', '2024-02-15'),
    ('Password Generator', 'Customizable secure password generation', 'completed', '2024-02-28'),
    ('Mobile App', 'React Native app for Android/iOS', 'in_progress', '2024-04-01')
) AS milestones(title, description, status, target_date);

-- Update project view/like counts for realism
UPDATE projects SET 
    view_count = floor(random() * 500 + 100)::int,
    like_count = floor(random() * 50 + 10)::int
WHERE id LIKE '11111111-1111-1111-1111-11111111100%';
