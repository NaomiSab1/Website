const { createClient } = require('@supabase/supabase-js');

const FALLBACK = [
  {
    slug: 'qasr',
    name: 'QASR',
    location: 'Coorparoo, Queensland',
    suburb: 'Coorparoo',
    state: 'QLD',
    status: 'for_sale',
    bedrooms: 5,
    bathrooms: 7,
    garages: 9,
    land_size: '1000+m²',
    price_guide: '',
    hero_image: 'https://static.wixstatic.com/media/1cc2db_f85ca82c83644534943559cb4b0067c9~mv2.png/v1/fill/w_1920,h_1080,q_90,enc_avif,quality_auto/1cc2db_f85ca82c83644534943559cb4b0067c9~mv2.png',
    card_image: 'https://static.wixstatic.com/media/1cc2db_f85ca82c83644534943559cb4b0067c9~mv2.png/v1/fill/w_1400,h_900,q_90,enc_avif,quality_auto/1cc2db_f85ca82c83644534943559cb4b0067c9~mv2.png',
    card_image_sm: 'https://static.wixstatic.com/media/1cc2db_f85ca82c83644534943559cb4b0067c9~mv2.png/v1/fill/w_900,h_680,fp_0.5_0.65,q_90,enc_avif,quality_auto/1cc2db_f85ca82c83644534943559cb4b0067c9~mv2.png',
    tagline: 'A palace for<br><em>the extraordinary life</em>.',
    description_paragraphs: [
      'QASR is Sabdia\'s most ambitious and extraordinary achievement. A masterwork of contemporary residential architecture positioned in one of Coorparoo\'s most coveted streets, QASR redefines what is possible in Brisbane luxury living. Every element of this extraordinary residence has been considered with an obsessive eye for detail — from the sweeping open-plan living and dining zones bathed in natural light, to the nine-car garage that rivals the finest private automotive collections.',
      'The name QASR, derived from the Arabic for \'palace\', is a fitting moniker for a home of this magnitude. Its commanding street presence is merely the prologue to an interior of breathtaking scale and sophistication — spaces that have been composed with the precision of a master architect and the warmth of a consummate host. Natural stone, hand-selected timbers, and bespoke joinery converge to create an environment of singular beauty.',
      'Five bedrooms, including a master suite of breathtaking proportion, seven bathrooms, a resort-style pool and entertaining pavilion, a private cinema, and a wine cellar combine to create a residence without equal in Brisbane. This is not simply a home — it is a declaration of what is possible when vision, craftsmanship, and ambition are brought together without compromise.'
    ],
    features: ['Home Cinema', 'Resort Pool & Spa', 'Nine-Car Garage', 'Private Wine Cellar', 'Master Suite with Dressing Room', 'Chef\'s Kitchen', 'Outdoor Entertaining Pavilion', 'Smart Home Automation', 'Lift Access', 'Gym & Wellness Studio', 'Study / Home Office', 'Multiple Living Zones'],
    gallery_images: [
      { url: 'https://static.wixstatic.com/media/1cc2db_f85ca82c83644534943559cb4b0067c9~mv2.png/v1/fill/w_1200,h_1600,q_90,enc_avif,quality_auto/1cc2db_f85ca82c83644534943559cb4b0067c9~mv2.png', alt: 'QASR Exterior' },
      { url: 'https://static.wixstatic.com/media/1cc2db_4e48586f78704fc3ae5d00ddb8a125ee~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85/1cc2db_4e48586f78704fc3ae5d00ddb8a125ee~mv2.jpg', alt: 'QASR Interior' },
      { url: 'https://static.wixstatic.com/media/1cc2db_9e730867446c414c9fe72c1549cb7261~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85/1cc2db_9e730867446c414c9fe72c1549cb7261~mv2.jpg', alt: 'QASR Living' },
      { url: 'https://static.wixstatic.com/media/1cc2db_f85ca82c83644534943559cb4b0067c9~mv2.png/v1/fill/w_700,h_400,fp_0.3_0.5,q_85,enc_avif,quality_auto/1cc2db_f85ca82c83644534943559cb4b0067c9~mv2.png', alt: 'QASR Detail' },
      { url: 'https://static.wixstatic.com/media/1cc2db_f85ca82c83644534943559cb4b0067c9~mv2.png/v1/fill/w_700,h_400,fp_0.6_0.4,q_85,enc_avif,quality_auto/1cc2db_f85ca82c83644534943559cb4b0067c9~mv2.png', alt: 'QASR Exterior' },
      { url: 'https://static.wixstatic.com/media/1cc2db_f85ca82c83644534943559cb4b0067c9~mv2.png/v1/fill/w_700,h_400,fp_0.5_0.7,q_85,enc_avif,quality_auto/1cc2db_f85ca82c83644534943559cb4b0067c9~mv2.png', alt: 'QASR Pool' }
    ],
    is_featured: true,
    sort_order: 1,
    seo_title: 'QASR | Sabdia Constructions',
    seo_description: 'QASR by Sabdia Constructions — a masterwork of contemporary residential architecture in Coorparoo, Queensland. Five bedrooms, seven bathrooms, nine-car garage.'
  },
  {
    slug: 'solace',
    name: 'SOLACE',
    location: 'Camp Hill, Queensland',
    suburb: 'Camp Hill',
    state: 'QLD',
    status: 'for_sale',
    bedrooms: 5,
    bathrooms: 5,
    garages: 4,
    land_size: '632m²',
    price_guide: '',
    hero_image: 'https://static.wixstatic.com/media/1cc2db_5186783e26c04be6ab983f26b9b78377~mv2.jpg/v1/fill/w_1920,h_1080,al_c,q_85/1cc2db_5186783e26c04be6ab983f26b9b78377~mv2.jpg',
    card_image: 'https://static.wixstatic.com/media/1cc2db_5186783e26c04be6ab983f26b9b78377~mv2.jpg/v1/fill/w_900,h_680,fp_0.5_0.65,q_90,enc_avif,quality_auto/1cc2db_5186783e26c04be6ab983f26b9b78377~mv2.jpg',
    card_image_sm: 'https://static.wixstatic.com/media/1cc2db_5186783e26c04be6ab983f26b9b78377~mv2.jpg/v1/fill/w_900,h_562,fp_0.5_0.65,q_90,enc_avif,quality_auto/1cc2db_5186783e26c04be6ab983f26b9b78377~mv2.jpg',
    tagline: 'Where <em>calm</em><br>meets craftsmanship.',
    description_paragraphs: [
      'SOLACE is a study in refined contemporary living — a home conceived to provide sanctuary from the world whilst delivering every luxury its residents could desire. Set on a generous 632m² in the heart of Camp Hill, this exceptional five-bedroom residence offers a seamless connection between indoor and outdoor living that is rarely achieved at this standard.',
      'The architectural language of SOLACE is one of considered restraint — where every material choice, every spatial decision, and every detail has been made in service of a home that feels genuinely restorative. The result is a residence of extraordinary calm and beauty that rewards daily life in equal measure.',
      'Five generously proportioned bedrooms, five bathrooms finished in natural stone and bespoke joinery, and four-car accommodation combine with exceptional outdoor entertaining spaces to create a home perfectly calibrated for family life at the highest level.'
    ],
    features: ['Resort-style Pool', 'Open-plan Living & Dining', 'Four-Car Garage', 'Chef\'s Kitchen', 'Master Suite with Walk-in Wardrobe', 'Outdoor Entertaining Area', 'Home Theatre', 'Study', 'Smart Home System', 'Landscaped Gardens'],
    gallery_images: [
      { url: 'https://static.wixstatic.com/media/1cc2db_5186783e26c04be6ab983f26b9b78377~mv2.jpg/v1/fill/w_1200,h_1600,q_90,enc_avif,quality_auto/1cc2db_5186783e26c04be6ab983f26b9b78377~mv2.jpg', alt: 'SOLACE Exterior' },
      { url: 'https://static.wixstatic.com/media/1cc2db_4e48586f78704fc3ae5d00ddb8a125ee~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85/1cc2db_4e48586f78704fc3ae5d00ddb8a125ee~mv2.jpg', alt: 'SOLACE Interior' },
      { url: 'https://static.wixstatic.com/media/1cc2db_9e730867446c414c9fe72c1549cb7261~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85/1cc2db_9e730867446c414c9fe72c1549cb7261~mv2.jpg', alt: 'SOLACE Living' },
      { url: 'https://static.wixstatic.com/media/1cc2db_5186783e26c04be6ab983f26b9b78377~mv2.jpg/v1/fill/w_700,h_400,fp_0.3_0.5,q_85,enc_avif,quality_auto/1cc2db_5186783e26c04be6ab983f26b9b78377~mv2.jpg', alt: 'SOLACE Detail' },
      { url: 'https://static.wixstatic.com/media/1cc2db_5186783e26c04be6ab983f26b9b78377~mv2.jpg/v1/fill/w_700,h_400,fp_0.6_0.4,q_85,enc_avif,quality_auto/1cc2db_5186783e26c04be6ab983f26b9b78377~mv2.jpg', alt: 'SOLACE Exterior' },
      { url: 'https://static.wixstatic.com/media/1cc2db_5186783e26c04be6ab983f26b9b78377~mv2.jpg/v1/fill/w_700,h_400,fp_0.5_0.7,q_85,enc_avif,quality_auto/1cc2db_5186783e26c04be6ab983f26b9b78377~mv2.jpg', alt: 'SOLACE Pool' }
    ],
    is_featured: false,
    sort_order: 2,
    seo_title: 'SOLACE | Sabdia Constructions',
    seo_description: 'SOLACE by Sabdia Constructions — a sanctuary of refined contemporary living in Camp Hill, Queensland. Five bedrooms, five bathrooms, four-car garage.'
  },
  {
    slug: 'sierra',
    name: 'SIERRA',
    location: 'Holland Park West, Queensland',
    suburb: 'Holland Park West',
    state: 'QLD',
    status: 'for_sale',
    bedrooms: 5,
    bathrooms: 5,
    garages: 3,
    land_size: '573m²',
    price_guide: '',
    hero_image: 'https://static.wixstatic.com/media/1cc2db_62a0dd9b4ea14ac390c3e94abab03d56~mv2.png/v1/fill/w_1920,h_1080,q_90,enc_avif,quality_auto/1cc2db_62a0dd9b4ea14ac390c3e94abab03d56~mv2.png',
    card_image: 'https://static.wixstatic.com/media/1cc2db_62a0dd9b4ea14ac390c3e94abab03d56~mv2.png/v1/fill/w_900,h_680,fp_0.5_0.65,q_90,enc_avif,quality_auto/1cc2db_62a0dd9b4ea14ac390c3e94abab03d56~mv2.png',
    card_image_sm: 'https://static.wixstatic.com/media/1cc2db_62a0dd9b4ea14ac390c3e94abab03d56~mv2.png/v1/fill/w_900,h_562,fp_0.5_0.65,q_90,enc_avif,quality_auto/1cc2db_62a0dd9b4ea14ac390c3e94abab03d56~mv2.png',
    tagline: 'Bold design.<br><em>Elevated living.</em>',
    description_paragraphs: [
      'SIERRA is a bold architectural statement — a contemporary residence of commanding presence and exceptional quality that sets a new standard for luxury living in Holland Park West. Rising from a generous 573m² with confident geometry and an unwavering commitment to premium materials, SIERRA is designed for those who refuse to compromise.',
      'The interior of SIERRA unfolds across multiple levels of light-filled, beautifully proportioned living spaces — each conceived with the same architectural vision that defines the exterior. Five bedrooms, five stone-clad bathrooms, and three-car accommodation are arranged to maximise both functionality and delight.',
      'The outdoor living and pool zone of SIERRA is a masterclass in residential entertaining — a seamlessly connected environment that extends the interior\'s luxury vocabulary into the landscape, creating a private resort experience within one of Brisbane\'s most sought-after inner suburbs.'
    ],
    features: ['Heated Pool & Spa', 'Triple-Car Garage', 'Gourmet Kitchen', 'Alfresco Dining & BBQ', 'Master Suite with Ensuite', 'Multiple Living Zones', 'Study / Home Office', 'Smart Home Integration', 'Natural Stone Bathrooms', 'Bespoke Joinery Throughout'],
    gallery_images: [
      { url: 'https://static.wixstatic.com/media/1cc2db_62a0dd9b4ea14ac390c3e94abab03d56~mv2.png/v1/fill/w_1200,h_1600,q_90,enc_avif,quality_auto/1cc2db_62a0dd9b4ea14ac390c3e94abab03d56~mv2.png', alt: 'SIERRA Exterior' },
      { url: 'https://static.wixstatic.com/media/1cc2db_4e48586f78704fc3ae5d00ddb8a125ee~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85/1cc2db_4e48586f78704fc3ae5d00ddb8a125ee~mv2.jpg', alt: 'SIERRA Interior' },
      { url: 'https://static.wixstatic.com/media/1cc2db_9e730867446c414c9fe72c1549cb7261~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85/1cc2db_9e730867446c414c9fe72c1549cb7261~mv2.jpg', alt: 'SIERRA Living' },
      { url: 'https://static.wixstatic.com/media/1cc2db_62a0dd9b4ea14ac390c3e94abab03d56~mv2.png/v1/fill/w_700,h_400,fp_0.3_0.5,q_85,enc_avif,quality_auto/1cc2db_62a0dd9b4ea14ac390c3e94abab03d56~mv2.png', alt: 'SIERRA Detail' },
      { url: 'https://static.wixstatic.com/media/1cc2db_62a0dd9b4ea14ac390c3e94abab03d56~mv2.png/v1/fill/w_700,h_400,fp_0.6_0.4,q_85,enc_avif,quality_auto/1cc2db_62a0dd9b4ea14ac390c3e94abab03d56~mv2.png', alt: 'SIERRA Pool' },
      { url: 'https://static.wixstatic.com/media/1cc2db_62a0dd9b4ea14ac390c3e94abab03d56~mv2.png/v1/fill/w_700,h_400,fp_0.5_0.7,q_85,enc_avif,quality_auto/1cc2db_62a0dd9b4ea14ac390c3e94abab03d56~mv2.png', alt: 'SIERRA Terrace' }
    ],
    is_featured: false,
    sort_order: 3,
    seo_title: 'SIERRA | Sabdia Constructions',
    seo_description: 'SIERRA by Sabdia Constructions — a bold contemporary residence in Holland Park West, Queensland. Five bedrooms, five bathrooms, triple-car garage.'
  },
  {
    slug: 'caspian',
    name: 'CASPIAN',
    location: 'Ascot, Queensland',
    suburb: 'Ascot',
    state: 'QLD',
    status: 'for_sale',
    bedrooms: 5,
    bathrooms: 5,
    garages: 3,
    land_size: '544m²',
    price_guide: '',
    hero_image: 'https://static.wixstatic.com/media/1cc2db_74fc877fe2204d2a98e663d0c7df421b~mv2.png/v1/fill/w_1920,h_1080,q_90,enc_avif,quality_auto/1cc2db_74fc877fe2204d2a98e663d0c7df421b~mv2.png',
    card_image: 'https://static.wixstatic.com/media/1cc2db_74fc877fe2204d2a98e663d0c7df421b~mv2.png/v1/fill/w_900,h_560,fp_0.5_0.65,q_90,enc_avif,quality_auto/1cc2db_74fc877fe2204d2a98e663d0c7df421b~mv2.png',
    card_image_sm: 'https://static.wixstatic.com/media/1cc2db_74fc877fe2204d2a98e663d0c7df421b~mv2.png/v1/fill/w_900,h_562,fp_0.5_0.65,q_90,enc_avif,quality_auto/1cc2db_74fc877fe2204d2a98e663d0c7df421b~mv2.png',
    tagline: 'Prestige redefined<br>in <em>Ascot</em>.',
    description_paragraphs: [
      'CASPIAN occupies one of Ascot\'s most prestigious addresses — a home of exceptional calibre designed to complement and elevate one of Brisbane\'s most coveted inner suburbs. Its architecture speaks with quiet confidence, commanding its site with understated authority whilst offering an interior of breathtaking richness and detail.',
      'Inside, CASPIAN reveals a masterfully choreographed sequence of living spaces — from the entry gallery that signals the quality to come, through to the vast open-plan living and dining zone that forms the heart of the home. Five bedrooms, five luxuriously appointed bathrooms, and three-car accommodation are arranged with the precision of a seasoned architect.',
      'The outdoor living zone of CASPIAN is a private resort experience — a pool and entertaining pavilion of the highest standard, designed to make the Brisbane lifestyle its own. This is a home for discerning buyers who understand the difference between luxury and exceptional luxury.'
    ],
    features: ['Resort Pool & Entertainment Pavilion', 'Triple-Car Garage', 'Open-plan Living & Dining', 'Chef\'s Kitchen with Butler\'s Pantry', 'Master Suite with Dressing Room', 'Home Cinema', 'Study', 'Smart Home System', 'Natural Stone Throughout', 'Custom Joinery'],
    gallery_images: [
      { url: 'https://static.wixstatic.com/media/1cc2db_74fc877fe2204d2a98e663d0c7df421b~mv2.png/v1/fill/w_1200,h_1600,q_90,enc_avif,quality_auto/1cc2db_74fc877fe2204d2a98e663d0c7df421b~mv2.png', alt: 'CASPIAN Exterior' },
      { url: 'https://static.wixstatic.com/media/1cc2db_4e48586f78704fc3ae5d00ddb8a125ee~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85/1cc2db_4e48586f78704fc3ae5d00ddb8a125ee~mv2.jpg', alt: 'CASPIAN Interior' },
      { url: 'https://static.wixstatic.com/media/1cc2db_9e730867446c414c9fe72c1549cb7261~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85/1cc2db_9e730867446c414c9fe72c1549cb7261~mv2.jpg', alt: 'CASPIAN Living' },
      { url: 'https://static.wixstatic.com/media/1cc2db_74fc877fe2204d2a98e663d0c7df421b~mv2.png/v1/fill/w_700,h_400,fp_0.3_0.5,q_85,enc_avif,quality_auto/1cc2db_74fc877fe2204d2a98e663d0c7df421b~mv2.png', alt: 'CASPIAN Pool' },
      { url: 'https://static.wixstatic.com/media/1cc2db_74fc877fe2204d2a98e663d0c7df421b~mv2.png/v1/fill/w_700,h_400,fp_0.6_0.4,q_85,enc_avif,quality_auto/1cc2db_74fc877fe2204d2a98e663d0c7df421b~mv2.png', alt: 'CASPIAN Detail' },
      { url: 'https://static.wixstatic.com/media/1cc2db_74fc877fe2204d2a98e663d0c7df421b~mv2.png/v1/fill/w_700,h_400,fp_0.5_0.7,q_85,enc_avif,quality_auto/1cc2db_74fc877fe2204d2a98e663d0c7df421b~mv2.png', alt: 'CASPIAN Terrace' }
    ],
    is_featured: false,
    sort_order: 4,
    seo_title: 'CASPIAN | Sabdia Constructions',
    seo_description: 'CASPIAN by Sabdia Constructions — prestige redefined in Ascot, Queensland. Five bedrooms, five bathrooms, triple-car garage, resort pool.'
  },
  {
    slug: 'capri',
    name: 'CAPRI',
    location: 'Coorparoo, Queensland',
    suburb: 'Coorparoo',
    state: 'QLD',
    status: 'sold',
    bedrooms: 5,
    bathrooms: 5,
    garages: 3,
    land_size: '545m²',
    price_guide: '',
    hero_image: 'https://static.wixstatic.com/media/1cc2db_e8590ba3e20e4a3aa61c5fabafcae28b~mv2.png/v1/fill/w_1920,h_1080,q_90,enc_avif,quality_auto/1cc2db_e8590ba3e20e4a3aa61c5fabafcae28b~mv2.png',
    card_image: 'https://static.wixstatic.com/media/1cc2db_e8590ba3e20e4a3aa61c5fabafcae28b~mv2.png/v1/fill/w_900,h_560,q_85,enc_avif,quality_auto/1cc2db_e8590ba3e20e4a3aa61c5fabafcae28b~mv2.png',
    card_image_sm: 'https://static.wixstatic.com/media/1cc2db_e8590ba3e20e4a3aa61c5fabafcae28b~mv2.png/v1/fill/w_800,h_500,q_85,enc_avif,quality_auto/1cc2db_e8590ba3e20e4a3aa61c5fabafcae28b~mv2.png',
    tagline: 'Sold <em>prior to completion</em>.',
    description_paragraphs: [
      'CAPRI represented a defining moment in Sabdia\'s portfolio — a residence of exceptional refinement that was sold prior to completion, testament to the confidence the market places in the Sabdia name and the quality of every residence we deliver.',
      'Set in sought-after Coorparoo, CAPRI embodied the Sabdia philosophy of integrated design and construction — every material considered, every space perfectly proportioned, every detail executed with precision. The five-bedroom, five-bathroom layout achieved a masterful balance of scale and intimacy.',
      'CAPRI\'s legacy lives on in every subsequent Sabdia project — the lessons learned, the standards set, and the benchmark it created for luxury residential development in inner Brisbane.'
    ],
    features: ['Resort Pool', 'Triple-Car Garage', 'Open-plan Living', 'Gourmet Kitchen', 'Master Suite', 'Outdoor Entertaining', 'Home Cinema', 'Smart Home System'],
    gallery_images: [
      { url: 'https://static.wixstatic.com/media/1cc2db_e8590ba3e20e4a3aa61c5fabafcae28b~mv2.png/v1/fill/w_1200,h_1600,q_90,enc_avif,quality_auto/1cc2db_e8590ba3e20e4a3aa61c5fabafcae28b~mv2.png', alt: 'CAPRI Exterior' },
      { url: 'https://static.wixstatic.com/media/1cc2db_4e48586f78704fc3ae5d00ddb8a125ee~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85/1cc2db_4e48586f78704fc3ae5d00ddb8a125ee~mv2.jpg', alt: 'CAPRI Interior' },
      { url: 'https://static.wixstatic.com/media/1cc2db_9e730867446c414c9fe72c1549cb7261~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85/1cc2db_9e730867446c414c9fe72c1549cb7261~mv2.jpg', alt: 'CAPRI Living' }
    ],
    is_featured: false,
    sort_order: 5,
    seo_title: 'CAPRI | Sabdia Constructions',
    seo_description: 'CAPRI by Sabdia Constructions — sold prior to completion. A luxury five-bedroom residence in Coorparoo, Queensland.'
  },
  {
    slug: 'aether',
    name: 'AETHER',
    location: 'Hendra, Queensland',
    suburb: 'Hendra',
    state: 'QLD',
    status: 'sold',
    bedrooms: 5,
    bathrooms: 5,
    garages: 3,
    land_size: '572m²',
    price_guide: '',
    hero_image: 'https://static.wixstatic.com/media/1cc2db_7d5ad42861414a26bf1236edfa6e4603~mv2.png/v1/fill/w_1920,h_1080,q_90,enc_avif,quality_auto/1cc2db_7d5ad42861414a26bf1236edfa6e4603~mv2.png',
    card_image: 'https://static.wixstatic.com/media/1cc2db_7d5ad42861414a26bf1236edfa6e4603~mv2.png/v1/fill/w_900,h_560,q_85,enc_avif,quality_auto/1cc2db_7d5ad42861414a26bf1236edfa6e4603~mv2.png',
    card_image_sm: 'https://static.wixstatic.com/media/1cc2db_7d5ad42861414a26bf1236edfa6e4603~mv2.png/v1/fill/w_800,h_500,q_85,enc_avif,quality_auto/1cc2db_7d5ad42861414a26bf1236edfa6e4603~mv2.png',
    tagline: 'Light, space, and<br><em>elevated living</em>.',
    description_paragraphs: [
      'AETHER was a residence conceived around light — a home that captured and celebrated the extraordinary Brisbane sunshine in every space, at every hour. Set in prestigious Hendra on a generous 572m², AETHER was sold prior to completion, a reflection of the market\'s unwavering appetite for Sabdia\'s brand of architectural excellence.',
      'The name AETHER, evoking the upper sky and the element of light itself, perfectly described a home of luminous beauty — where soaring ceiling heights, expansive glazing, and a masterfully considered spatial sequence combined to create an interior that felt both monumental and deeply personal.',
      'Five bedrooms, five beautifully appointed bathrooms, and three-car accommodation were delivered with the uncompromising quality that defines every Sabdia residence. AETHER joined the growing collection of Sabdia homes that have set the standard for luxury living across inner Brisbane.'
    ],
    features: ['Resort Pool', 'Triple-Car Garage', 'Soaring Ceiling Heights', 'Expansive Glazing', 'Gourmet Kitchen', 'Master Suite', 'Outdoor Entertaining', 'Smart Home System'],
    gallery_images: [
      { url: 'https://static.wixstatic.com/media/1cc2db_7d5ad42861414a26bf1236edfa6e4603~mv2.png/v1/fill/w_1200,h_1600,q_90,enc_avif,quality_auto/1cc2db_7d5ad42861414a26bf1236edfa6e4603~mv2.png', alt: 'AETHER Exterior' },
      { url: 'https://static.wixstatic.com/media/1cc2db_4e48586f78704fc3ae5d00ddb8a125ee~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85/1cc2db_4e48586f78704fc3ae5d00ddb8a125ee~mv2.jpg', alt: 'AETHER Interior' },
      { url: 'https://static.wixstatic.com/media/1cc2db_9e730867446c414c9fe72c1549cb7261~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85/1cc2db_9e730867446c414c9fe72c1549cb7261~mv2.jpg', alt: 'AETHER Living' }
    ],
    is_featured: false,
    sort_order: 6,
    seo_title: 'AETHER | Sabdia Constructions',
    seo_description: 'AETHER by Sabdia Constructions — sold prior to completion. A luminous five-bedroom luxury residence in Hendra, Queensland.'
  }
];

module.exports = async function () {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    return FALLBACK;
  }
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data && data.length > 0 ? data : FALLBACK;
  } catch (err) {
    console.warn('[properties] Supabase fetch failed, using fallback:', err.message);
    return FALLBACK;
  }
};
