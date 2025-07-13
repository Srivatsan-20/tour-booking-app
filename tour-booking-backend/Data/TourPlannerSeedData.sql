-- Sample Tourist Places Data for Smart Tour Planner
-- This script populates the TouristPlaces table with South Indian destinations

-- Clear existing data
DELETE FROM TouristPlaces;

-- Insert Tamil Nadu places
INSERT INTO TouristPlaces (Name, City, State, Category, Latitude, Longitude, DefaultVisitDurationMinutes, Description, Attractions, IsActive, CreatedAt) VALUES
('Kanyakumari', 'Kanyakumari', 'Tamil Nadu', 'Beach/Temple', 8.0883, 77.5385, 360, 'Southernmost tip of India, confluence of three seas', '["Vivekananda Rock Memorial", "Thiruvalluvar Statue", "Kumari Amman Temple", "Sunset Point"]', 1, GETUTCDATE()),
('Chennai', 'Chennai', 'Tamil Nadu', 'City/Beach', 13.0827, 80.2707, 480, 'Capital city with beaches, temples, and cultural sites', '["Marina Beach", "Kapaleeshwarar Temple", "Fort St. George", "Government Museum", "San Thome Cathedral"]', 1, GETUTCDATE()),
('Madurai', 'Madurai', 'Tamil Nadu', 'Temple/Heritage', 9.9252, 78.1198, 360, 'Temple city famous for Meenakshi Amman Temple', '["Meenakshi Amman Temple", "Thirumalai Nayakkar Palace", "Gandhi Memorial Museum", "Alagar Hills"]', 1, GETUTCDATE()),
('Rameshwaram', 'Rameshwaram', 'Tamil Nadu', 'Temple/Island', 9.2881, 79.3129, 300, 'Sacred island temple, one of Char Dham', '["Ramanathaswamy Temple", "Dhanushkodi", "Abdul Kalam Memorial", "Pamban Bridge"]', 1, GETUTCDATE()),
('Kodaikanal', 'Kodaikanal', 'Tamil Nadu', 'Hill Station', 10.2381, 77.4892, 480, 'Princess of Hill Stations with lakes and valleys', '["Kodai Lake", "Coakers Walk", "Bryant Park", "Pillar Rocks", "Silver Cascade Falls"]', 1, GETUTCDATE()),
('Thanjavur', 'Thanjavur', 'Tamil Nadu', 'Temple/Heritage', 10.7870, 79.1378, 240, 'Ancient city famous for Brihadeeswarar Temple', '["Brihadeeswarar Temple", "Thanjavur Palace", "Saraswathi Mahal Library", "Art Gallery"]', 1, GETUTCDATE()),
('Palani', 'Palani', 'Tamil Nadu', 'Temple/Hill', 10.4500, 77.5167, 180, 'Famous hill temple dedicated to Lord Murugan', '["Palani Murugan Temple", "Thiru Avinankudi Temple", "Rope Car Ride"]', 1, GETUTCDATE()),
('Ooty', 'Ooty', 'Tamil Nadu', 'Hill Station', 11.4064, 76.6932, 480, 'Queen of Hill Stations with tea gardens', '["Botanical Garden", "Ooty Lake", "Doddabetta Peak", "Tea Museum", "Nilgiri Mountain Railway"]', 1, GETUTCDATE()),
('Coimbatore', 'Coimbatore', 'Tamil Nadu', 'City/Temple', 11.0168, 76.9558, 240, 'Industrial city with temples and textile heritage', '["Marudamalai Temple", "Perur Pateeswarar Temple", "VOC Park", "Brookefields Mall"]', 1, GETUTCDATE()),
('Tirupati', 'Tirupati', 'Andhra Pradesh', 'Temple/Pilgrimage', 13.6288, 79.4192, 360, 'Famous pilgrimage center with Venkateswara Temple', '["Tirumala Venkateswara Temple", "Sri Vari Museum", "Kapila Theertham", "Chandragiri Fort"]', 1, GETUTCDATE()),

-- Insert Puducherry places
('Pondicherry', 'Pondicherry', 'Puducherry', 'Beach/Heritage', 11.9416, 79.8083, 360, 'French colonial heritage and beautiful beaches', '["French Quarter", "Auroville", "Paradise Beach", "Aurobindo Ashram", "Promenade Beach"]', 1, GETUTCDATE()),

-- Insert Kerala places
('Kochi', 'Kochi', 'Kerala', 'City/Heritage/Beach', 9.9312, 76.2673, 420, 'Queen of Arabian Sea with colonial heritage', '["Chinese Fishing Nets", "Fort Kochi", "Mattancherry Palace", "Jewish Synagogue", "Marine Drive"]', 1, GETUTCDATE()),
('Munnar', 'Munnar', 'Kerala', 'Hill Station', 10.0889, 77.0595, 480, 'Tea capital of South India with rolling hills', '["Tea Plantations", "Eravikulam National Park", "Mattupetty Dam", "Echo Point", "Top Station"]', 1, GETUTCDATE()),
('Alleppey', 'Alleppey', 'Kerala', 'Backwaters', 9.4981, 76.3388, 360, 'Venice of the East with backwaters and houseboats', '["Backwater Cruise", "Alleppey Beach", "Krishnapuram Palace", "Houseboat Stay"]', 1, GETUTCDATE()),
('Thekkady', 'Thekkady', 'Kerala', 'Wildlife/Nature', 9.5916, 77.1700, 300, 'Wildlife sanctuary with spice plantations', '["Periyar Wildlife Sanctuary", "Spice Plantations", "Bamboo Rafting", "Elephant Rides"]', 1, GETUTCDATE()),
('Trivandrum', 'Trivandrum', 'Kerala', 'City/Temple/Beach', 8.5241, 76.9366, 360, 'Capital city with temples and beaches', '["Padmanabhaswamy Temple", "Kovalam Beach", "Napier Museum", "Zoo"]', 1, GETUTCDATE()),

-- Insert Karnataka places
('Mysore', 'Mysore', 'Karnataka', 'Heritage/Palace', 12.2958, 76.6394, 360, 'City of Palaces with royal heritage', '["Mysore Palace", "Chamundi Hills", "Brindavan Gardens", "St. Philomena Church"]', 1, GETUTCDATE()),
('Bangalore', 'Bangalore', 'Karnataka', 'City/Gardens', 12.9716, 77.5946, 420, 'Garden City and IT capital of India', '["Lalbagh Botanical Garden", "Cubbon Park", "Bangalore Palace", "ISKCON Temple"]', 1, GETUTCDATE()),
('Coorg', 'Coorg', 'Karnataka', 'Hill Station', 12.3375, 75.8069, 480, 'Scotland of India with coffee plantations', '["Abbey Falls", "Raja Seat", "Coffee Plantations", "Dubare Elephant Camp"]', 1, GETUTCDATE()),

-- Insert Andhra Pradesh places
('Vijayawada', 'Vijayawada', 'Andhra Pradesh', 'City/Temple', 16.5062, 80.6480, 240, 'Business capital with Krishna River and temples', '["Kanaka Durga Temple", "Prakasam Barrage", "Undavalli Caves", "Bhavani Island"]', 1, GETUTCDATE()),

-- Additional popular places
('Vellore', 'Vellore', 'Tamil Nadu', 'Heritage/Temple', 12.9165, 79.1325, 180, 'Historic fort city with Jalakandeswarar Temple', '["Vellore Fort", "Jalakandeswarar Temple", "Government Museum"]', 1, GETUTCDATE()),
('Chidambaram', 'Chidambaram', 'Tamil Nadu', 'Temple', 11.3994, 79.6947, 120, 'Famous for Nataraja Temple', '["Nataraja Temple", "Annamalai University", "Pichavaram Mangrove Forest"]', 1, GETUTCDATE()),
('Kumbakonam', 'Kumbakonam', 'Tamil Nadu', 'Temple/Heritage', 10.9601, 79.3788, 180, 'Temple town with numerous ancient temples', '["Sarangapani Temple", "Adi Kumbeswarar Temple", "Mahamaham Tank"]', 1, GETUTCDATE()),
('Trichy', 'Trichy', 'Tamil Nadu', 'Temple/Heritage', 10.7905, 78.7047, 240, 'Historic city with Rock Fort Temple', '["Rock Fort Temple", "Srirangam Temple", "Jambukeswarar Temple"]', 1, GETUTCDATE()),
('Mahabalipuram', 'Mahabalipuram', 'Tamil Nadu', 'Heritage/Beach', 12.6269, 80.1927, 240, 'UNESCO World Heritage site with rock-cut temples', '["Shore Temple", "Five Rathas", "Arjuna Penance", "Tiger Cave"]', 1, GETUTCDATE()),
('Kanchipuram', 'Kanchipuram', 'Tamil Nadu', 'Temple/Heritage', 12.8342, 79.7036, 240, 'City of thousand temples and silk sarees', '["Ekambareswarar Temple", "Kailasanathar Temple", "Varadharaja Perumal Temple"]', 1, GETUTCDATE());

-- Verify the data
SELECT 
    Name,
    City,
    State,
    Category,
    DefaultVisitDurationMinutes,
    CASE 
        WHEN DefaultVisitDurationMinutes < 180 THEN 'Quick Visit'
        WHEN DefaultVisitDurationMinutes < 360 THEN 'Half Day'
        WHEN DefaultVisitDurationMinutes < 480 THEN 'Most of Day'
        ELSE 'Full Day'
    END as VisitType,
    Description
FROM TouristPlaces 
WHERE IsActive = 1
ORDER BY State, Name;

-- Summary statistics
SELECT 
    State,
    COUNT(*) as PlaceCount,
    AVG(DefaultVisitDurationMinutes) as AvgVisitTime,
    STRING_AGG(Category, ', ') as Categories
FROM TouristPlaces 
WHERE IsActive = 1
GROUP BY State
ORDER BY PlaceCount DESC;
