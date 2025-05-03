-- Create AI assistant sessions table
CREATE TABLE ai_assistant_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  title TEXT NOT NULL,
  messages JSONB DEFAULT '[]'::jsonb,
  generated_content_path TEXT
);

-- Add RLS policies
ALTER TABLE ai_assistant_sessions ENABLE ROW LEVEL SECURITY;

-- Create session access policy
CREATE POLICY "Users can access their own assistant sessions"
ON ai_assistant_sessions
FOR ALL
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX ai_assistant_sessions_user_id_idx ON ai_assistant_sessions(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_ai_assistant_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_ai_assistant_sessions_updated_at
BEFORE UPDATE ON ai_assistant_sessions
FOR EACH ROW EXECUTE FUNCTION update_ai_assistant_sessions_updated_at(); 