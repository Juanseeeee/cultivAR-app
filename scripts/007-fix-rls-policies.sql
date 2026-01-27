-- Fix RLS policies to avoid infinite recursion
-- This script removes the problematic admin policy and adds an INSERT policy

-- Drop the problematic admin policy that causes infinite recursion
DROP POLICY IF EXISTS "Los admins pueden ver todos los cultivadores" ON cultivadores;

-- Add policy to allow users to insert their own cultivador record
DROP POLICY IF EXISTS "Los usuarios pueden crear su propio perfil" ON cultivadores;
CREATE POLICY "Los usuarios pueden crear su propio perfil"
ON cultivadores
FOR INSERT
TO public
WITH CHECK (auth.uid() = id);

-- Ensure the table has RLS enabled
ALTER TABLE cultivadores ENABLE ROW LEVEL SECURITY;

-- Also disable email confirmation temporarily for testing
-- Note: This must be done in Supabase Dashboard under Authentication > Settings
-- Set "Enable email confirmations" to OFF

-- Verify policies
SELECT 
  tablename, 
  policyname, 
  cmd,
  CASE 
    WHEN qual IS NOT NULL THEN 'Has USING clause'
    ELSE 'No USING clause'
  END as using_clause,
  CASE 
    WHEN with_check IS NOT NULL THEN 'Has WITH CHECK clause'
    ELSE 'No WITH CHECK clause'
  END as with_check_clause
FROM pg_policies 
WHERE tablename = 'cultivadores'
ORDER BY cmd, policyname;
