CREATE TABLE public.user_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  has_access boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

GRANT SELECT, INSERT ON public.user_access TO authenticated;
GRANT ALL ON public.user_access TO service_role;

ALTER TABLE public.user_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own access"
ON public.user_access
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create own pending access row"
ON public.user_access
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid() AND has_access = false);

CREATE OR REPLACE FUNCTION public.update_user_access_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_user_access_updated_at
BEFORE UPDATE ON public.user_access
FOR EACH ROW EXECUTE FUNCTION public.update_user_access_updated_at();