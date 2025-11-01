-- Create trips table
CREATE TABLE IF NOT EXISTS public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create trip members table
CREATE TABLE IF NOT EXISTS public.trip_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  paid_by TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create expense shares table (tracks who shares each expense)
CREATE TABLE IF NOT EXISTS public.expense_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID NOT NULL REFERENCES public.expenses(id) ON DELETE CASCADE,
  member_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_shares ENABLE ROW LEVEL SECURITY;

-- Trips policies - allow users to access trips they created
CREATE POLICY "Users can view their own trips"
  ON public.trips FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "Users can create trips"
  ON public.trips FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own trips"
  ON public.trips FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own trips"
  ON public.trips FOR DELETE
  USING (auth.uid() = created_by);

-- Trip members policies - allow access based on trip ownership
CREATE POLICY "Users can view trip members for their trips"
  ON public.trip_members FOR SELECT
  USING (
    trip_id IN (
      SELECT id FROM public.trips WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Users can add members to their trips"
  ON public.trip_members FOR INSERT
  WITH CHECK (
    trip_id IN (
      SELECT id FROM public.trips WHERE created_by = auth.uid()
    )
  );

-- Expenses policies - allow access based on trip ownership
CREATE POLICY "Users can view expenses for their trips"
  ON public.expenses FOR SELECT
  USING (
    trip_id IN (
      SELECT id FROM public.trips WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Users can add expenses to their trips"
  ON public.expenses FOR INSERT
  WITH CHECK (
    trip_id IN (
      SELECT id FROM public.trips WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update expenses in their trips"
  ON public.expenses FOR UPDATE
  USING (
    trip_id IN (
      SELECT id FROM public.trips WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete expenses in their trips"
  ON public.expenses FOR DELETE
  USING (
    trip_id IN (
      SELECT id FROM public.trips WHERE created_by = auth.uid()
    )
  );

-- Expense shares policies
CREATE POLICY "Users can view expense shares for their trips"
  ON public.expense_shares FOR SELECT
  USING (
    expense_id IN (
      SELECT id FROM public.expenses 
      WHERE trip_id IN (
        SELECT id FROM public.trips WHERE created_by = auth.uid()
      )
    )
  );

CREATE POLICY "Users can add expense shares to their trips"
  ON public.expense_shares FOR INSERT
  WITH CHECK (
    expense_id IN (
      SELECT id FROM public.expenses 
      WHERE trip_id IN (
        SELECT id FROM public.trips WHERE created_by = auth.uid()
      )
    )
  );

CREATE POLICY "Users can delete expense shares from their trips"
  ON public.expense_shares FOR DELETE
  USING (
    expense_id IN (
      SELECT id FROM public.expenses 
      WHERE trip_id IN (
        SELECT id FROM public.trips WHERE created_by = auth.uid()
      )
    )
  );
