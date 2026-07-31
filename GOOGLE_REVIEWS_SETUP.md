# Real Google reviews on the site

Shows your actual Google Business reviews on the homepage and a compact version at checkout.
**Nothing is fabricated** — until this is set up, both spots show a plain "Read our reviews on
Google" link instead of any number or quote, because inventing a star rating or review text for a
pharmacy is the kind of fake trust signal that gets a business in real trouble.

## 1. Find your Place ID

The link you gave me for the store (`ftid=0x103b97285a548eef:...`) is a search-results feature ID,
not the Place ID the API needs. Get the real one:

1. Go to [Google's Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)
2. Search "Supavice Pharmacy" and confirm it's pinned at 13 Baale Animashaun Rd, Alakuko
3. Copy the Place ID it shows — looks like `ChIJN1t_tDeuEmsRUsoyG83frY4`

## 2. Get a Google Places API key

1. [Google Cloud Console](https://console.cloud.google.com) → create a project (or use an existing one)
2. **APIs & Services** → **Library** → enable **Places API (New)**
3. **Credentials** → **Create credentials** → **API key**
4. Restrict it: **API restrictions** → limit to **Places API (New)** only, so the key can't be used
   for anything else if it ever leaks

This has a free tier (Google gives $200/month credit); a pharmacy's review traffic won't come close
to using it up.

## 3. Set the secrets and deploy

```bash
supabase secrets set GOOGLE_PLACES_API_KEY=your_key_here
supabase secrets set GOOGLE_PLACE_ID=your_place_id_here
supabase functions deploy google-reviews
```

## 4. Confirm it worked

Reload the homepage. The plain "Read our reviews on Google" link should become a real rating, review
count, and up to 6 actual review cards with reviewer names and photos.

If it's still showing the plain link, check the function logs:
Supabase dashboard → **Edge Functions** → **google-reviews** → **Logs**

## What this does and doesn't do

- Reviews are cached for 6 hours per function instance to keep API usage low — they won't update
  the instant a new review comes in, but within a few hours
- Review text, star ratings, names and photos are shown exactly as Google returns them — nothing is
  reworded, filtered, or summarized, per Google's display requirements for their review content
- If the API call ever fails (key revoked, quota hit, network issue), it falls back to the honest
  "Read our reviews on Google" link — never to stale or fabricated data
