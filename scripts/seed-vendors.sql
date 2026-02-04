-- Seed Script: Sample Vendors for The Bean Route
-- Run this in Supabase SQL Editor to populate with Melbourne coffee carts

-- Insert 10 verified vendors
INSERT INTO vendors (id, slug, business_name, specialty, suburbs, price_min, price_max, capacity_min, capacity_max, description, contact_email, contact_phone, website, image_url, tags, verified, created_at) VALUES

('vnd_bean_machine_001', 'bean-machine-melbourne', 'Bean Machine Melbourne', 'Specialty espresso & cold brew', ARRAY['CBD', 'South Yarra', 'Richmond'], 180, 280, 50, 200, 'Premium specialty coffee with award-winning baristas. We bring café-quality espresso to your event with our vintage-inspired cart and organic, locally-roasted beans.', 'hello@beanmachine.com.au', '+61 400 123 456', 'https://beanmachine.com.au', NULL, ARRAY['corporate', 'weddings', 'festivals'], TRUE, NOW() - INTERVAL '30 days'),

('vnd_roast_riders_002', 'roast-riders', 'Roast Riders', 'Mobile coffee bar & nitro cold brew', ARRAY['Fitzroy', 'Collingwood', 'Brunswick'], 200, 300, 30, 150, 'Hipster vibes meet serious coffee. Our converted bicycle cart serves single-origin espresso, nitro cold brew on tap, and plant-based milk options. Perfect for creative events.', 'bookings@roastriders.com', '+61 401 234 567', NULL, NULL, ARRAY['festivals', 'markets', 'corporate'], TRUE, NOW() - INTERVAL '25 days'),

('vnd_espresso_express_003', 'espresso-express', 'Espresso Express', 'Fast service specialty coffee', ARRAY['CBD', 'Docklands', 'Southbank'], 150, 220, 100, 400, 'High-volume coffee service for large corporate events. Twin group heads, experienced team, and lightning-fast service without compromising on quality.', 'info@espressoexpress.com.au', '+61 402 345 678', 'https://espressoexpress.com.au', NULL, ARRAY['corporate', 'conferences', 'festivals'], TRUE, NOW() - INTERVAL '20 days'),

('vnd_little_latte_004', 'little-latte-cart', 'Little Latte Cart', 'Cute vintage cart with barista', ARRAY['St Kilda', 'Brighton', 'Elwood'], 160, 240, 20, 80, 'Adorable vintage cart perfect for intimate gatherings. We specialize in latte art and creating Instagram-worthy coffee moments at your wedding or private event.', 'contact@littlelatte.com.au', '+61 403 456 789', NULL, NULL, ARRAY['weddings', 'birthdays', 'private-events'], TRUE, NOW() - INTERVAL '15 days'),

('vnd_morning_buzz_005', 'morning-buzz-mobile', 'Morning Buzz Mobile', 'Corporate breakfast coffee service', ARRAY['CBD', 'South Melbourne', 'Port Melbourne'], 170, 260, 50, 250, 'Dedicated corporate coffee catering. We arrive early, set up fast, and keep your team caffeinated all morning. Loyalty program for repeat bookings.', 'hello@morningbuzz.com.au', '+61 404 567 890', 'https://morningbuzz.com.au', NULL, ARRAY['corporate', 'conferences', 'markets'], TRUE, NOW() - INTERVAL '10 days'),

('vnd_cart_noir_006', 'cart-noir', 'Cart Noir', 'Dark roast specialists', ARRAY['Prahran', 'Windsor', 'South Yarra'], 190, 270, 30, 120, 'Bold, dark roasts for serious coffee lovers. Our sleek black cart and moody aesthetic pairs perfectly with upscale events. Premium beans from ethical sources.', 'bookings@cartnoir.com.au', '+61 405 678 901', NULL, NULL, ARRAY['corporate', 'weddings', 'private-events'], TRUE, NOW() - INTERVAL '8 days'),

('vnd_java_junction_007', 'java-junction', 'Java Junction', 'Family-friendly coffee & hot chocolate', ARRAY['Camberwell', 'Hawthorn', 'Kew'], 140, 200, 40, 180, 'Coffee for adults, hot chocolate for kids! Family-run business specializing in community events, school fairs, and birthday parties. Allergen-friendly options available.', 'info@javajunction.com.au', '+61 406 789 012', NULL, NULL, ARRAY['birthdays', 'festivals', 'markets'], TRUE, NOW() - INTERVAL '5 days'),

('vnd_the_grind_008', 'the-grind-melbourne', 'The Grind Melbourne', 'Sustainable coffee with eco-friendly cart', ARRAY['Northcote', 'Thornbury', 'Preston'], 175, 250, 40, 160, 'Zero-waste coffee service using compostable cups, organic milk, and carbon-neutral roasters. Perfect for environmentally-conscious events and festivals.', 'hello@thegrindmelb.com', '+61 407 890 123', 'https://thegrindmelb.com', NULL, ARRAY['festivals', 'markets', 'corporate'], TRUE, NOW() - INTERVAL '3 days'),

('vnd_café_wheels_009', 'cafe-wheels', 'Café on Wheels', 'Full café menu in a cart', ARRAY['CBD', 'Carlton', 'Parkville'], 200, 320, 50, 200, 'Not just coffee! We offer pastries, sandwiches, and a full café menu from our custom-built cart. Perfect for all-day events and conferences.', 'bookings@cafewheels.com.au', '+61 408 901 234', NULL, NULL, ARRAY['corporate', 'conferences', 'weddings'], TRUE, NOW() - INTERVAL '2 days'),

('vnd_steam_co_010', 'steam-and-co', 'Steam & Co.', 'Classic Italian espresso experience', ARRAY['Carlton', 'Fitzroy', 'CBD'], 185, 280, 30, 150, 'Traditional Italian coffee culture meets Melbourne events. Our nonna-approved recipes and authentic Italian machine create the perfect espresso every time.', 'ciao@steamandco.com.au', '+61 409 012 345', 'https://steamandco.com.au', NULL, ARRAY['weddings', 'corporate', 'private-events'], TRUE, NOW() - INTERVAL '1 day');

-- Verify insertion
SELECT business_name, slug, suburbs, verified FROM vendors ORDER BY created_at DESC;
