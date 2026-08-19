/**
 * The data layer, behind one small interface.
 *
 * With Supabase env vars present it writes to Supabase. Without them it logs
 * to the console. That means the whole funnel — landing, quiz, result, email
 * capture — runs on a laptop with no accounts, no keys and no signup, and
 * starts persisting the moment the keys appear.
 */

export type Subscriber = {
  email: string;
  archetype: string | null;
  /** Segmentation. Collected at intake, never used for physiological advice. */
  gender: string | null;
  age: string | null;
};

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function saveSubscriber(subscriber: Subscriber): Promise<void> {
  if (!url || !key) {
    console.log('[baseline] subscriber (not persisted — no Supabase keys):', subscriber);
    return;
  }

  const response = await fetch(`${url}/rest/v1/subscribers`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates',
    },
    body: JSON.stringify({
      email: subscriber.email,
      archetype: subscriber.archetype,
      gender: subscriber.gender,
      age: subscriber.age,
    }),
  });

  if (!response.ok) {
    console.error('[baseline] supabase insert failed', await response.text());
  }
}
