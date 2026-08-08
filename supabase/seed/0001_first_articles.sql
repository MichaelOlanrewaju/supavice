-- Seed: first 10 blog articles.
-- Real, general health guidance grounded in the actual product catalogue —
-- not medical advice, and written to point people toward a pharmacist or
-- doctor for anything beyond general information. Safe to run once; re-running
-- will conflict on the unique slug and simply do nothing further (ON CONFLICT DO NOTHING).

insert into blog_posts (slug, title, excerpt, content, tags, related_products, published, author)
values
  ('storing-medicine-safely-at-home', 'Storing Medicine Safely at Home: A Practical Guide', 'Where you keep your medicine matters as much as what you take. Here''s how to store it properly, and why the bathroom cabinet usually isn''t it.', '## Why storage matters more than people think

Medicine that''s been stored badly can lose potency long before its printed expiry date, and in some cases can break down into compounds that aren''t safe to take. Heat, light and humidity are the three things doing the damage — and the bathroom, ironically, has all three.

## The basics

- **Cool and dry beats cold and damp.** A bedroom drawer or a kitchen cupboard away from the cooker is usually better than a bathroom cabinet, which gets warm and humid every time someone showers.
- **Keep it in the original pack.** The box and leaflet carry the batch number and expiry date — information you''ll need if you ever need to check a recall or report a side effect.
- **Out of reach, not just out of sight.** Children can climb further than you''d expect. A high shelf or a lockable box is safer than a low drawer.
- **Fridge items stay in the fridge.** Some insulin, certain eye drops and a few liquid antibiotics need refrigeration — check the leaflet, and never let them freeze.

## What to do with old or unused medicine

Don''t flush it and don''t put it in the household bin loose. Bring it back to us and we''ll dispose of it properly — pharmacies in Nigeria are equipped to handle pharmaceutical waste safely, most household bins aren''t.

## A quick monthly habit

Once a month, glance through what you have. Check expiry dates, and if a liquid has changed colour or a tablet looks different from when you bought it, don''t take it — ask us first.

If you''re ever unsure whether something''s still good to use, bring it in or send us a photo on WhatsApp. It takes us a minute to check, and it''s better than guessing.
', '{"Home health","Safety"}', '{}', true, 'Supavice Pharmacy'),
  ('seasonal-cough-and-cold-in-lagos', 'Cough and Cold Season in Lagos: What''s Normal, and When to See a Doctor', 'Harmattan dust and sudden weather swings bring a wave of coughs and colds every year. Here''s how to tell an ordinary one from something that needs a doctor.', '## Why Lagos gets a cough season

Between the harmattan dust and the sharp temperature drop some evenings, Lagos sees a real spike in coughs, blocked noses and sore throats — especially November through February. Most of it is ordinary and clears on its own within a week to ten days.

## What ordinary looks like

- A cough that''s improving, even slowly, by day 5–7
- A blocked or runny nose without a high fever
- Mild sore throat, worse in the morning
- Feeling generally tired but not unwell

For this, rest, fluids, and something to ease the symptoms while your body clears it — a night formula like [Night Nurse](/product/night-nurse-syrup-160ml) for sleep, or a cold and flu powder like [Lemsip Max](/product/lemsip-max-cold-flu-blackcurrant-paracetamolphenylephrine-1000mg-powde) during the day — is usually enough.

## When it''s not just a cold

See a doctor if you notice:

- Fever above 38.5°C that doesn''t come down, or lasts more than 3 days
- Breathlessness, or a whistling sound when breathing
- A cough that''s getting worse after a week rather than better
- Chest pain, or coughing up blood
- Symptoms in a baby under 3 months, or a child who''s unusually drowsy or not feeding

None of these are things to wait out. Malaria and cough symptoms can overlap in Nigeria, so a fever that doesn''t fit the pattern of an ordinary cold is always worth checking properly rather than assuming.

## For persistent congestion

If a blocked nose is dragging on well past the rest of the cold, a nasal spray like [Avamys](/product/avamys-275mcg-nasal-spray) can help — but it''s worth a quick chat with our pharmacist first, since it works differently from a simple decongestant and isn''t meant for short-term use only.

Not sure which category you''re in? Message us on WhatsApp and describe what you''re feeling — it costs nothing and takes the guessing out of it.
', '{"Cough & cold","Seasonal health"}', '{"night-nurse-syrup-160ml","lemsip-max-cold-flu-blackcurrant-paracetamolphenylephrine-1000mg-powde","avamys-275mcg-nasal-spray"}', true, 'Supavice Pharmacy'),
  ('home-blood-pressure-monitoring-guide', 'Monitoring Blood Pressure at Home: What the Numbers Actually Mean', 'A home blood pressure monitor is only useful if you know how to use it properly and read the result. Here''s a plain-language guide.', '## Why home monitoring matters

Blood pressure taken once at a clinic only captures a single moment — and it''s often higher than normal simply because of the stress of being at a doctor''s office. Tracking it at home over time gives a much more honest picture, and it''s one of the simplest things you can do to catch high blood pressure early, before it causes damage.

## Reading the two numbers

Every reading gives you two figures, for example 120/80:

- **The top number (systolic)** is the pressure when your heart beats
- **The bottom number (diastolic)** is the pressure when it rests between beats

As a general guide, under 120/80 is considered normal, 120–139/80–89 is elevated, and 140/90 or above on repeated readings is high — but your doctor should interpret your specific numbers, especially if you have other health conditions.

## Getting an accurate reading

- Sit quietly for 5 minutes before measuring — don''t check it right after climbing stairs or an argument
- Keep your arm at heart height, supported on a table
- Don''t talk while the cuff is inflating
- Take two readings a minute apart and note both

A monitor like the [Omron M3 Basic](/product/omron-digital-blood-pressure-m3-basic-monitor) is a solid, simple starting point; the [M6 Comfort](/product/omron-m6-comfort-automatic-blood-pressure-monitor) and [M7 Intelli IT](/product/omron-m7-intelli-it-blood-pressure-monitor) add irregular heartbeat detection and, for the M7, Bluetooth tracking on your phone — useful if you''re monitoring long-term or sharing results with a doctor.

## What to do with the numbers

Keep a simple log — date, time, both numbers. A single high reading isn''t usually a reason to panic; a pattern of high readings over a week or two is what your doctor needs to see. Bring the log to your next appointment rather than just describing it from memory.

We offer free cuff-fitting in store if you''re buying your first monitor — come in and we''ll make sure it''s sized correctly, since a cuff that''s too small or large will throw the reading off.
', '{"Heart health","Diagnostics"}', '{"omron-m7-intelli-it-blood-pressure-monitor","omron-m6-comfort-automatic-blood-pressure-monitor","omron-digital-blood-pressure-m3-basic-monitor"}', true, 'Supavice Pharmacy'),
  ('living-well-with-diabetes-daily-habits', 'Living with Diabetes: Daily Habits That Actually Help', 'Managing diabetes well is less about any single decision and more about a handful of daily habits. Here''s what consistently makes a difference.', '## It''s a daily thing, not an occasional one

Diabetes management is won or lost in the small daily decisions — what you eat, whether you took your medicine on schedule, whether you checked your blood sugar when you were supposed to. None of these individually feels significant, but together they''re the whole picture.

## The habits that matter most

**Take medicine at the same time each day.** Consistency matters more than the exact time you choose. If you''re on [Galvus](/product/galvus-vildagliptin-50mg-tablets-x-28) or a similar medication, pick a time you''ll realistically stick to — with breakfast, for instance — rather than an ideal time you keep missing.

**Check your blood sugar as advised, not just when you feel unwell.** Symptoms aren''t a reliable guide to your actual blood sugar level. Regular checks, even when you feel fine, catch problems before they become symptoms.

**Watch carbohydrates, not just sugar.** Rice, bread, garri and similar staples affect blood sugar as much as anything visibly sweet does. Portion size matters more than cutting them out entirely.

**Look after your feet.** Diabetes can reduce sensation in the feet, so small injuries go unnoticed. A daily glance for cuts, blisters or changes in colour catches problems while they''re still minor.

**Don''t skip appointments when you''re feeling fine.** Regular check-ups catch drifting blood sugar control before it causes symptoms — waiting until you feel unwell means the problem has often been building for a while.

## When to contact us or your doctor sooner

- Blood sugar readings consistently outside the range your doctor set
- Unusual thirst, frequent urination, or unexplained weight loss
- A wound on the foot that isn''t healing
- Feeling shaky, sweaty or confused, which can mean blood sugar has dropped too low

If you''re ever unsure whether a reading or symptom needs urgent attention, call us — we''d rather answer a question that turns out to be nothing than have you wait on something that matters.
', '{"Diabetes","Chronic conditions"}', '{"galvus-vildagliptin-50mg-tablets-x-28"}', true, 'Supavice Pharmacy'),
  ('malaria-prevention-and-early-symptoms', 'Malaria in Nigeria: Prevention and Recognising It Early', 'Malaria remains one of the most common reasons people visit a pharmacy in Nigeria. Here''s how to reduce your risk and catch it early.', '## Why early recognition matters

Malaria treated early is usually straightforward. Malaria left for several days before treatment starts is where complications happen — so recognising the early signs and acting on them quickly matters more than almost anything else.

## Reducing your risk

- **Sleep under a treated mosquito net**, even in rooms with screens or air conditioning — mosquitoes find gaps.
- **Clear standing water around the house.** Stagnant water in buckets, tyres, or blocked gutters is where mosquitoes breed.
- **Use repellent in the evening**, when the mosquitoes that carry malaria are most active.
- **Screen windows and doors** where possible, and consider indoor spraying during peak transmission months.

## Recognising early symptoms

Malaria symptoms often start mildly and can look like a lot of other things, which is exactly why people delay getting tested:

- Fever, often coming in waves rather than staying constant
- Chills and sweating
- Headache and body aches
- Fatigue and general weakness
- Sometimes nausea or loss of appetite

## The one habit that matters most

**Get tested, don''t assume.** Fever in Nigeria doesn''t automatically mean malaria — but it''s common enough that it should always be checked rather than guessed at. A rapid test takes minutes, and treating based on an actual result is safer than starting medication for something that might be a different illness entirely.

## When to seek care urgently

Go to a hospital immediately if fever is accompanied by: confusion or drowsiness, repeated vomiting, difficulty breathing, dark urine, or convulsions. These can indicate severe malaria, which needs hospital-level treatment, not home management.

We stock rapid malaria test kits and can talk you through your result. If it''s positive, we''ll guide you on treatment; if you''re at all unsure, we''d rather you test and know than guess and wait.
', '{"Malaria","Prevention"}', '{}', true, 'Supavice Pharmacy'),
  ('joint-and-muscle-pain-when-rest-isnt-enough', 'Joint and Muscle Pain: When Rest Isn''t Enough', 'Most aches settle with rest. Here''s how to tell the difference between an ordinary strain and something that needs proper attention.', '## Most pain is ordinary — but not all of it

A stiff back after a long drive, sore knees after a hike, an ache after unusual exertion — these are normal, and they typically ease within a few days with rest and gentle movement.

## What helps ordinary aches

- **Gentle movement, not total rest.** Complete immobility can make stiffness worse; light activity keeps things from seizing up.
- **Heat for stiffness, cold for swelling.** A warm compress eases tight muscles; an ice pack in the first 48 hours after an injury reduces swelling.
- **Anti-inflammatory relief for short-term flare-ups.** Something like [Voltaren](/product/voltaren-retard-diclofenac-sodium-100mg-tabs-x100-pack) can help manage pain while your body heals — but it''s meant for short courses, not ongoing daily use without medical guidance.

## For longer-term joint support

If joint discomfort is a recurring thing rather than a one-off, some people find daily joint-support supplements — like [Jointace](/product/jointace-original-tablets-x-30) or [Nature''s Field Joint Renew](/product/natures-field-joint-renew-advanced-tablets-x-100) — helpful as part of ongoing care, alongside whatever your doctor has recommended. These aren''t a substitute for medical treatment of an underlying condition like arthritis, but many people use them as a supportive addition.

## When it''s not just an ordinary ache

See a doctor if:

- Pain persists or worsens beyond two weeks despite rest
- A joint is visibly swollen, red, or warm to the touch
- You can''t bear weight on the affected area
- Pain woke you from sleep, or is worse at night
- It followed a specific injury with a popping or tearing sensation

These patterns suggest something beyond ordinary strain — a proper injury, an inflammatory condition, or something that needs imaging or a specialist''s opinion.

If you''re not sure which category your pain falls into, come in and describe it to our pharmacist. We can often point you in the right direction before you need to decide between "wait it out" and "see a doctor."
', '{"Pain management"}', '{"voltaren-retard-diclofenac-sodium-100mg-tabs-x100-pack","jointace-original-tablets-x-30","natures-field-joint-renew-advanced-tablets-x-100"}', true, 'Supavice Pharmacy'),
  ('probiotics-and-gut-health-explained', 'Probiotics and Gut Health: What They Actually Do', 'Probiotics get talked about a lot, but what are they actually doing, and who genuinely benefits? Here''s a straightforward answer.', '## What probiotics actually are

Probiotics are live bacteria and yeasts that are similar to the beneficial microbes your gut already has. The idea is straightforward: your gut has trillions of bacteria doing useful work — digesting food, supporting your immune system, even influencing mood — and probiotics aim to support or restore a healthy balance of them.

## Who tends to benefit most

- **People just finishing a course of antibiotics.** Antibiotics kill harmful bacteria but also disrupt the beneficial ones in your gut — probiotics can help restore balance afterward.
- **People with occasional bloating or irregular digestion.** Not a guaranteed fix, but many people notice a genuine difference.
- **People managing ongoing digestive discomfort**, alongside whatever their doctor has already recommended.

## What the evidence actually supports

Probiotics aren''t a cure-all, and the research is strongest for specific situations — like reducing antibiotic-associated digestive upset — rather than as a general wellness product. If you''re taking one, give it a fair trial of a few weeks rather than judging after a couple of days; gut bacteria don''t shift overnight.

## Probiotics vs fibre — not the same thing

Something like [Fybogel](/product/fybogel-powder-lemon-flavour-sachets-x-30) is a fibre supplement, not a probiotic — it works differently, by adding bulk and softening stool, and is more suited to occasional constipation than to general gut-balance support. The two are sometimes confused because they''re both filed under "digestive health," but they solve different problems.

## Choosing one

Look for a product listing the specific bacterial strains and a CFU (colony-forming unit) count, like [Garden of Life''s Dr. Formulated range](/product/garden-of-life-dr-formulated-probiotics-once-daily-mens-capsules-x-30) — vague labelling without strain names or counts is usually a lower-quality product.

If you''re taking probiotics alongside a specific digestive condition rather than general wellness, mention it to us or your doctor — some conditions need a different strain than others.
', '{"Digestive health","Supplements"}', '{"fybogel-powder-lemon-flavour-sachets-x-30","garden-of-life-dr-formulated-probiotics-once-daily-mens-capsules-x-30","gol-dr-formulated-probiotics-once-daily-womens-50-billion-cfu-x30-caps"}', true, 'Supavice Pharmacy'),
  ('oral-hygiene-basics-beyond-brushing', 'Oral Hygiene: What''s Worth Doing Beyond Brushing Twice a Day', 'Brushing twice a day is the baseline, not the whole picture. Here''s what else genuinely makes a difference.', '## Brushing is the floor, not the ceiling

Twice-daily brushing is the minimum for healthy teeth and gums — but a surprising amount of dental trouble happens in the parts brushing alone doesn''t reach.

## The parts most people skip

**Flossing, genuinely, daily.** Brushing cleans the surfaces of teeth; it doesn''t reach between them, where plaque builds up and eventually causes gum disease. If floss feels awkward, interdental brushes are an easier alternative that do the same job.

**The tongue.** A lot of bad breath originates from bacteria on the back of the tongue, not the teeth. A gentle scrape or brush of the tongue as part of your routine makes a real difference.

**Mouthwash, used correctly.** A mouthwash like [Corsodyl](/product/corsodyl-original-mouthwash-300ml) is genuinely useful for gum health, particularly if you notice bleeding when you brush — but it works best as an addition to brushing and flossing, not a replacement for either.

## Common problems and what helps

**Mouth ulcers.** Usually harmless and self-resolving within a week or two, but uncomfortable in the meantime. A gel like [Bonjela](/product/bonjela-effective-mouth-ulcer-relief-gel-for-adult-16years-15g) numbs the area and can speed comfort while it heals.

**Bleeding gums.** Occasional bleeding when brushing, especially if you''ve just started flossing again, often settles within a couple of weeks as your gums adjust. Bleeding that persists beyond that is worth mentioning to a dentist — it can be an early sign of gum disease.

**Persistent bad breath.** If it doesn''t improve with better brushing, flossing and tongue cleaning, the cause may be elsewhere — sinus issues, digestive causes, or a dental problem needing a dentist''s look rather than a home fix.

## When to see a dentist rather than self-treat

- A mouth ulcer that hasn''t healed after three weeks
- Persistent tooth pain, especially with hot or cold sensitivity
- Visible damage to a tooth
- A lump or unusual patch in the mouth that doesn''t resolve

None of these are things a pharmacy product should be expected to fix on its own — they need a dentist''s actual examination.
', '{"Oral care"}', '{"corsodyl-original-mouthwash-300ml","bonjela-effective-mouth-ulcer-relief-gel-for-adult-16years-15g"}', true, 'Supavice Pharmacy'),
  ('choosing-prenatal-vitamins-what-to-look-for', 'Choosing Prenatal Vitamins: What Actually Matters', 'Prenatal vitamin shelves can be overwhelming. Here''s what to actually look for, and why it matters at each stage.', '## Why prenatal vitamins differ from ordinary multivitamins

Pregnancy increases the body''s need for several specific nutrients, well beyond what a standard multivitamin provides. A proper prenatal formula is built around those specific increased needs, not just a general "extra vitamins" idea.

## The nutrients that matter most

**Folic acid.** Critical in early pregnancy for the baby''s neural development — ideally started before conception if you''re planning a pregnancy, and continued through the first trimester at minimum.

**Iron.** Pregnancy significantly increases blood volume, and iron needs rise with it. Low iron in pregnancy is common and can leave you feeling persistently exhausted beyond ordinary pregnancy tiredness.

**Vitamin D and calcium.** Both matter for the baby''s developing bones, and vitamin D is genuinely easy to be low in without realising it, particularly if you''re spending most of the day indoors.

**Omega-3 (DHA).** Supports the baby''s brain and eye development, particularly through the second and third trimesters. A formula like [Pregnacare Plus Omega-3](/product/pregnacare-plus-omega-3-capsules-x56) combines the core prenatal nutrients with this added in, rather than needing two separate supplements.

## When to start, and how long to continue

Ideally, start folic acid before conception if you''re planning a pregnancy — neural development begins very early, often before you know you''re pregnant. Continue a full prenatal formula throughout pregnancy, and many doctors recommend continuing through breastfeeding too, since nutrient needs stay elevated.

## A genuinely important note

Prenatal vitamins support a healthy pregnancy alongside proper antenatal care — they don''t replace it. Regular check-ups with your doctor or midwife catch things a supplement never could. If you''re newly pregnant and haven''t started antenatal visits yet, that''s the more urgent first step.

If you''re not sure which formula suits your stage of pregnancy or any specific concern your doctor has flagged, bring it up with us — we''re happy to talk it through.
', '{"Mother & baby","Pregnancy"}', '{"pregnacare-plus-omega-3-capsules-x56"}', true, 'Supavice Pharmacy'),
  ('skin-and-hair-supplements-do-they-work', 'Skin and Hair Supplements: Do They Actually Work?', 'Skin and hair supplements are everywhere, but the honest answer to whether they work depends heavily on why your skin or hair is struggling in the first place.', '## The honest starting point

Skin and hair supplements work best when the underlying issue is a genuine nutritional gap — not every case of dull skin or thinning hair has a nutritional cause, and supplements can''t fix causes they weren''t built to address.

## What they can genuinely help with

**Biotin, zinc and selenium** support the structural building blocks of hair and nails — if you''re actually low in these, supplementing can make a real, visible difference over a few months.

**Omega-3s and antioxidants** support skin from the inside, complementing (not replacing) a good skincare routine and sun protection.

A formula like [Perfectil Platinum](/product/perfectil-platinum-tablets-x-60) combines several of these into one daily tablet rather than needing to buy and manage separate supplements.

## What they generally can''t fix on their own

- Hair loss caused by hormonal conditions, thyroid issues, or genetics — these need medical diagnosis and often medical treatment, not a supplement
- Skin conditions like eczema or acne, which usually need a targeted treatment approach, not general nutritional support
- Postpartum hair shedding, which is usually temporary and hormone-driven, and typically resolves on its own within several months regardless of supplementation

## Setting realistic expectations

Hair and skin cells turn over slowly. If you start a supplement expecting a visible change within two weeks, you''ll likely be disappointed regardless of the product''s quality — a fair trial is usually 8 to 12 weeks, taken consistently.

Products like [Vitabiotics Hairfollic](/product/vitabiotics-hairfollic-her-advanced-dual-pack-capsules-x-60) are formulated specifically around hair, if that''s your main concern, rather than general skin-and-hair combination formulas — worth choosing based on what''s actually bothering you most.

## When to see a doctor instead

If hair loss is sudden, patchy, or accompanied by other symptoms like fatigue or weight change, or if a skin issue is worsening, painful, or spreading — see a doctor before reaching for a supplement. These patterns suggest something a general supplement isn''t designed to address.
', '{"Skin & hair","Supplements"}', '{"perfectil-platinum-tablets-x-60","vitabiotics-hairfollic-her-advanced-dual-pack-capsules-x-60"}', true, 'Supavice Pharmacy')
on conflict (slug) do nothing;