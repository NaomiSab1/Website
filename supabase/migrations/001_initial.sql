-- ═══════════════════════════════════════════════════════════
-- SABDIA CONSTRUCTIONS — SUPABASE SCHEMA & SEED DATA
-- Run this in your Supabase project: SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════

-- ── PROPERTIES ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS properties (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug                  TEXT UNIQUE NOT NULL,
  name                  TEXT NOT NULL,
  location              TEXT,
  suburb                TEXT,
  state                 TEXT DEFAULT 'QLD',
  status                TEXT DEFAULT 'for_sale' CHECK (status IN ('for_sale','sold','coming_soon')),
  bedrooms              INTEGER DEFAULT 0,
  bathrooms             INTEGER DEFAULT 0,
  garages               INTEGER DEFAULT 0,
  land_size             TEXT,
  price_guide           TEXT,
  hero_image            TEXT,
  card_image            TEXT,
  card_image_sm         TEXT,
  tagline               TEXT,
  description_paragraphs JSONB DEFAULT '[]',
  features              JSONB DEFAULT '[]',
  gallery_images        JSONB DEFAULT '[]',
  is_featured           BOOLEAN DEFAULT false,
  sort_order            INTEGER DEFAULT 0,
  seo_title             TEXT,
  seo_description       TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ── SERVICES ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  number                TEXT,
  title                 TEXT NOT NULL,
  short_description     TEXT,
  description_paragraphs JSONB DEFAULT '[]',
  deliverables          JSONB DEFAULT '[]',
  image                 TEXT,
  sort_order            INTEGER DEFAULT 0
);

-- ── TESTIMONIALS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote       TEXT NOT NULL,
  attribution TEXT,
  is_active   BOOLEAN DEFAULT true,
  sort_order  INTEGER DEFAULT 0
);

-- ── STATS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS stats (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key        TEXT UNIQUE NOT NULL,
  value      INTEGER NOT NULL DEFAULT 0,
  suffix     TEXT,
  label      TEXT,
  no_counter BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0
);

-- ── SEO PAGES ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS seo_pages (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key    TEXT UNIQUE NOT NULL,
  page_name   TEXT,
  title       TEXT,
  description TEXT,
  og_image    TEXT
);

-- ── SITE SETTINGS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  label TEXT
);

-- ═══════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- Public can read everything (needed at build time).
-- Only authenticated users can write.
-- ═══════════════════════════════════════════════════════════

ALTER TABLE properties     ENABLE ROW LEVEL SECURITY;
ALTER TABLE services       ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials   ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats          ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_pages      ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings  ENABLE ROW LEVEL SECURITY;

-- Read policies (public)
CREATE POLICY "Public read properties"    ON properties    FOR SELECT USING (true);
CREATE POLICY "Public read services"      ON services      FOR SELECT USING (true);
CREATE POLICY "Public read testimonials"  ON testimonials  FOR SELECT USING (true);
CREATE POLICY "Public read stats"         ON stats         FOR SELECT USING (true);
CREATE POLICY "Public read seo_pages"     ON seo_pages     FOR SELECT USING (true);
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);

-- Write policies (authenticated admin only)
CREATE POLICY "Auth write properties"    ON properties    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write services"      ON services      FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write testimonials"  ON testimonials  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write stats"         ON stats         FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write seo_pages"     ON seo_pages     FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write site_settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- ═══════════════════════════════════════════════════════════
-- SEED DATA — Current site content
-- ═══════════════════════════════════════════════════════════

-- Properties
INSERT INTO properties (slug,name,location,suburb,state,status,bedrooms,bathrooms,garages,land_size,
  hero_image,card_image,card_image_sm,tagline,description_paragraphs,features,gallery_images,
  is_featured,sort_order,seo_title,seo_description) VALUES
('qasr','QASR','Coorparoo, Queensland','Coorparoo','QLD','for_sale',5,7,9,'1000+m²',
  'https://static.wixstatic.com/media/1cc2db_f85ca82c83644534943559cb4b0067c9~mv2.png/v1/fill/w_1920,h_1080,q_90,enc_avif,quality_auto/1cc2db_f85ca82c83644534943559cb4b0067c9~mv2.png',
  'https://static.wixstatic.com/media/1cc2db_f85ca82c83644534943559cb4b0067c9~mv2.png/v1/fill/w_1400,h_900,q_90,enc_avif,quality_auto/1cc2db_f85ca82c83644534943559cb4b0067c9~mv2.png',
  'https://static.wixstatic.com/media/1cc2db_f85ca82c83644534943559cb4b0067c9~mv2.png/v1/fill/w_900,h_680,fp_0.5_0.65,q_90,enc_avif,quality_auto/1cc2db_f85ca82c83644534943559cb4b0067c9~mv2.png',
  'A palace for<br><em>the extraordinary life</em>.',
  '["QASR is Sabdia''s most ambitious and extraordinary achievement. A masterwork of contemporary residential architecture positioned in one of Coorparoo''s most coveted streets, QASR redefines what is possible in Brisbane luxury living.","The name QASR, derived from the Arabic for ''palace'', is a fitting moniker for a home of this magnitude. Natural stone, hand-selected timbers, and bespoke joinery converge to create an environment of singular beauty.","Five bedrooms, including a master suite of breathtaking proportion, seven bathrooms, a resort-style pool and entertaining pavilion, a private cinema, and a wine cellar combine to create a residence without equal in Brisbane."]',
  '["Home Cinema","Resort Pool & Spa","Nine-Car Garage","Private Wine Cellar","Master Suite with Dressing Room","Chef''s Kitchen","Outdoor Entertaining Pavilion","Smart Home Automation","Lift Access","Gym & Wellness Studio","Study / Home Office","Multiple Living Zones"]',
  '[{"url":"https://static.wixstatic.com/media/1cc2db_f85ca82c83644534943559cb4b0067c9~mv2.png/v1/fill/w_1200,h_1600,q_90,enc_avif,quality_auto/1cc2db_f85ca82c83644534943559cb4b0067c9~mv2.png","alt":"QASR Exterior"},{"url":"https://static.wixstatic.com/media/1cc2db_4e48586f78704fc3ae5d00ddb8a125ee~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85/1cc2db_4e48586f78704fc3ae5d00ddb8a125ee~mv2.jpg","alt":"QASR Interior"}]',
  true,1,
  'QASR | Sabdia Constructions',
  'QASR by Sabdia Constructions — a masterwork of contemporary residential architecture in Coorparoo, Queensland. Five bedrooms, seven bathrooms, nine-car garage.'),

('solace','SOLACE','Camp Hill, Queensland','Camp Hill','QLD','for_sale',5,5,4,'632m²',
  'https://static.wixstatic.com/media/1cc2db_5186783e26c04be6ab983f26b9b78377~mv2.jpg/v1/fill/w_1920,h_1080,al_c,q_85/1cc2db_5186783e26c04be6ab983f26b9b78377~mv2.jpg',
  'https://static.wixstatic.com/media/1cc2db_5186783e26c04be6ab983f26b9b78377~mv2.jpg/v1/fill/w_900,h_680,fp_0.5_0.65,q_90,enc_avif,quality_auto/1cc2db_5186783e26c04be6ab983f26b9b78377~mv2.jpg',
  'https://static.wixstatic.com/media/1cc2db_5186783e26c04be6ab983f26b9b78377~mv2.jpg/v1/fill/w_900,h_562,fp_0.5_0.65,q_90,enc_avif,quality_auto/1cc2db_5186783e26c04be6ab983f26b9b78377~mv2.jpg',
  'Where <em>calm</em><br>meets craftsmanship.',
  '["SOLACE is a study in refined contemporary living — a home conceived to provide sanctuary from the world whilst delivering every luxury its residents could desire.","The architectural language of SOLACE is one of considered restraint — where every material choice, every spatial decision, and every detail has been made in service of a home that feels genuinely restorative.","Five generously proportioned bedrooms, five bathrooms finished in natural stone and bespoke joinery, and four-car accommodation combine with exceptional outdoor entertaining spaces to create a home perfectly calibrated for family life at the highest level."]',
  '["Resort-style Pool","Open-plan Living & Dining","Four-Car Garage","Chef''s Kitchen","Master Suite with Walk-in Wardrobe","Outdoor Entertaining Area","Home Theatre","Study","Smart Home System","Landscaped Gardens"]',
  '[{"url":"https://static.wixstatic.com/media/1cc2db_5186783e26c04be6ab983f26b9b78377~mv2.jpg/v1/fill/w_1200,h_1600,q_90,enc_avif,quality_auto/1cc2db_5186783e26c04be6ab983f26b9b78377~mv2.jpg","alt":"SOLACE Exterior"}]',
  false,2,
  'SOLACE | Sabdia Constructions',
  'SOLACE by Sabdia Constructions — a sanctuary of refined contemporary living in Camp Hill, Queensland. Five bedrooms, five bathrooms, four-car garage.'),

('sierra','SIERRA','Holland Park West, Queensland','Holland Park West','QLD','for_sale',5,5,3,'573m²',
  'https://static.wixstatic.com/media/1cc2db_62a0dd9b4ea14ac390c3e94abab03d56~mv2.png/v1/fill/w_1920,h_1080,q_90,enc_avif,quality_auto/1cc2db_62a0dd9b4ea14ac390c3e94abab03d56~mv2.png',
  'https://static.wixstatic.com/media/1cc2db_62a0dd9b4ea14ac390c3e94abab03d56~mv2.png/v1/fill/w_900,h_680,fp_0.5_0.65,q_90,enc_avif,quality_auto/1cc2db_62a0dd9b4ea14ac390c3e94abab03d56~mv2.png',
  'https://static.wixstatic.com/media/1cc2db_62a0dd9b4ea14ac390c3e94abab03d56~mv2.png/v1/fill/w_900,h_562,fp_0.5_0.65,q_90,enc_avif,quality_auto/1cc2db_62a0dd9b4ea14ac390c3e94abab03d56~mv2.png',
  'Bold design.<br><em>Elevated living.</em>',
  '["SIERRA is a bold architectural statement — a contemporary residence of commanding presence and exceptional quality that sets a new standard for luxury living in Holland Park West.","The interior of SIERRA unfolds across multiple levels of light-filled, beautifully proportioned living spaces — each conceived with the same architectural vision that defines the exterior.","The outdoor living and pool zone of SIERRA is a masterclass in residential entertaining — a seamlessly connected environment that extends the interior''s luxury vocabulary into the landscape."]',
  '["Heated Pool & Spa","Triple-Car Garage","Gourmet Kitchen","Alfresco Dining & BBQ","Master Suite with Ensuite","Multiple Living Zones","Study / Home Office","Smart Home Integration","Natural Stone Bathrooms","Bespoke Joinery Throughout"]',
  '[{"url":"https://static.wixstatic.com/media/1cc2db_62a0dd9b4ea14ac390c3e94abab03d56~mv2.png/v1/fill/w_1200,h_1600,q_90,enc_avif,quality_auto/1cc2db_62a0dd9b4ea14ac390c3e94abab03d56~mv2.png","alt":"SIERRA Exterior"}]',
  false,3,
  'SIERRA | Sabdia Constructions',
  'SIERRA by Sabdia Constructions — a bold contemporary residence in Holland Park West, Queensland. Five bedrooms, five bathrooms, triple-car garage.'),

('caspian','CASPIAN','Ascot, Queensland','Ascot','QLD','for_sale',5,5,3,'544m²',
  'https://static.wixstatic.com/media/1cc2db_74fc877fe2204d2a98e663d0c7df421b~mv2.png/v1/fill/w_1920,h_1080,q_90,enc_avif,quality_auto/1cc2db_74fc877fe2204d2a98e663d0c7df421b~mv2.png',
  'https://static.wixstatic.com/media/1cc2db_74fc877fe2204d2a98e663d0c7df421b~mv2.png/v1/fill/w_900,h_560,fp_0.5_0.65,q_90,enc_avif,quality_auto/1cc2db_74fc877fe2204d2a98e663d0c7df421b~mv2.png',
  'https://static.wixstatic.com/media/1cc2db_74fc877fe2204d2a98e663d0c7df421b~mv2.png/v1/fill/w_900,h_562,fp_0.5_0.65,q_90,enc_avif,quality_auto/1cc2db_74fc877fe2204d2a98e663d0c7df421b~mv2.png',
  'Prestige redefined<br>in <em>Ascot</em>.',
  '["CASPIAN occupies one of Ascot''s most prestigious addresses — a home of exceptional calibre designed to complement and elevate one of Brisbane''s most coveted inner suburbs.","Inside, CASPIAN reveals a masterfully choreographed sequence of living spaces — from the entry gallery that signals the quality to come, through to the vast open-plan living and dining zone.","The outdoor living zone of CASPIAN is a private resort experience — a pool and entertaining pavilion of the highest standard."]',
  '["Resort Pool & Entertainment Pavilion","Triple-Car Garage","Open-plan Living & Dining","Chef''s Kitchen with Butler''s Pantry","Master Suite with Dressing Room","Home Cinema","Study","Smart Home System","Natural Stone Throughout","Custom Joinery"]',
  '[{"url":"https://static.wixstatic.com/media/1cc2db_74fc877fe2204d2a98e663d0c7df421b~mv2.png/v1/fill/w_1200,h_1600,q_90,enc_avif,quality_auto/1cc2db_74fc877fe2204d2a98e663d0c7df421b~mv2.png","alt":"CASPIAN Exterior"}]',
  false,4,
  'CASPIAN | Sabdia Constructions',
  'CASPIAN by Sabdia Constructions — prestige redefined in Ascot, Queensland. Five bedrooms, five bathrooms, triple-car garage, resort pool.'),

('capri','CAPRI','Coorparoo, Queensland','Coorparoo','QLD','sold',5,5,3,'545m²',
  'https://static.wixstatic.com/media/1cc2db_e8590ba3e20e4a3aa61c5fabafcae28b~mv2.png/v1/fill/w_1920,h_1080,q_90,enc_avif,quality_auto/1cc2db_e8590ba3e20e4a3aa61c5fabafcae28b~mv2.png',
  'https://static.wixstatic.com/media/1cc2db_e8590ba3e20e4a3aa61c5fabafcae28b~mv2.png/v1/fill/w_900,h_560,q_85,enc_avif,quality_auto/1cc2db_e8590ba3e20e4a3aa61c5fabafcae28b~mv2.png',
  'https://static.wixstatic.com/media/1cc2db_e8590ba3e20e4a3aa61c5fabafcae28b~mv2.png/v1/fill/w_800,h_500,q_85,enc_avif,quality_auto/1cc2db_e8590ba3e20e4a3aa61c5fabafcae28b~mv2.png',
  'Sold <em>prior to completion</em>.',
  '["CAPRI represented a defining moment in Sabdia''s portfolio — a residence of exceptional refinement that was sold prior to completion, testament to the confidence the market places in the Sabdia name.","Set in sought-after Coorparoo, CAPRI embodied the Sabdia philosophy of integrated design and construction.","CAPRI''s legacy lives on in every subsequent Sabdia project — the lessons learned, the standards set, and the benchmark it created for luxury residential development in inner Brisbane."]',
  '["Resort Pool","Triple-Car Garage","Open-plan Living","Gourmet Kitchen","Master Suite","Outdoor Entertaining","Home Cinema","Smart Home System"]',
  '[]',false,5,
  'CAPRI | Sabdia Constructions',
  'CAPRI by Sabdia Constructions — sold prior to completion. A luxury five-bedroom residence in Coorparoo, Queensland.'),

('aether','AETHER','Hendra, Queensland','Hendra','QLD','sold',5,5,3,'572m²',
  'https://static.wixstatic.com/media/1cc2db_7d5ad42861414a26bf1236edfa6e4603~mv2.png/v1/fill/w_1920,h_1080,q_90,enc_avif,quality_auto/1cc2db_7d5ad42861414a26bf1236edfa6e4603~mv2.png',
  'https://static.wixstatic.com/media/1cc2db_7d5ad42861414a26bf1236edfa6e4603~mv2.png/v1/fill/w_900,h_560,q_85,enc_avif,quality_auto/1cc2db_7d5ad42861414a26bf1236edfa6e4603~mv2.png',
  'https://static.wixstatic.com/media/1cc2db_7d5ad42861414a26bf1236edfa6e4603~mv2.png/v1/fill/w_800,h_500,q_85,enc_avif,quality_auto/1cc2db_7d5ad42861414a26bf1236edfa6e4603~mv2.png',
  'Light, space, and<br><em>elevated living</em>.',
  '["AETHER was a residence conceived around light — a home that captured and celebrated the extraordinary Brisbane sunshine in every space, at every hour. Set in prestigious Hendra, AETHER was sold prior to completion.","The name AETHER, evoking the upper sky and the element of light itself, perfectly described a home of luminous beauty.","AETHER joined the growing collection of Sabdia homes that have set the standard for luxury living across inner Brisbane."]',
  '["Resort Pool","Triple-Car Garage","Soaring Ceiling Heights","Expansive Glazing","Gourmet Kitchen","Master Suite","Outdoor Entertaining","Smart Home System"]',
  '[]',false,6,
  'AETHER | Sabdia Constructions',
  'AETHER by Sabdia Constructions — sold prior to completion. A luminous five-bedroom luxury residence in Hendra, Queensland.');

-- Services
INSERT INTO services (number,title,short_description,description_paragraphs,deliverables,image,sort_order) VALUES
('01','Luxury Residential Design',
  'Bespoke single residences and boutique developments designed for discerning clients. From architectural concept to interior finishing — every detail considered, nothing left to chance.',
  '["Our in-house architecture and design team creates residences that are as functional as they are breathtaking. We approach each project as a singular creative endeavour — absorbing the site''s character, the client''s aspirations, and the neighbourhood''s context before a single line is drawn.","The result is homes that feel inevitable — as though they could not have existed anywhere else, built for anyone else, or been conceived by any other studio."]',
  '["Architectural concept and schematic design","Design development and documentation","Planning approvals and DA management","Landscape architecture","Material and finishes specification","3D visualisation and virtual walkthroughs"]',
  'https://static.wixstatic.com/media/1cc2db_4e48586f78704fc3ae5d00ddb8a125ee~mv2.jpg/v1/fill/w_900,h_680,al_c,q_85/1cc2db_4e48586f78704fc3ae5d00ddb8a125ee~mv2.jpg',1),

('02','Development Management',
  'End-to-end residential development managed from vision to completion. Our integrated in-house model maintains meticulous control over quality, timing, and innovation throughout.',
  '["Development management is the complex art of orchestrating every moving part of a residential project — land acquisition, town planning, engineering, approvals, finance, sales, and delivery — into one coherent, high-performing whole.","Sabdia handles this process entirely in-house. This means fewer delays, tighter budgets, faster approvals, and a development that performs as well on paper as it does in person."]',
  '["Site acquisition analysis and due diligence","Feasibility modelling and investment structuring","Town planning strategy and DA management","Engineering and civil coordination","Sales and marketing strategy","Project reporting and stakeholder management"]',
  'https://static.wixstatic.com/media/1cc2db_5186783e26c04be6ab983f26b9b78377~mv2.jpg/v1/fill/w_900,h_680,fp_0.5_0.65,q_90,enc_avif,quality_auto/1cc2db_5186783e26c04be6ab983f26b9b78377~mv2.jpg',2),

('03','Interior Architecture',
  'Integrated interior architecture that elevates every space. Our design team collaborates closely with builders to ensure perfect cohesion between vision and reality.',
  '["Our interior architecture division ensures that the lived experience of a Sabdia home is as extraordinary as its exterior presence. Working in close collaboration with the architecture team from day one, our interior architects shape spaces that are luminous, considered, and deeply personal.","Every kitchen, bathroom, bedroom, and living space is designed as part of a holistic vision — where each room flows effortlessly into the next."]',
  '["Interior concept and spatial design","Custom joinery design and specification","Material, finish, and hardware selection","Lighting design and coordination","FF&E procurement and styling","Kitchen and bathroom design"]',
  'https://static.wixstatic.com/media/1cc2db_62a0dd9b4ea14ac390c3e94abab03d56~mv2.png/v1/fill/w_900,h_680,fp_0.5_0.65,q_90,enc_avif,quality_auto/1cc2db_62a0dd9b4ea14ac390c3e94abab03d56~mv2.png',3),

('04','Expert Construction',
  'Premium construction by master tradespeople. We use only the finest materials and proven methodologies — delivered with full transparency and precision at every stage.',
  '["Sabdia''s construction arm brings the vision to life with precision, skill, and an obsessive attention to detail. Our team of master tradespeople — many of whom have worked with Sabdia for years — share our commitment to doing everything properly.","We use only the finest materials, source from trusted suppliers, and never cut corners. The result is a home that not only looks extraordinary on the day of handover, but continues to perform to the highest standard for decades to come."]',
  '["Full residential construction management","Premium material sourcing and procurement","Master tradesperson coordination","Quality assurance and defect management","Client reporting and site access","Post-completion aftercare and warranty"]',
  'https://static.wixstatic.com/media/1cc2db_74fc877fe2204d2a98e663d0c7df421b~mv2.png/v1/fill/w_900,h_680,fp_0.5_0.65,q_90,enc_avif,quality_auto/1cc2db_74fc877fe2204d2a98e663d0c7df421b~mv2.png',4);

-- Testimonials
INSERT INTO testimonials (quote,attribution,is_active,sort_order) VALUES
('Sabdia delivered a home that exceeded every expectation. Their integrated approach — from design through to construction — meant every detail was perfectly executed. A truly exceptional result that we will treasure for generations.',
 'Satisfied Client — Inner Brisbane Residence', true, 1);

-- Stats
INSERT INTO stats (key,value,suffix,label,no_counter,sort_order) VALUES
('years',      10,  '+', 'Years in Brisbane',     false, 1),
('residences', 100, '+', 'Residences Delivered',  false, 2),
('awards',     5,   '★', 'Multi-Award Winning',   false, 3),
('inhouse',    100, '%', 'In-House Delivery',     true,  4);

-- Site Settings
INSERT INTO site_settings (key,value,label) VALUES
('location',          'Brisbane, Queensland, Australia', 'Business Location'),
('instagram_url',     'https://www.instagram.com/_sabdia/', 'Instagram URL'),
('instagram_handle',  '@_sabdia', 'Instagram Handle'),
('facebook_url',      'https://www.facebook.com/sabdiaconstructions/', 'Facebook URL'),
('facebook_label',    'Sabdia Constructions', 'Facebook Label'),
('linkedin_url',      'https://www.linkedin.com/company/sabdia-constructions/', 'LinkedIn URL'),
('linkedin_label',    'Sabdia Constructions', 'LinkedIn Label'),
('website_url',       'https://www.sabdiaconstructions.com.au', 'Website URL'),
('copyright_year',    '2025', 'Copyright Year'),
('company_name',      'Sabdia Constructions Pty Ltd', 'Legal Company Name'),
('footer_tagline',    'Boutique luxury home builder & developer delivering award-winning residences across inner Brisbane since 2013.', 'Footer Tagline'),
('vercel_deploy_hook','', 'Vercel Deploy Hook URL');
