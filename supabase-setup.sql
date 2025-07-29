-- Supabase Database Setup for Young Eagles Donation System
-- Run this SQL in your Supabase SQL Editor

-- Create donations table
CREATE TABLE donations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Donor Information
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    contact_number VARCHAR(50) NOT NULL,
    company VARCHAR(255),
    
    -- Donation Details
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('EFT', 'Cash', 'PayFast')),
    
    -- Status Tracking
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    reference_number VARCHAR(50) UNIQUE,
    
    -- Payment Details (for PayFast)
    payfast_payment_id VARCHAR(100),
    payfast_transaction_id VARCHAR(100),
    
    -- Additional Info
    notes TEXT,
    admin_notes TEXT
);

-- Create indexes for better performance
CREATE INDEX idx_donations_email ON donations(email);
CREATE INDEX idx_donations_reference ON donations(reference_number);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_created_at ON donations(created_at);

-- Create function to generate reference numbers
CREATE OR REPLACE FUNCTION generate_reference_number()
RETURNS TEXT AS $$
BEGIN
    RETURN 'YEHC-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(EXTRACT(DOY FROM NOW())::TEXT, 3, '0') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate reference numbers
CREATE OR REPLACE FUNCTION set_reference_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.reference_number IS NULL THEN
        NEW.reference_number := generate_reference_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_reference_number
    BEFORE INSERT ON donations
    FOR EACH ROW
    EXECUTE FUNCTION set_reference_number();

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_donations_updated_at
    BEFORE UPDATE ON donations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Create policies for the donations table
-- Allow reading all donations (for admin purposes)
CREATE POLICY "Enable read access for authenticated users" ON donations
    FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Allow inserting new donations
CREATE POLICY "Enable insert for anonymous users" ON donations
    FOR INSERT WITH CHECK (true);

-- Allow updating for authenticated users (admin)
CREATE POLICY "Enable update for authenticated users" ON donations
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create a view for donation statistics (optional)
CREATE VIEW donation_stats AS
SELECT 
    COUNT(*) as total_donations,
    SUM(amount) as total_amount,
    AVG(amount) as average_donation,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_donations,
    SUM(amount) FILTER (WHERE status = 'completed') as completed_amount,
    COUNT(*) FILTER (WHERE payment_method = 'PayFast') as payfast_donations,
    COUNT(*) FILTER (WHERE payment_method = 'EFT') as eft_donations,
    COUNT(*) FILTER (WHERE payment_method = 'Cash') as cash_donations
FROM donations;
