-- Fix RLS policy for cultivadores INSERT
-- The issue is that the with_check condition is too strict
-- We need to allow authenticated users to create their own profile

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Los usuarios pueden crear su propio perfil" ON cultivadores;

-- Create a new INSERT policy that allows authenticated users to insert their own record
CREATE POLICY "Los usuarios pueden crear su propio perfil"
ON cultivadores
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Also ensure anon users can't insert
CREATE POLICY "Prevent anonymous inserts"
ON cultivadores
FOR INSERT
TO anon
WITH CHECK (false);
