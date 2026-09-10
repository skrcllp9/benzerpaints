-- Optional demo content — run this after schema.sql if you want the Blogs
-- and Career pages populated for testing. Safe to skip entirely, or to
-- delete these rows later from the admin panel once real content exists.

insert into public.blogs (slug, title, excerpt, cover_image, author, featured, content, published, published_at) values
(
  '5-signs-time-to-repaint-exterior',
  $t$5 Signs It's Time to Repaint Your Home's Exterior$t$,
  $e$Chalking, hairline cracks, and a fading sheen aren't just cosmetic — they're your wall's way of asking for a recoat before real damage sets in.$e$,
  '/images/exterior.avif',
  'Benzer Paints',
  true,
  $c$[
    {"type":"paragraph","text":"Exterior paint isn't just about kerb appeal — it's the first line of defence against sun, rain, and everything in between. Most homeowners wait for paint to look bad before they act, but the visual cues usually show up months after the protective layer has already started failing underneath."},
    {"type":"paragraph","text":"Here are five signs that tell you a repaint isn't optional anymore: chalky residue on your hand after touching the wall, hairline cracks spreading across a facade, peeling at corners and sills, a dull sheen that no longer beads water, and patches that stay damp long after rain has stopped."},
    {"type":"image","src":"/images/commercial-buildings.jpg","caption":"Image #1"},
    {"type":"paragraph","text":"Chalking is the easiest to spot — run your palm across the wall and check for a fine, powdery film. It means the resin binding the pigment has broken down under UV exposure, and the paint is no longer sealing the surface the way it should."},
    {"type":"image","src":"/images/waterproofing.avif","caption":"Image #2"},
    {"type":"paragraph","text":"The good news: catching these signs early usually means a straightforward recoat rather than a full surface rebuild. A weatherproof exterior emulsion with a proper primer underneath will outlast a rushed touch-up by years, so it pays to treat the first crack as the deadline, not the last one."}
  ]$c$::jsonb,
  true,
  now() - interval '80 days'
),
(
  'waterproofing-101-before-monsoon',
  'Waterproofing 101: Protecting Your Walls Before Monsoon',
  $e$Seepage doesn't start in the monsoon — it starts in the hairline crack you ignored in summer. Here's what to fix before the first heavy shower.$e$,
  '/images/waterproofing-cement.avif',
  'Benzer Paints',
  false,
  $c$[
    {"type":"paragraph","text":"Waterproofing is one of those jobs that only gets attention once it's failed — a damp patch spreading across a ceiling, a corner going soft, paint bubbling near a window sill. By then, the fix costs a lot more than it would have three months earlier."},
    {"type":"image","src":"/images/infrastructure-projects.jpg","caption":"Image #1"},
    {"type":"paragraph","text":"The most vulnerable spots are terraces, parapet walls, and anywhere two different surfaces meet — like a window frame set into a wall. Water finds the smallest gap and works its way in slowly, so a visual check every summer, before the rains, is worth the hour it takes."},
    {"type":"paragraph","text":"A good waterproofing system isn't a single product — it's a primer, a flexible waterproof coating, and proper surface prep underneath, all working together. Skipping the prep step is the single most common reason a \"waterproof\" wall still leaks the following year."}
  ]$c$::jsonb,
  true,
  now() - interval '68 days'
),
(
  'choosing-the-right-paint-finish',
  'How to Choose the Right Paint Finish for Every Room',
  $e$Matte, satin, or gloss — the finish you pick changes how a room feels and how much scrubbing it can survive. Here's how to match the two.$e$,
  '/images/interior.avif',
  'Benzer Paints',
  false,
  $c$[
    {"type":"paragraph","text":"It's easy to spend hours picking a colour and no time at all on the finish — but the finish is what decides how that colour actually lives in the room. The same shade in matte and in gloss can read like two different paints entirely."},
    {"type":"image","src":"/images/residential-projects.jpg","caption":"Image #1"},
    {"type":"paragraph","text":"Matte and eggshell finishes hide wall imperfections well and suit bedrooms and living rooms where soft light matters more than scrubbability. Satin and semi-gloss wipe clean easily, which makes them the better call for kitchens, kids' rooms, and hallways that see a lot of contact."},
    {"type":"paragraph","text":"As a rule of thumb: the higher the traffic and the more the wall gets touched, the higher up the sheen scale you should go — even if it means giving up a little of that soft matte look for a finish that can actually be cleaned."}
  ]$c$::jsonb,
  true,
  now() - interval '54 days'
),
(
  'psychology-of-color-for-your-home',
  'The Psychology of Colour: Picking Shades That Fit Your Mood',
  'Warm tones energise, cool tones calm — colour choice is one of the few design decisions that changes how a room actually feels to be in.',
  '/images/bright-desktop.jpg',
  'Benzer Paints',
  false,
  $c$[
    {"type":"paragraph","text":"Colour is one of the few decisions in a home that isn't purely visual — it has a measurable effect on mood, energy, and even how big or small a space feels. Warm tones like ochre and terracotta tend to energise a room; cool tones like sky blue and sage settle it down."},
    {"type":"image","src":"/images/nature-desktop.jpg","caption":"Image #1"},
    {"type":"paragraph","text":"For spaces meant for rest — bedrooms, reading corners — leaning into muted, cooler shades usually works better than bold, saturated colour. For spaces meant for activity — kitchens, home offices, kids' play areas — a brighter, warmer palette tends to hold energy without feeling overwhelming."}
  ]$c$::jsonb,
  true,
  now() - interval '40 days'
),
(
  'interior-vs-exterior-paint-difference',
  $t$Interior vs Exterior Paint: What's Actually Different$t$,
  $e$They're not interchangeable, and it's not just marketing — the resin, additives, and flexibility built into each are solving different problems.$e$,
  '/images/industrial-spaces.jpg',
  'Benzer Paints',
  false,
  $c$[
    {"type":"paragraph","text":"Interior and exterior paint look similar on the shelf, but the formulations underneath are built for entirely different problems. Interior paint is optimised for a smooth, durable finish indoors, where it never has to deal with rain, UV, or big temperature swings."},
    {"type":"image","src":"/images/educational-institutions.jpg","caption":"Image #1"},
    {"type":"paragraph","text":"Exterior paint carries extra resin and additives to stay flexible through expansion and contraction, resist UV-driven fading, and shed water instead of absorbing it. Using an interior paint outdoors — even briefly — tends to chalk and crack far faster than it should."},
    {"type":"paragraph","text":"The reverse swap has its own downside: exterior paint indoors often carries a stronger odour and a slower cure, with none of the benefit since there's no weather to resist. Match the paint to the wall it's actually going on."}
  ]$c$::jsonb,
  true,
  now() - interval '26 days'
),
(
  'dealers-guide-to-stocking-fast-moving-colors',
  $t$A Dealer's Guide to Stocking Fast-Moving Paint Colours$t$,
  'Shelf space is finite — knowing which shades actually turn over keeps working capital in stock that sells, not stock that sits.',
  '/images/hospitality.jpg',
  'Benzer Paints',
  false,
  $c$[
    {"type":"paragraph","text":"For a dealer, every litre sitting on a shelf is capital that isn't moving. Stocking decisions matter as much as the products themselves, and the shades that sell fastest are rarely the boldest ones on the fan deck."},
    {"type":"image","src":"/images/white-cement.avif","caption":"Image #1"},
    {"type":"paragraph","text":"Neutral whites, warm beiges, and a small set of popular accent shades typically account for the bulk of repeat orders. Keeping those in depth — rather than spreading stock thin across every shade in the catalogue — is usually the difference between a shelf that turns over and one that doesn't."},
    {"type":"paragraph","text":"Tracking which colours get reordered each season, rather than restocking on a fixed list, is the simplest way to let real demand — not guesswork — decide what sits on the shelf."}
  ]$c$::jsonb,
  true,
  now() - interval '12 days'
)
on conflict (slug) do nothing;

insert into public.jobs (slug, title, department, location, job_type, experience_level, description, published, published_at) values
(
  'production-supervisor',
  'Production Supervisor',
  'Manufacturing',
  'Pune, Maharashtra',
  'Full-time',
  '3-5 years',
  $d$Oversee daily operations on the paint production line — batch scheduling, quality checks at each stage, and shift handovers. You'll work closely with QC and warehousing to keep output on plan without compromising on finish consistency.$d$,
  true,
  now() - interval '30 days'
),
(
  'area-sales-manager',
  'Area Sales Manager',
  'Sales',
  'Bengaluru, Karnataka',
  'Full-time',
  '4-6 years',
  $d$Own dealer relationships and revenue targets across your territory. You'll onboard new dealers, run periodic stock and scheme reviews, and be the first escalation point for anything affecting sell-through in your region.$d$,
  true,
  now() - interval '24 days'
),
(
  'quality-control-chemist',
  'Quality Control Chemist',
  'R&D',
  'Pune, Maharashtra',
  'Full-time',
  '1-3 years',
  'Run batch testing across viscosity, opacity, drying time, and adhesion before a batch is cleared for dispatch. You will also help investigate and document any field complaints that trace back to a formulation issue.',
  true,
  now() - interval '18 days'
),
(
  'dealer-relationship-executive',
  'Dealer Relationship Executive',
  'Sales',
  'Ahmedabad, Gujarat',
  'Full-time',
  '2-4 years',
  $d$Be the day-to-day point of contact for a set of dealers — order follow-ups, scheme communication, and resolving stock or billing queries quickly enough that they never become escalations.$d$,
  true,
  now() - interval '11 days'
),
(
  'digital-marketing-associate',
  'Digital Marketing Associate',
  'Marketing',
  'Remote',
  'Internship',
  '0-1 years',
  'Support campaign execution across social and search — scheduling posts, pulling weekly performance reports, and coordinating with design on creative requests. A good fit if you want hands-on paid + organic experience.',
  true,
  now() - interval '6 days'
),
(
  'logistics-coordinator',
  'Logistics Coordinator',
  'Supply Chain',
  'Pune, Maharashtra',
  'Contract',
  '2-3 years',
  $d$Coordinate outbound dispatch schedules with transporters, track delivery SLAs across depots, and flag exceptions before they turn into a dealer complaint.$d$,
  true,
  now() - interval '3 days'
)
on conflict (slug) do nothing;
