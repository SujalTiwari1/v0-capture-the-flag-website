-- Add OSINT challenges if they don't exist
-- Run this script to add OSINT challenges to your database

-- OSINT (Open Source Intelligence) challenges
INSERT INTO challenges (title, category, difficulty, target_year, description, full_description, flag_hash, points)
SELECT * FROM (VALUES 
  ('Whois Lookup', 'OSINT', 'easy', '2025', 'Gather domain information', 'Use WHOIS to find publicly available information about a domain and extract the flag.', 'flag{whois_info_found}', 10),
  ('Subdomain Enumeration', 'OSINT', 'medium', '2025', 'Find hidden subdomains', 'Enumerate publicly known subdomains using OSINT techniques to locate a hidden flag.', 'flag{subdomains_found}', 25),
  ('GitHub Recon', 'OSINT', 'medium', '2025', 'Search GitHub for leaks', 'Search GitHub repositories for accidentally exposed secrets and find the flag.', 'flag{github_secret_exposed}', 25),
  ('Email Harvesting', 'OSINT', 'medium', '2025', 'Harvest email addresses', 'Find associated email addresses linked to a domain using public databases and search engines.', 'flag{emails_harvested}', 25),
  ('IP Geolocation', 'OSINT', 'medium', '2025', 'Locate IP address origin', 'Use IP geolocation databases to determine the physical location of a server and find the flag.', 'flag{ip_geolocation_found}', 25),
  ('Social Media Profiling', 'OSINT', 'hard', '2025', 'Profile a target on social media', 'Gather information from social media profiles to find sensitive data and extract the flag.', 'flag{profile_info_gathered}', 50),
  ('DNS History Investigation', 'OSINT', 'hard', '2025', 'Investigate DNS history', 'Use DNS history records to uncover historical information about a domain and find the flag.', 'flag{dns_history_uncovered}', 50)
) AS v(title, category, difficulty, target_year, description, full_description, flag_hash, points)
WHERE NOT EXISTS (
  SELECT 1 FROM challenges WHERE challenges.title = v.title
);
