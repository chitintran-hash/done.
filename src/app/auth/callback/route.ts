import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ensureUserProfile } from '@/app/actions/auth';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const redirect = searchParams.get('redirect') ?? searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await ensureUserProfile({
          userId: user.id,
          fullName: user.user_metadata?.full_name,
          email: user.email,
        });
      }

      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalhost = process.env.NODE_ENV === 'development';
      const targetBase = isLocalhost ? origin : (forwardedHost ? `https://${forwardedHost}` : origin);
      return NextResponse.redirect(`${targetBase}${redirect}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`);
}
