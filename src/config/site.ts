/**
 * Single source of truth for copy, links and colors.
 * Edit this file to change text, contact links or palette.
 * Anything marked PLACEHOLDER must be confirmed before launch.
 */

export const links = {
  // Public contact address. Other contact details below stay placeholders until confirmed.
  email: "shweeplan@gmail.com",
  // PLACEHOLDER: confirm the Instagram handle.
  instagramHandle: "shwyystudio",
  instagram: "https://instagram.com/shwyystudio",
  instagramDm: "https://ig.me/m/shwyystudio",
  // PLACEHOLDER: replace with the real LinkedIn page URL.
  linkedin: "https://www.linkedin.com/company/PLACEHOLDER-shwy-studio",
} as const;

export const colors = {
  papyrus: "#F4EBD9",
  sand: "#E8D5B0",
  sandstone: "#D4B483",
  brown: "#5A3A22",
  ink: "#2B1A0E",
  night: "#120B07",
  gold: "#C9973E",
  goldLight: "#EBC77E",
  lapis: "#1E3A72",
  turquoise: "#2A9D96",
  carnelian: "#B2432D",
} as const;

export const brand = {
  name: "SHWY Studio",
  wordmark: "shwy",
  label: "Freelance · Web Studio",
  tagline: "Build. Design. Rank.",
  description:
    "SHWY Studio builds online stores and brings them customers. One team, from idea to steady sales.",
} as const;

export const hero = {
  eyebrow: "Freelance · Web Studio",
  headline: ["Build.", "Get traffic.", "Sell.", "Grow."],
  pitch: "We build online stores and bring them customers. One team, from idea to steady sales.",
  primary: "Start a project",
  secondary: "See what we do",
} as const;

export type ServiceItem = { title: string; body: string; glyph: GlyphName };
export type GlyphName =
  | "obelisk" | "pyramid" | "column" | "ankh" | "scarab" | "sun" | "eye" | "lotus"
  | "reed" | "scale" | "scroll" | "gate" | "bird" | "water" | "star" | "cartouche";

export type ChapterId = "build" | "traffic" | "sell" | "grow" | "reports" | "who" | "start";

export type Chapter = {
  id: ChapterId;
  numeral: string;
  title: string;
  kicker: string;
  intro: string;
  items: ServiceItem[];
};

export const chapters: Chapter[] = [
  {
    id: "build",
    numeral: "I",
    title: "Build",
    kicker: "Raise the temple",
    intro: "Your store, built block by block. Fast, clean and ready to sell from day one.",
    items: [
      {
        title: "Online stores and websites from scratch",
        body: "Custom builds on Next.js and Vercel, or on Shopify and other store platforms.",
        glyph: "obelisk",
      },
      {
        title: "Products, payments, shipping, checkout",
        body: "We set up your products, payments, shipping and checkout so orders just work.",
        glyph: "cartouche",
      },
      {
        title: "Landing pages for ads",
        body: "Focused pages made for one job: turning ad clicks into orders.",
        glyph: "gate",
      },
      {
        title: "Brand kits",
        body: "Logo, colors and type that make your brand look like itself everywhere.",
        glyph: "lotus",
      },
    ],
  },
  {
    id: "traffic",
    numeral: "II",
    title: "Get traffic",
    kicker: "Bring the caravans",
    intro: "A great store needs visitors. We bring the right people to the gate.",
    items: [
      {
        title: "Ads on Meta, TikTok and Google",
        body: "Facebook and Instagram, TikTok and Google. Audiences, budgets, testing and scaling.",
        glyph: "sun",
      },
      {
        title: "SEO",
        body: "Get found on search, so people arrive without you paying for every click.",
        glyph: "eye",
      },
      {
        title: "Monthly content plans and video scripts",
        body: "A clear plan for what to post each month, plus scripts for your videos.",
        glyph: "scroll",
      },
    ],
  },
  {
    id: "sell",
    numeral: "III",
    title: "Sell",
    kicker: "Weigh every visit",
    intro: "Visits are good. Orders are better. We find what is in the way and remove it.",
    items: [
      {
        title: "Tracking setup",
        body: "Meta Pixel and GA4, set up properly so you know what is working.",
        glyph: "eye",
      },
      {
        title: "Fixing pages that get visits but no orders",
        body: "We find where people drop off and fix the page so they buy.",
        glyph: "scale",
      },
      {
        title: "Sales copy in Arabic and English",
        body: "Words that sell, written for your customers in both languages.",
        glyph: "reed",
      },
    ],
  },
  {
    id: "grow",
    numeral: "IV",
    title: "Grow",
    kicker: "Let the river rise",
    intro: "Turn one order into many. Automations that keep customers coming back while you sleep.",
    items: [
      {
        title: "Automated emails",
        body: "Welcome, abandoned cart, back in stock and launch emails that send themselves.",
        glyph: "bird",
      },
      {
        title: "WhatsApp broadcasts",
        body: "Reach your customers where they already talk.",
        glyph: "water",
      },
      {
        title: "Instagram comment-to-DM automation",
        body: "Someone comments a keyword on a post. The bot DMs them instantly and replies under the comment.",
        glyph: "ankh",
      },
      {
        title: "Product launches and drops",
        body: "Plan, build up and launch new products so they land with a bang.",
        glyph: "star",
      },
      {
        title: "AI phone caller (voice agent)",
        body: "Answers calls, books appointments, answers common questions and handles most things an AI chat responder can do.",
        glyph: "scarab",
      },
    ],
  },
  {
    id: "reports",
    numeral: "V",
    title: "Reports",
    kicker: "The scribe keeps count",
    intro: "Simple monthly reports. No jargon, just the numbers that matter.",
    items: [
      { title: "Sales", body: "What sold, and how much.", glyph: "cartouche" },
      { title: "Cost per order", body: "What each order cost you in ads.", glyph: "scale" },
      { title: "Return on ad spend", body: "What every unit spent on ads brought back.", glyph: "sun" },
    ],
  },
  {
    id: "who",
    numeral: "VI",
    title: "Who it's for",
    kicker: "Open to every trader",
    intro: "Built for brands that are ready to sell properly online.",
    items: [
      {
        title: "Brands selling on Instagram or WhatsApp",
        body: "You sell through DMs and chats but have no real store yet.",
        glyph: "bird",
      },
      {
        title: "Startups",
        body: "You need a site, a brand and ads, all at once, from one team.",
        glyph: "pyramid",
      },
      {
        title: "Local businesses",
        body: "Clothing, restaurants, cafés, clinics and real estate.",
        glyph: "column",
      },
    ],
  },
  {
    id: "start",
    numeral: "VII",
    title: "How we work",
    kicker: "Start a project",
    intro: "Top quality. Fast delivery. Fair prices. One team.",
    items: [],
  },
];

export const howWeWork = {
  promises: [
    { title: "Top quality", body: "Work we are proud to put our name on." },
    { title: "Fast delivery", body: "Clear timelines, and we keep them." },
    { title: "Fair prices", body: "Quoted for your project, not from a fixed menu." },
    { title: "One team", body: "From idea to steady sales, no hand-offs." },
  ],
  howWeStart:
    "Tell us your business, your products, your deadline and your budget. Then we quote.",
  languages: "We work in English and Arabic.",
} as const;

export const commentDemo = {
  // Illustration only. Not a real account or real conversation.
  postCaption: "New drop is live. Comment LINK for the store.",
  user: "example_customer",
  comment: "LINK",
  dm: "Hi! Here is the link to the new drop. Tap to shop.",
  reply: "Sent you a DM!",
} as const;

export const demoProject = {
  label: "Demo project made by SHWY",
  name: "SHWY Store",
  body: "A dark fashion e-commerce store we built to show what a SHWY store feels like. This is our own demo, not a client project.",
} as const;

export const budgetRanges = [
  "Not sure yet",
  "Small",
  "Medium",
  "Large",
] as const;

export const footerNote = "Freelance · Web Studio";
