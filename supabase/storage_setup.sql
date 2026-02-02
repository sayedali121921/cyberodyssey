-- 1. Create the 'research-papers' bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('research-papers', 'research-papers', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Setup public access policy (Allow anyone to read)
DROP POLICY IF EXISTS "Public Read Research Papers" ON storage.objects;
CREATE POLICY "Public Read Research Papers"
ON storage.objects FOR SELECT
USING ( bucket_id = 'research-papers' );

-- 3. Setup upload policy (Allow authenticated users to upload)
DROP POLICY IF EXISTS "Authenticated Upload Research Papers" ON storage.objects;
CREATE POLICY "Authenticated Upload Research Papers"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'research-papers' AND auth.role() = 'authenticated' );
