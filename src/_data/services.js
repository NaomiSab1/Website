const FALLBACK = [
  {
    id: 1,
    number: '01',
    title: 'Luxury Residential Design',
    short_description: 'Bespoke single residences and boutique developments designed for discerning clients. From architectural concept to interior finishing — every detail considered, nothing left to chance.',
    description_paragraphs: [
      'Our in-house architecture and design team creates residences that are as functional as they are breathtaking. We approach each project as a singular creative endeavour — absorbing the site\'s character, the client\'s aspirations, and the neighbourhood\'s context before a single line is drawn.',
      'The result is homes that feel inevitable — as though they could not have existed anywhere else, built for anyone else, or been conceived by any other studio.'
    ],
    deliverables: [
      'Architectural concept and schematic design',
      'Design development and documentation',
      'Planning approvals and DA management',
      'Landscape architecture',
      'Material and finishes specification',
      '3D visualisation and virtual walkthroughs'
    ],
    image: 'https://static.wixstatic.com/media/1cc2db_4e48586f78704fc3ae5d00ddb8a125ee~mv2.jpg/v1/fill/w_900,h_680,al_c,q_85/1cc2db_4e48586f78704fc3ae5d00ddb8a125ee~mv2.jpg',
    sort_order: 1
  },
  {
    id: 2,
    number: '02',
    title: 'Development Management',
    short_description: 'End-to-end residential development managed from vision to completion. Our integrated in-house model maintains meticulous control over quality, timing, and innovation throughout.',
    description_paragraphs: [
      'Development management is the complex art of orchestrating every moving part of a residential project — land acquisition, town planning, engineering, approvals, finance, sales, and delivery — into one coherent, high-performing whole.',
      'Sabdia handles this process entirely in-house. This means fewer delays, tighter budgets, faster approvals, and a development that performs as well on paper as it does in person.'
    ],
    deliverables: [
      'Site acquisition analysis and due diligence',
      'Feasibility modelling and investment structuring',
      'Town planning strategy and DA management',
      'Engineering and civil coordination',
      'Sales and marketing strategy',
      'Project reporting and stakeholder management'
    ],
    image: 'https://static.wixstatic.com/media/1cc2db_5186783e26c04be6ab983f26b9b78377~mv2.jpg/v1/fill/w_900,h_680,fp_0.5_0.65,q_90,enc_avif,quality_auto/1cc2db_5186783e26c04be6ab983f26b9b78377~mv2.jpg',
    sort_order: 2
  },
  {
    id: 3,
    number: '03',
    title: 'Interior Architecture',
    short_description: 'Integrated interior architecture that elevates every space. Our design team collaborates closely with builders to ensure perfect cohesion between vision and reality.',
    description_paragraphs: [
      'Our interior architecture division ensures that the lived experience of a Sabdia home is as extraordinary as its exterior presence. Working in close collaboration with the architecture team from day one, our interior architects shape spaces that are luminous, considered, and deeply personal.',
      'Every kitchen, bathroom, bedroom, and living space is designed as part of a holistic vision — where each room flows effortlessly into the next, and light, material, and proportion conspire to create homes that feel genuinely special.'
    ],
    deliverables: [
      'Interior concept and spatial design',
      'Custom joinery design and specification',
      'Material, finish, and hardware selection',
      'Lighting design and coordination',
      'FF&E procurement and styling',
      'Kitchen and bathroom design'
    ],
    image: 'https://static.wixstatic.com/media/1cc2db_62a0dd9b4ea14ac390c3e94abab03d56~mv2.png/v1/fill/w_900,h_680,fp_0.5_0.65,q_90,enc_avif,quality_auto/1cc2db_62a0dd9b4ea14ac390c3e94abab03d56~mv2.png',
    sort_order: 3
  },
  {
    id: 4,
    number: '04',
    title: 'Expert Construction',
    short_description: 'Premium construction by master tradespeople. We use only the finest materials and proven methodologies — delivered with full transparency and precision at every stage.',
    description_paragraphs: [
      'Sabdia\'s construction arm brings the vision to life with precision, skill, and an obsessive attention to detail. Our team of master tradespeople — many of whom have worked with Sabdia for years — share our commitment to doing everything properly.',
      'We use only the finest materials, source from trusted suppliers, and never cut corners. The result is a home that not only looks extraordinary on the day of handover, but continues to perform to the highest standard for decades to come.'
    ],
    deliverables: [
      'Full residential construction management',
      'Premium material sourcing and procurement',
      'Master tradesperson coordination',
      'Quality assurance and defect management',
      'Client reporting and site access',
      'Post-completion aftercare and warranty'
    ],
    image: 'https://static.wixstatic.com/media/1cc2db_74fc877fe2204d2a98e663d0c7df421b~mv2.png/v1/fill/w_900,h_680,fp_0.5_0.65,q_90,enc_avif,quality_auto/1cc2db_74fc877fe2204d2a98e663d0c7df421b~mv2.png',
    sort_order: 4
  }
];

module.exports = async function () {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) return FALLBACK;
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    const { data, error } = await supabase.from('services').select('*').order('sort_order');
    if (error) throw error;
    return data && data.length > 0 ? data : FALLBACK;
  } catch (err) {
    console.warn('[services] Supabase fetch failed, using fallback:', err.message);
    return FALLBACK;
  }
};
