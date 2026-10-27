/**
 * Quién está detrás de una sesión de Supabase.
 *
 * Se le pregunta a Supabase por el token en vez de verificar su firma
 * aquí: así este servidor no guarda el secreto JWT del proyecto. La
 * clave anónima es pública y puede viajar en el bundle del navegador.
 */

const URL_POR_DEFECTO = 'https://lkqlrfbywtjdvnpslazy.supabase.co';
const CLAVE_POR_DEFECTO = 'sb_publishable_jedzHNx-TzQ5iD7B5oFRdQ_JEzv5iZo';

const base = () => (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || URL_POR_DEFECTO).replace(/\/+$/, '');
const clave = () => process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || CLAVE_POR_DEFECTO;

/**
 * Devuelve { id, email, name, avatarUrl, provider, googleSub } si el token
 * corresponde a una sesión viva de Supabase; null en cualquier otro caso.
 */
export async function verifySupabaseAccessToken(accessToken) {
  if (!accessToken || typeof accessToken !== 'string' || accessToken.length > 4000) return null;
  try {
    const res = await fetch(`${base()}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${accessToken}`, apikey: clave() },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const user = await res.json();
    const email = String(user?.email || '').trim().toLowerCase();
    if (!user?.id || !email) return null;

    const meta = user.user_metadata || {};
    const name = String(meta.full_name || meta.name || '').trim() || email.split('@')[0];
    const google = (Array.isArray(user.identities) ? user.identities : [])
      .find(identity => identity?.provider === 'google');
    const provider = String(user.app_metadata?.provider || google?.provider || 'email');
    // Supabase devuelve el `sub` de Google en la identidad y, según la
    // versión, también en user_metadata. Cualquiera de los dos sirve para
    // reconocer la misma cuenta de Google sin mirar el correo.
    const googleSub = google?.id
      || google?.identity_data?.sub
      || (provider === 'google' ? (meta.provider_id || meta.sub) : null)
      || null;

    return {
      id: String(user.id),
      email,
      name: name.slice(0, 120),
      avatarUrl: meta.avatar_url || meta.picture || null,
      provider,
      googleSub: googleSub ? String(googleSub) : null,
    };
  } catch {
    return null;
  }
}
