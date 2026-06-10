-- ═══════════════════════════════════════════════════════════════════════
-- Seed: real Sabdia Constructions content (from the existing site)
-- Run AFTER migrations:  supabase db reset   (applies migrations + seed)
-- or:  psql $DATABASE_URL -f supabase/seed.sql
-- ═══════════════════════════════════════════════════════════════════════

-- ── Site settings ──────────────────────────────────────────────────────
insert into public.site_settings (id, data) values ('default', '{
  "brand": { "name": "Sabdia Constructions", "logo_url": null },
  "nav": {
    "links": [
      { "label": "Home", "href": "/" },
      { "label": "About", "href": "/about" },
      { "label": "Services", "href": "/services" },
      { "label": "Properties", "href": "/projects" },
      { "label": "Collection", "href": "/collection" }
    ],
    "cta": { "label": "Contact", "href": "/contact" }
  },
  "footer": {
    "tagline": "Boutique luxury home builder and developer in inner Brisbane. Multi-award winning, 100+ residences delivered since 2013.",
    "location": "Brisbane, Queensland, Australia",
    "socials": [
      { "label": "Instagram", "href": "https://www.instagram.com/_sabdia/" },
      { "label": "Facebook", "href": "https://www.facebook.com/sabdiaconstructions/" },
      { "label": "LinkedIn", "href": "https://www.linkedin.com/company/sabdia-constructions/" }
    ],
    "legal": ""
  },
  "theme": {
    "colors": {
      "ink": "#1c1915",
      "paper": "#faf8f5",
      "paper-alt": "#f2eee8",
      "dark": "#0e0d0b",
      "accent": "#a88b62",
      "taupe": "#8a7f70"
    },
    "fonts": { "display": "Fraunces", "body": "Inter Tight" }
  }
}'::jsonb)
on conflict (id) do update set data = excluded.data;

-- ── Projects ───────────────────────────────────────────────────────────
insert into public.projects (slug, name, location, status, specs, cover_image, description, sort_order) values
('qasr', 'QASR', 'Coorparoo, QLD', 'for_sale',
 '{"beds":5,"baths":7,"garage":9,"land":"1000+m²"}',
 'https://static.wixstatic.com/media/1cc2db_f85ca82c83644534943559cb4b0067c9~mv2.png/v1/fill/w_1400,h_900,q_90,enc_avif,quality_auto/1cc2db_f85ca82c83644534943559cb4b0067c9~mv2.png',
 'A landmark residence in Coorparoo — over 1000m² of meticulously crafted living space.', 0),
('solace', 'SOLACE', 'Camp Hill, QLD', 'for_sale',
 '{"beds":5,"baths":5,"land":"632m²"}',
 'https://static.wixstatic.com/media/1cc2db_5186783e26c04be6ab983f26b9b78377~mv2.jpg/v1/fill/w_900,h_680,fp_0.5_0.65,q_90,enc_avif,quality_auto/1cc2db_5186783e26c04be6ab983f26b9b78377~mv2.jpg',
 null, 1),
('sierra', 'SIERRA', 'Holland Park West, QLD', 'for_sale',
 '{"beds":5,"baths":5,"land":"573m²"}',
 'https://static.wixstatic.com/media/1cc2db_62a0dd9b4ea14ac390c3e94abab03d56~mv2.png/v1/fill/w_900,h_680,fp_0.5_0.65,q_90,enc_avif,quality_auto/1cc2db_62a0dd9b4ea14ac390c3e94abab03d56~mv2.png',
 null, 2),
('caspian', 'CASPIAN', 'Ascot, QLD', 'for_sale',
 '{"beds":5,"baths":5,"land":"544m²"}',
 'https://static.wixstatic.com/media/1cc2db_74fc877fe2204d2a98e663d0c7df421b~mv2.png/v1/fill/w_900,h_560,fp_0.5_0.65,q_90,enc_avif,quality_auto/1cc2db_74fc877fe2204d2a98e663d0c7df421b~mv2.png',
 null, 3),
('capri', 'CAPRI', 'Brisbane, QLD', 'sold',
 '{"beds":5,"baths":5,"garage":3,"land":"545m²"}',
 'https://static.wixstatic.com/media/1cc2db_e8590ba3e20e4a3aa61c5fabafcae28b~mv2.png/v1/fill/w_800,h_500,q_85,enc_avif,quality_auto/1cc2db_e8590ba3e20e4a3aa61c5fabafcae28b~mv2.png',
 'Sold prior to completion.', 4),
('aether', 'AETHER', 'Brisbane, QLD', 'sold',
 '{"beds":5,"baths":5,"garage":3,"land":"572m²"}',
 'https://static.wixstatic.com/media/1cc2db_7d5ad42861414a26bf1236edfa6e4603~mv2.png/v1/fill/w_800,h_500,q_85,enc_avif,quality_auto/1cc2db_7d5ad42861414a26bf1236edfa6e4603~mv2.png',
 'Sold prior to completion.', 5),
('encanto', 'ENCANTO', 'Brisbane, QLD', 'completed',
 '{}',
 'https://static.wixstatic.com/media/1cc2db_64f35b15dd914a189eee2aeb79b86284~mv2.jpg/v1/fill/w_900,h_680,q_85,enc_avif,quality_auto/1cc2db_64f35b15dd914a189eee2aeb79b86284~mv2.jpg',
 null, 6),
('nero', 'NERO', 'Brisbane, QLD', 'completed',
 '{}',
 'https://static.wixstatic.com/media/1cc2db_9cbfa41ef2dd4ed3b14b5277765cc446~mv2.jpg/v1/fill/w_900,h_680,q_85,enc_avif,quality_auto/1cc2db_9cbfa41ef2dd4ed3b14b5277765cc446~mv2.jpg',
 null, 7),
('hermosa', 'HERMOSA', 'Brisbane, QLD', 'completed',
 '{}',
 'https://static.wixstatic.com/media/1cc2db_9ed4e50eba3b453885aa6a4917ba5607~mv2.jpg/v1/fill/w_900,h_680,q_85,enc_avif,quality_auto/1cc2db_9ed4e50eba3b453885aa6a4917ba5607~mv2.jpg',
 null, 8),
('fraser', 'FRASER', 'Brisbane, QLD', 'completed',
 '{}',
 'https://static.wixstatic.com/media/1cc2db_fb04f5dbe53b4d34ab710537a2e24b40~mv2.jpg/v1/fill/w_900,h_680,q_85,enc_avif,quality_auto/1cc2db_fb04f5dbe53b4d34ab710537a2e24b40~mv2.jpg',
 null, 9),
('94-newman', '94 NEWMAN', 'Brisbane, QLD', 'completed', '{}', null, null, 10),
('matong', 'MATONG', 'Brisbane, QLD', 'completed', '{}', null, null, 11)
on conflict (slug) do nothing;

-- ── Pages ──────────────────────────────────────────────────────────────
insert into public.pages (id, slug, title, status, seo_title, seo_description, og_image, show_in_nav, nav_order) values
('00000000-0000-4000-8000-000000000001', 'home', 'Home', 'draft',
 'Sabdia Constructions | Luxury Home Builders & Developers, Brisbane',
 'Boutique luxury home builder and developer in inner Brisbane. Multi-award winning, 100+ residences delivered since 2013. Design, Develop, Construct.',
 'https://static.wixstatic.com/media/1cc2db_4e48586f78704fc3ae5d00ddb8a125ee~mv2.jpg/v1/fill/w_1200,h_630,al_c,q_85/1cc2db_4e48586f78704fc3ae5d00ddb8a125ee~mv2.jpg',
 true, 0),
('00000000-0000-4000-8000-000000000002', 'about', 'About', 'draft',
 'About | Sabdia Constructions',
 'A decade of award-winning luxury residential development in inner Brisbane.', null, true, 1),
('00000000-0000-4000-8000-000000000003', 'services', 'Services', 'draft',
 'Services | Sabdia Constructions',
 'Full-spectrum development expertise — design, development management, interior architecture, and expert construction.', null, true, 2),
('00000000-0000-4000-8000-000000000004', 'projects', 'Properties', 'draft',
 'Properties | Sabdia Constructions',
 'Current luxury residences for sale across inner Brisbane.', null, true, 3),
('00000000-0000-4000-8000-000000000005', 'collection', 'Collection', 'draft',
 'Collection | Sabdia Constructions',
 'The Sabdia Collection — completed residences across inner Brisbane.', null, true, 4),
('00000000-0000-4000-8000-000000000006', 'contact', 'Contact', 'draft',
 'Contact | Sabdia Constructions',
 'Start a conversation with the Sabdia Constructions team.', null, true, 5)
on conflict (slug) do nothing;

-- ── Home sections ──────────────────────────────────────────────────────
insert into public.sections (page_id, type, sort_order, config, content) values
('00000000-0000-4000-8000-000000000001', 'hero', 0, '{"spacing":"none","container":"full"}', '{
  "eyebrow": "Boutique Luxury Builder & Developer · Brisbane",
  "heading": "Design.\n*Develop.*\nConstruct.",
  "subheading": "Redefining luxury through design, detail, and craftsmanship. For over a decade, Sabdia has delivered award-winning residences that set a new benchmark for contemporary living in Brisbane.",
  "image": "https://static.wixstatic.com/media/1cc2db_4e48586f78704fc3ae5d00ddb8a125ee~mv2.jpg/v1/fill/w_1920,h_1080,al_c,q_85/1cc2db_4e48586f78704fc3ae5d00ddb8a125ee~mv2.jpg",
  "image_alt": "Sabdia luxury residence — QASR, Coorparoo",
  "overlay": true,
  "primary_cta": { "label": "View Properties", "href": "/projects" },
  "secondary_cta": { "label": "Begin a Conversation", "href": "/contact" },
  "height": "full"
}'),
('00000000-0000-4000-8000-000000000001', 'stats', 1, '{"background":"alt","spacing":"compact"}', '{
  "items": [
    { "value": "100", "suffix": "+", "label": "Residences Delivered" },
    { "value": "10", "suffix": "+", "label": "Years in Brisbane" },
    { "value": "5", "suffix": "★", "label": "Multi-Award Winning" },
    { "value": "100", "suffix": "%", "label": "In-House Delivery" }
  ]
}'),
('00000000-0000-4000-8000-000000000001', 'text_image', 2, '{"anchor":"about"}', '{
  "eyebrow": "About Sabdia",
  "heading": "Crafting *Exquisite* Living Spaces.",
  "body": "<p>At Sabdia, we manage every step of the residential development journey in-house — from visionary design through to expert construction. This integrated approach allows us to maintain meticulous control over quality, timing, and innovation, delivering homes that stand the test of time.</p><p>With a focus on creating exceptional living spaces, Sabdia Constructions is dedicated to shaping the future of residential developments through innovation, quality, and unparalleled craftsmanship.</p><blockquote>We are not merely builders — we are creators of legacy. Each residence we deliver is conceived as a singular work of architecture.</blockquote>",
  "image": "https://static.wixstatic.com/media/1cc2db_9e730867446c414c9fe72c1549cb7261~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85/1cc2db_9e730867446c414c9fe72c1549cb7261~mv2.jpg",
  "image_alt": "Sabdia craftsmanship detail",
  "image_side": "right",
  "cta": { "label": "Our Full Story", "href": "/about" }
}'),
('00000000-0000-4000-8000-000000000001', 'project_showcase', 3, '{"anchor":"properties"}', '{
  "eyebrow": "For Sale",
  "heading": "*Current* Properties",
  "source": "for_sale",
  "limit": 0,
  "cta": { "label": "View All", "href": "/projects" }
}'),
('00000000-0000-4000-8000-000000000001', 'text_image', 4, '{"background":"dark","anchor":"services"}', '{
  "eyebrow": "What We Do",
  "heading": "Full-spectrum *development* expertise.",
  "body": "<p>From site acquisition through to final handover, Sabdia manages every element in-house — ensuring seamless delivery and uncompromising quality at every stage.</p><ul><li>Luxury Residential Design</li><li>Development Management</li><li>Interior Architecture</li><li>Expert Construction</li></ul>",
  "image": "https://static.wixstatic.com/media/1cc2db_5186783e26c04be6ab983f26b9b78377~mv2.jpg/v1/fill/w_900,h_680,fp_0.5_0.65,q_90,enc_avif,quality_auto/1cc2db_5186783e26c04be6ab983f26b9b78377~mv2.jpg",
  "image_alt": "Sabdia residence exterior",
  "image_side": "left",
  "cta": { "label": "Explore Services", "href": "/services" }
}'),
('00000000-0000-4000-8000-000000000001', 'testimonials', 5, '{"background":"alt"}', '{
  "heading": "",
  "items": [
    {
      "quote": "Sabdia delivered a home that exceeded every expectation. Their integrated approach — from design through to construction — meant every detail was perfectly executed. A truly exceptional result that we will treasure for generations.",
      "author": "Satisfied Client — Inner Brisbane Residence"
    }
  ]
}'),
('00000000-0000-4000-8000-000000000001', 'cta', 6, '{}', '{
  "heading": "Exclusive *Agent* Access.",
  "body": "Gain exclusive insight into Sabdia''s future releases — pre-launch information, priority communication, and early access to premium developments.",
  "cta": { "label": "Apply for Access", "href": "/contact" }
}'),
('00000000-0000-4000-8000-000000000001', 'contact_form', 7, '{"background":"alt","anchor":"contact"}', '{
  "eyebrow": "Get In Touch",
  "heading": "Let''s start a *conversation*.",
  "intro": "Please submit your contact information and one of our team members will be in touch with you shortly.",
  "interests": [
    { "label": "For Sale — Current Properties" },
    { "label": "Custom Home Design" },
    { "label": "Development Partnership" },
    { "label": "Agent Access" },
    { "label": "General Enquiry" }
  ],
  "success_message": "Thank you — we typically respond within one business day."
}');

-- ── About sections ─────────────────────────────────────────────────────
insert into public.sections (page_id, type, sort_order, config, content) values
('00000000-0000-4000-8000-000000000002', 'hero', 0, '{"spacing":"none","container":"full"}', '{
  "eyebrow": "About Sabdia",
  "heading": "Built on *craftsmanship*.",
  "subheading": "A decade of award-winning residential development in inner Brisbane.",
  "image": "https://static.wixstatic.com/media/1cc2db_9e730867446c414c9fe72c1549cb7261~mv2.jpg/v1/fill/w_1920,h_1080,al_c,q_85/1cc2db_9e730867446c414c9fe72c1549cb7261~mv2.jpg",
  "image_alt": "Sabdia residence — SOLACE, Camp Hill",
  "overlay": true,
  "primary_cta": { "label": "", "href": "" },
  "secondary_cta": { "label": "", "href": "" },
  "height": "medium"
}'),
('00000000-0000-4000-8000-000000000002', 'text_image', 1, '{}', '{
  "eyebrow": "Our Story",
  "heading": "A decade of *dedication*.",
  "body": "<p>Since 2013, Sabdia Constructions has delivered more than one hundred residences across inner Brisbane. Every project begins with a deep understanding of both the site and the clients who will call it home.</p><p>Our integrated in-house model — design, develop, construct — maintains meticulous control over quality, timing, and innovation at every stage.</p>",
  "image": "https://static.wixstatic.com/media/1cc2db_4e48586f78704fc3ae5d00ddb8a125ee~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85/1cc2db_4e48586f78704fc3ae5d00ddb8a125ee~mv2.jpg",
  "image_alt": "Sabdia residence",
  "image_side": "right",
  "cta": { "label": "", "href": "" }
}'),
('00000000-0000-4000-8000-000000000002', 'stats', 2, '{"background":"dark"}', '{
  "items": [
    { "value": "2013", "suffix": "", "label": "Founded in Brisbane" },
    { "value": "100", "suffix": "+", "label": "Residences Delivered" },
    { "value": "5", "suffix": "★", "label": "Multi-Award Winning" }
  ]
}'),
('00000000-0000-4000-8000-000000000002', 'cta', 3, '{"align":"center"}', '{
  "heading": "Ready to create something *exceptional*?",
  "body": "",
  "cta": { "label": "Begin a Conversation", "href": "/contact" }
}');

-- ── Services sections ──────────────────────────────────────────────────
insert into public.sections (page_id, type, sort_order, config, content) values
('00000000-0000-4000-8000-000000000003', 'hero', 0, '{"spacing":"none","container":"full"}', '{
  "eyebrow": "What We Do",
  "heading": "Our *Services*",
  "subheading": "Every element, considered. From site acquisition through to final handover.",
  "image": "https://static.wixstatic.com/media/1cc2db_5186783e26c04be6ab983f26b9b78377~mv2.jpg/v1/fill/w_1920,h_1080,al_c,q_85/1cc2db_5186783e26c04be6ab983f26b9b78377~mv2.jpg",
  "image_alt": "Sabdia residence — SIERRA",
  "overlay": true,
  "primary_cta": { "label": "", "href": "" },
  "secondary_cta": { "label": "", "href": "" },
  "height": "medium"
}'),
('00000000-0000-4000-8000-000000000003', 'text_image', 1, '{}', '{
  "eyebrow": "01",
  "heading": "Luxury Residential *Design*",
  "body": "<p>Bespoke single residences and boutique developments designed for discerning clients. From architectural concept to interior finishing — every detail considered, nothing left to chance.</p>",
  "image": "https://static.wixstatic.com/media/1cc2db_f85ca82c83644534943559cb4b0067c9~mv2.png/v1/fill/w_1400,h_900,q_90,enc_avif,quality_auto/1cc2db_f85ca82c83644534943559cb4b0067c9~mv2.png",
  "image_alt": "Luxury residential design",
  "image_side": "right",
  "cta": { "label": "", "href": "" }
}'),
('00000000-0000-4000-8000-000000000003', 'text_image', 2, '{"background":"alt"}', '{
  "eyebrow": "02",
  "heading": "Development *Management*",
  "body": "<p>End-to-end residential development managed from vision to completion. Our integrated in-house model maintains meticulous control over quality, timing, and innovation throughout.</p>",
  "image": "https://static.wixstatic.com/media/1cc2db_74fc877fe2204d2a98e663d0c7df421b~mv2.png/v1/fill/w_900,h_560,fp_0.5_0.65,q_90,enc_avif,quality_auto/1cc2db_74fc877fe2204d2a98e663d0c7df421b~mv2.png",
  "image_alt": "Development management",
  "image_side": "left",
  "cta": { "label": "", "href": "" }
}'),
('00000000-0000-4000-8000-000000000003', 'text_image', 3, '{}', '{
  "eyebrow": "03",
  "heading": "Interior *Architecture*",
  "body": "<p>Integrated interior architecture that elevates every space. Our design team collaborates closely with builders to ensure perfect cohesion between vision and reality.</p>",
  "image": "https://static.wixstatic.com/media/1cc2db_62a0dd9b4ea14ac390c3e94abab03d56~mv2.png/v1/fill/w_900,h_680,fp_0.5_0.65,q_90,enc_avif,quality_auto/1cc2db_62a0dd9b4ea14ac390c3e94abab03d56~mv2.png",
  "image_alt": "Interior architecture",
  "image_side": "right",
  "cta": { "label": "", "href": "" }
}'),
('00000000-0000-4000-8000-000000000003', 'text_image', 4, '{"background":"alt"}', '{
  "eyebrow": "04",
  "heading": "Expert *Construction*",
  "body": "<p>Premium construction by master tradespeople. We use only the finest materials and proven methodologies — delivered with full transparency and precision at every stage.</p>",
  "image": "https://static.wixstatic.com/media/1cc2db_e8590ba3e20e4a3aa61c5fabafcae28b~mv2.png/v1/fill/w_800,h_500,q_85,enc_avif,quality_auto/1cc2db_e8590ba3e20e4a3aa61c5fabafcae28b~mv2.png",
  "image_alt": "Expert construction",
  "image_side": "left",
  "cta": { "label": "", "href": "" }
}'),
('00000000-0000-4000-8000-000000000003', 'cta', 5, '{"background":"dark","align":"center"}', '{
  "heading": "Ready to build something *exceptional*?",
  "body": "",
  "cta": { "label": "Begin a Conversation", "href": "/contact" }
}');

-- ── Properties (projects) sections ─────────────────────────────────────
insert into public.sections (page_id, type, sort_order, config, content) values
('00000000-0000-4000-8000-000000000004', 'hero', 0, '{"spacing":"none","container":"full"}', '{
  "eyebrow": "For Sale",
  "heading": "Current *Properties*",
  "subheading": "Luxury residences available now across inner Brisbane.",
  "image": "https://static.wixstatic.com/media/1cc2db_f85ca82c83644534943559cb4b0067c9~mv2.png/v1/fill/w_1400,h_900,q_90,enc_avif,quality_auto/1cc2db_f85ca82c83644534943559cb4b0067c9~mv2.png",
  "image_alt": "QASR, Coorparoo",
  "overlay": true,
  "primary_cta": { "label": "", "href": "" },
  "secondary_cta": { "label": "", "href": "" },
  "height": "medium"
}'),
('00000000-0000-4000-8000-000000000004', 'project_showcase', 1, '{}', '{
  "eyebrow": "Available Now",
  "heading": "For *Sale*",
  "source": "for_sale",
  "limit": 0,
  "cta": { "label": "", "href": "" }
}'),
('00000000-0000-4000-8000-000000000004', 'project_showcase', 2, '{"background":"alt"}', '{
  "eyebrow": "Recently Secured",
  "heading": "Sold prior to *completion*",
  "source": "sold",
  "limit": 0,
  "cta": { "label": "", "href": "" }
}'),
('00000000-0000-4000-8000-000000000004', 'cta', 3, '{"align":"center"}', '{
  "heading": "Ready to find your *home*?",
  "body": "Register your interest and our team will be in touch.",
  "cta": { "label": "Enquire Now", "href": "/contact" }
}');

-- ── Collection sections ────────────────────────────────────────────────
insert into public.sections (page_id, type, sort_order, config, content) values
('00000000-0000-4000-8000-000000000005', 'hero', 0, '{"spacing":"none","container":"full"}', '{
  "eyebrow": "Completed Works",
  "heading": "The Sabdia *Collection*",
  "subheading": "A portfolio of completed residences across inner Brisbane.",
  "image": "https://static.wixstatic.com/media/1cc2db_64f35b15dd914a189eee2aeb79b86284~mv2.jpg/v1/fill/w_1920,h_1080,al_c,q_85/1cc2db_64f35b15dd914a189eee2aeb79b86284~mv2.jpg",
  "image_alt": "Completed Sabdia residence",
  "overlay": true,
  "primary_cta": { "label": "", "href": "" },
  "secondary_cta": { "label": "", "href": "" },
  "height": "medium"
}'),
('00000000-0000-4000-8000-000000000005', 'project_showcase', 1, '{}', '{
  "eyebrow": "Portfolio",
  "heading": "Completed *Residences*",
  "source": "completed",
  "limit": 0,
  "cta": { "label": "", "href": "" }
}'),
('00000000-0000-4000-8000-000000000005', 'cta', 2, '{"background":"dark","align":"center"}', '{
  "heading": "Your residence could be *next*.",
  "body": "",
  "cta": { "label": "Begin a Conversation", "href": "/contact" }
}');

-- ── Contact sections ───────────────────────────────────────────────────
insert into public.sections (page_id, type, sort_order, config, content) values
('00000000-0000-4000-8000-000000000006', 'contact_form', 0, '{"spacing":"spacious"}', '{
  "eyebrow": "Get In Touch",
  "heading": "Let''s start a *conversation*.",
  "intro": "Please submit your contact information and one of our team members will be in touch with you shortly. We typically respond within one business day.",
  "interests": [
    { "label": "For Sale — Current Properties" },
    { "label": "Custom Home Design" },
    { "label": "Development Partnership" },
    { "label": "Agent Access" },
    { "label": "General Enquiry" }
  ],
  "success_message": "Thank you — we typically respond within one business day."
}'),
('00000000-0000-4000-8000-000000000006', 'map', 1, '{"spacing":"none","container":"full"}', '{
  "heading": "",
  "embed_url": "https://www.google.com/maps?q=Brisbane%20QLD%20Australia&output=embed",
  "height": 420
}');

-- ── Publish everything: snapshot sections → published_snapshot ─────────
update public.pages p set
  status = 'published',
  published_at = now(),
  published_snapshot = coalesce(
    (select jsonb_agg(to_jsonb(s) order by s.sort_order)
     from public.sections s where s.page_id = p.id),
    '[]'::jsonb
  );

insert into public.page_versions (page_id, snapshot, label)
select
  p.id,
  jsonb_build_object(
    'page', jsonb_build_object(
      'title', p.title, 'slug', p.slug, 'seo_title', p.seo_title,
      'seo_description', p.seo_description, 'og_image', p.og_image
    ),
    'sections', p.published_snapshot
  ),
  'Initial import'
from public.pages p;
