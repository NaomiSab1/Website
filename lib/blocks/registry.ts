import type { BlockType } from '@/lib/types';

/**
 * Field schema for the admin editor. Each block declares its editable
 * content fields here; the editor renders the matching input and the
 * values are stored in `sections.content` as JSON.
 */
export type FieldType =
  | 'text'
  | 'textarea'
  | 'richtext'
  | 'image'
  | 'link'
  | 'select'
  | 'number'
  | 'toggle'
  | 'repeater';

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  fields?: FieldDef[]; // for repeater rows
  help?: string;
}

export interface BlockDef {
  type: BlockType;
  label: string;
  description: string;
  adminOnly?: boolean; // only role=admin may add/edit (e.g. custom HTML)
  fields: FieldDef[];
  defaultContent: Record<string, unknown>;
}

const link = (key: string, label: string): FieldDef => ({
  key,
  label,
  type: 'link',
});

export const BLOCKS: Record<BlockType, BlockDef> = {
  hero: {
    type: 'hero',
    label: 'Hero',
    description: 'Full-width banner with headline, image and buttons',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { key: 'heading', label: 'Headline', type: 'textarea', help: 'Use *asterisks* for italic accent words' },
      { key: 'subheading', label: 'Subheading', type: 'textarea' },
      { key: 'image', label: 'Background image', type: 'image' },
      { key: 'image_alt', label: 'Image alt text', type: 'text' },
      { key: 'overlay', label: 'Dark overlay', type: 'toggle' },
      link('primary_cta', 'Primary button'),
      link('secondary_cta', 'Secondary button'),
      {
        key: 'height',
        label: 'Height',
        type: 'select',
        options: [
          { value: 'full', label: 'Full screen' },
          { value: 'large', label: 'Large' },
          { value: 'medium', label: 'Medium' },
        ],
      },
    ],
    defaultContent: {
      eyebrow: 'Boutique Luxury Builder & Developer · Brisbane',
      heading: 'Design. *Develop.* Construct.',
      subheading: '',
      image: '',
      image_alt: '',
      overlay: true,
      primary_cta: { label: 'View Properties', href: '/projects' },
      secondary_cta: { label: '', href: '' },
      height: 'full',
    },
  },

  gallery: {
    type: 'gallery',
    label: 'Image gallery',
    description: 'Grid of images with optional captions',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      {
        key: 'items',
        label: 'Images',
        type: 'repeater',
        fields: [
          { key: 'image', label: 'Image', type: 'image' },
          { key: 'alt', label: 'Alt text', type: 'text' },
          { key: 'caption', label: 'Caption', type: 'text' },
        ],
      },
    ],
    defaultContent: { heading: '', items: [] },
  },

  project_showcase: {
    type: 'project_showcase',
    label: 'Project showcase',
    description: 'Cards rendered from the project portfolio',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { key: 'heading', label: 'Heading', type: 'text' },
      {
        key: 'source',
        label: 'Show',
        type: 'select',
        options: [
          { value: 'all', label: 'All projects' },
          { value: 'for_sale', label: 'For sale' },
          { value: 'sold', label: 'Sold' },
          { value: 'completed', label: 'Completed collection' },
        ],
      },
      { key: 'limit', label: 'Max projects (0 = all)', type: 'number' },
      link('cta', 'Link below grid'),
    ],
    defaultContent: {
      eyebrow: 'For Sale',
      heading: 'Current Properties',
      source: 'for_sale',
      limit: 0,
      cta: { label: '', href: '' },
    },
  },

  text_image: {
    type: 'text_image',
    label: 'Text + image',
    description: 'Rich text beside an image',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'body', label: 'Body', type: 'richtext' },
      { key: 'image', label: 'Image', type: 'image' },
      { key: 'image_alt', label: 'Image alt text', type: 'text' },
      {
        key: 'image_side',
        label: 'Image position',
        type: 'select',
        options: [
          { value: 'right', label: 'Right' },
          { value: 'left', label: 'Left' },
        ],
      },
      link('cta', 'Button'),
    ],
    defaultContent: {
      eyebrow: '',
      heading: '',
      body: '<p></p>',
      image: '',
      image_alt: '',
      image_side: 'right',
      cta: { label: '', href: '' },
    },
  },

  testimonials: {
    type: 'testimonials',
    label: 'Testimonials',
    description: 'Client quotes',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      {
        key: 'items',
        label: 'Quotes',
        type: 'repeater',
        fields: [
          { key: 'quote', label: 'Quote', type: 'textarea' },
          { key: 'author', label: 'Attribution', type: 'text' },
        ],
      },
    ],
    defaultContent: { heading: '', items: [{ quote: '', author: '' }] },
  },

  stats: {
    type: 'stats',
    label: 'Stats band',
    description: 'Row of headline numbers',
    fields: [
      {
        key: 'items',
        label: 'Stats',
        type: 'repeater',
        fields: [
          { key: 'value', label: 'Number', type: 'text' },
          { key: 'suffix', label: 'Suffix (+, %, ★)', type: 'text' },
          { key: 'label', label: 'Label', type: 'text' },
        ],
      },
    ],
    defaultContent: { items: [{ value: '100', suffix: '+', label: 'Residences Delivered' }] },
  },

  contact_form: {
    type: 'contact_form',
    label: 'Contact form',
    description: 'Lead capture form (stored in Supabase + forwarded)',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'intro', label: 'Intro text', type: 'textarea' },
      {
        key: 'interests',
        label: 'Interest dropdown options',
        type: 'repeater',
        fields: [{ key: 'label', label: 'Option', type: 'text' }],
      },
      { key: 'success_message', label: 'Success message', type: 'text' },
    ],
    defaultContent: {
      eyebrow: 'Get In Touch',
      heading: "Let's start a conversation.",
      intro: 'Please submit your contact information and one of our team members will be in touch shortly.',
      interests: [
        { label: 'For Sale — Current Properties' },
        { label: 'Custom Home Design' },
        { label: 'Development Partnership' },
        { label: 'Agent Access' },
        { label: 'General Enquiry' },
      ],
      success_message: 'Thank you — we typically respond within one business day.',
    },
  },

  faq: {
    type: 'faq',
    label: 'FAQ',
    description: 'Expandable question & answer list',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      {
        key: 'items',
        label: 'Questions',
        type: 'repeater',
        fields: [
          { key: 'question', label: 'Question', type: 'text' },
          { key: 'answer', label: 'Answer', type: 'richtext' },
        ],
      },
    ],
    defaultContent: { heading: 'Frequently asked questions', items: [] },
  },

  cta: {
    type: 'cta',
    label: 'CTA banner',
    description: 'Call-to-action strip with button',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'body', label: 'Supporting text', type: 'textarea' },
      link('cta', 'Button'),
    ],
    defaultContent: {
      heading: 'Ready to create something exceptional?',
      body: '',
      cta: { label: 'Begin a Conversation', href: '/contact' },
    },
  },

  map: {
    type: 'map',
    label: 'Map',
    description: 'Embedded Google Map',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'embed_url', label: 'Google Maps embed URL', type: 'text', help: 'Google Maps → Share → Embed a map → copy the src URL' },
      { key: 'height', label: 'Height (px)', type: 'number' },
    ],
    defaultContent: { heading: '', embed_url: '', height: 420 },
  },

  video: {
    type: 'video',
    label: 'Video embed',
    description: 'YouTube or Vimeo video',
    fields: [
      { key: 'url', label: 'Video URL', type: 'text', help: 'YouTube or Vimeo page URL' },
      { key: 'caption', label: 'Caption', type: 'text' },
    ],
    defaultContent: { url: '', caption: '' },
  },

  custom_html: {
    type: 'custom_html',
    label: 'Custom HTML',
    description: 'Raw HTML (admins only)',
    adminOnly: true,
    fields: [{ key: 'html', label: 'HTML', type: 'textarea' }],
    defaultContent: { html: '' },
  },
};

export const BLOCK_TYPES = Object.keys(BLOCKS) as BlockType[];
