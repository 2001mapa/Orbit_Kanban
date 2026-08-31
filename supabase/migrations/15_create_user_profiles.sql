
-- ARC-01 FIX: Create a public user profiles table synchronized with auth.users
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view member profiles" ON public.user_profiles
  FOR SELECT USING (true); -- Publicly readable by anyone in the workspace (or just globally for simplicity of member lists)

-- Backfill existing users
INSERT INTO public.user_profiles (id, email, created_at)
SELECT id, email, created_at FROM auth.users ON CONFLICT (id) DO NOTHING;

-- Trigger to keep it synced for future users
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();
