-- Add LLM-ready fields to vendors table
-- Enables semantic search and AI-powered profile analysis for barista/vendor profiles

ALTER TABLE vendors
ADD COLUMN IF NOT EXISTS profile_llm JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS profile_embedding vector(1536),
ADD COLUMN IF NOT EXISTS last_embedding_generated TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS profile_completion_percent INTEGER DEFAULT 0;

-- Add check constraint for valid completion percentage
ALTER TABLE vendors
ADD CONSTRAINT valid_completion_percent CHECK (
  profile_completion_percent >= 0 AND profile_completion_percent <= 100
);

-- Create pgvector index for semantic search
CREATE INDEX IF NOT EXISTS idx_vendors_embedding
ON vendors
USING ivfflat (profile_embedding vector_cosine_ops)
WITH (lists = 100);

-- Add column comments for documentation
COMMENT ON COLUMN vendors.profile_llm IS 'Structured profile data: bio, specialties, certifications, availability, equipment_expertise, languages, service_style';
COMMENT ON COLUMN vendors.profile_embedding IS 'OpenAI embedding (1536 dims) for semantic search';
COMMENT ON COLUMN vendors.profile_completion_percent IS 'Profile completion percentage (0-100)';
COMMENT ON COLUMN vendors.last_embedding_generated IS 'Timestamp of last embedding generation for cache validation';
