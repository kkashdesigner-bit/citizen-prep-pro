
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create questions table
CREATE TABLE public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('Principles', 'Institutions', 'Rights', 'History', 'Living')),
  question_fr TEXT NOT NULL,
  question_translated TEXT,
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  is_subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier TEXT,
  exam_history JSONB DEFAULT '[]'::jsonb,
  used_questions UUID[] DEFAULT '{}',
  preferred_language TEXT DEFAULT 'fr',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Helper function: has_role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Questions RLS: everyone can read, only admins can modify
CREATE POLICY "Anyone can read questions"
  ON public.questions FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert questions"
  ON public.questions FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update questions"
  ON public.questions FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete questions"
  ON public.questions FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Profiles RLS: users can only access their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- User roles RLS: only admins can manage roles
CREATE POLICY "Admins can view roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
  ON public.user_roles FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_questions_updated_at
  BEFORE UPDATE ON public.questions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed the 20 questions from uploaded data
INSERT INTO public.questions (category, question_fr, options, correct_answer, explanation) VALUES
('Principles', 'Quelle est la devise de la République ?', '["Liberté, Égalité, Fraternité", "Paix, Travail, Patrie", "Unité et Force"]', 'Liberté, Égalité, Fraternité', 'Inscrite dans la Constitution de 1958.'),
('Principles', 'Quelle est la signification de la Laïcité ?', '["Interdiction des religions", "Neutralité de l''Etat face aux cultes", "Obligation religieuse"]', 'Neutralité de l''Etat face aux cultes', 'Loi de 1905 sur la séparation de l''Eglise et de l''Etat.'),
('Institutions', 'Qui élit le Président de la République ?', '["Les députés", "Le peuple (Suffrage Universel Direct)", "Le Sénat"]', 'Le peuple (Suffrage Universel Direct)', 'Election tous les 5 ans.'),
('Institutions', 'Où siège le Sénat ?', '["Palais Bourbon", "Palais du Luxembourg", "Palais de l''Elysée"]', 'Palais du Luxembourg', 'Le Sénat représente les collectivités territoriales.'),
('History', 'En quelle année la France a-t-elle adopté la Déclaration des Droits de l''Homme ?', '["1789", "1945", "1804"]', '1789', 'Rédigée au début de la Révolution française.'),
('History', 'Qui était le chef de la France Libre pendant la 2nde Guerre Mondiale ?', '["Napoléon", "Charles de Gaulle", "Victor Hugo"]', 'Charles de Gaulle', 'Il a lancé l''Appel du 18 juin.'),
('Rights', 'À quel âge peut-on voter en France ?', '["16 ans", "18 ans", "21 ans"]', '18 ans', 'Majorité civile et électorale.'),
('Living', 'Quel est le numéro d''urgence pour les pompiers ?', '["15", "17", "18"]', '18', 'Le 112 fonctionne aussi partout en Europe.'),
('Principles', 'Quel est l''emblème de la République ?', '["Le Coq", "Le Drapeau tricolore", "La Fleur de Lys"]', 'Le Drapeau tricolore', 'Bleu, blanc, rouge.'),
('Institutions', 'Combien y a-t-il de départements en France ?', '["95", "101", "110"]', '101', 'Incluant les départements d''outre-mer.'),
('History', 'Quelle est la date de la Fête Nationale ?', '["1er Mai", "14 Juillet", "11 Novembre"]', '14 Juillet', 'Commémore la prise de la Bastille et la Fête de la Fédération.'),
('Rights', 'Les femmes ont le droit de voter en France depuis :', '["1789", "1944", "1968"]', '1944', 'Le droit a été exercé pour la première fois en 1945.'),
('Principles', 'Marianne est une figure qui représente :', '["La Royauté", "La République", "L''Armée"]', 'La République', 'On trouve son buste dans toutes les mairies.'),
('Institutions', 'Quel est le rôle du Premier Ministre ?', '["Diriger le Gouvernement", "Voter les lois", "Juger les criminels"]', 'Diriger le Gouvernement', 'Il est nommé par le Président.'),
('Living', 'L''école est obligatoire jusqu''à quel âge ?', '["12 ans", "16 ans", "18 ans"]', '16 ans', 'L''instruction est obligatoire dès 3 ans.'),
('History', 'Qui a construit le Château de Versailles ?', '["Louis XIV", "Napoléon", "Charlemagne"]', 'Louis XIV', 'Le ''Roi Soleil''.'),
('Rights', 'La France est-elle un pays membre de l''Union Européenne ?', '["Oui", "Non", "Anciennement"]', 'Oui', 'Membre fondateur.'),
('Principles', 'Peut-on être forcé à se marier en France ?', '["Oui", "Non, le consentement est obligatoire", "Seulement par les parents"]', 'Non, le consentement est obligatoire', 'Le mariage forcé est un crime.'),
('Institutions', 'Qui vote les lois en France ?', '["Le Président", "Le Parlement (Assemblée et Sénat)", "La Police"]', 'Le Parlement (Assemblée et Sénat)', 'Le pouvoir législatif.'),
('Living', 'La sécurité sociale sert à :', '["Payer les impôts", "Rembourser les soins de santé", "Acheter une voiture"]', 'Rembourser les soins de santé', 'Basée sur la solidarité.');
