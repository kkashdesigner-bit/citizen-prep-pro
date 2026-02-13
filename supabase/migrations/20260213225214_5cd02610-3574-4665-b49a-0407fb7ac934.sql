
-- Seed missing category lessons (Politics, Society at CSP) and CR/Naturalisation levels for all categories

-- Politics CSP lessons
INSERT INTO public.lessons (category, level, title, content, estimated_minutes, order_index) VALUES
  ('Politics', 'CSP', 'Le système politique français', 'Découvrez le fonctionnement du système politique en France : partis, élections et participation citoyenne.', 12, 1),
  ('Politics', 'CSP', 'Les élections en France', 'Comprendre les différents types d''élections et le processus électoral français.', 10, 2),
  ('Politics', 'CSP', 'Engagement citoyen', 'Les formes de participation politique et civique en France.', 8, 3);

-- Society CSP lessons
INSERT INTO public.lessons (category, level, title, content, estimated_minutes, order_index) VALUES
  ('Society', 'CSP', 'La société française contemporaine', 'Panorama de la société française : diversité, cohésion sociale et enjeux actuels.', 12, 1),
  ('Society', 'CSP', 'Culture et patrimoine', 'Les grands repères culturels français : arts, gastronomie et traditions.', 10, 2),
  ('Society', 'CSP', 'Vivre ensemble', 'Les règles du vivre ensemble : respect, tolérance et solidarité.', 8, 3);

-- CR level lessons (2 per category)
INSERT INTO public.lessons (category, level, title, content, estimated_minutes, order_index) VALUES
  ('Principles', 'CR', 'Approfondissement des valeurs républicaines', 'Analyse détaillée de la devise, des symboles et de la laïcité dans le cadre de la carte de résident.', 15, 10),
  ('Principles', 'CR', 'La laïcité en pratique', 'Applications concrètes du principe de laïcité dans la vie quotidienne.', 12, 11),
  ('Institutions', 'CR', 'Les institutions approfondies', 'Fonctionnement détaillé des pouvoirs exécutif, législatif et judiciaire.', 15, 10),
  ('Institutions', 'CR', 'Les collectivités territoriales', 'Organisation administrative de la France : régions, départements, communes.', 12, 11),
  ('Rights', 'CR', 'Droits et devoirs du résident', 'Droits spécifiques liés à la carte de résident et obligations associées.', 15, 10),
  ('Rights', 'CR', 'Protection sociale', 'Le système de protection sociale français et ses prestations.', 12, 11),
  ('History', 'CR', 'Histoire constitutionnelle', 'Les grandes étapes de l''histoire constitutionnelle française.', 15, 10),
  ('History', 'CR', 'La France dans le monde', 'Le rôle de la France dans la construction européenne et les organisations internationales.', 12, 11),
  ('Living', 'CR', 'Administration et démarches', 'Maîtriser les démarches administratives essentielles pour le résident.', 15, 10),
  ('Living', 'CR', 'Le système éducatif', 'Comprendre le système scolaire français et l''enseignement supérieur.', 12, 11),
  ('Politics', 'CR', 'Institutions politiques avancées', 'Analyse approfondie du système politique et des processus décisionnels.', 15, 10),
  ('Politics', 'CR', 'Politique européenne', 'La France dans l''Union européenne : institutions et politiques communes.', 12, 11),
  ('Society', 'CR', 'Enjeux sociétaux', 'Les grands débats de société en France : environnement, numérique, égalité.', 15, 10),
  ('Society', 'CR', 'Économie et emploi', 'Le marché du travail français et les droits des travailleurs.', 12, 11);

-- Naturalisation level lessons (2 per category)
INSERT INTO public.lessons (category, level, title, content, estimated_minutes, order_index) VALUES
  ('Principles', 'Naturalisation', 'Expertise constitutionnelle', 'Maîtrise approfondie de la Constitution et du bloc de constitutionnalité.', 20, 20),
  ('Principles', 'Naturalisation', 'Philosophie républicaine', 'Les fondements philosophiques de la République française.', 18, 21),
  ('Institutions', 'Naturalisation', 'Droit constitutionnel avancé', 'Contrôle de constitutionnalité et hiérarchie des normes.', 20, 20),
  ('Institutions', 'Naturalisation', 'Justice et juridictions', 'Organisation judiciaire et administrative en détail.', 18, 21),
  ('Rights', 'Naturalisation', 'Droit international et droits de l''homme', 'La France et les conventions internationales de protection des droits.', 20, 20),
  ('Rights', 'Naturalisation', 'Citoyenneté et nationalité', 'Acquisition, droits et devoirs liés à la nationalité française.', 18, 21),
  ('History', 'Naturalisation', 'Histoire politique approfondie', 'De la Révolution à la Ve République : analyse des transformations politiques.', 20, 20),
  ('History', 'Naturalisation', 'Patrimoine et mémoire', 'Les lieux de mémoire et le patrimoine culturel français.', 18, 21),
  ('Living', 'Naturalisation', 'Intégration avancée', 'Maîtrise complète de la vie en France : fiscalité, santé, logement.', 20, 20),
  ('Living', 'Naturalisation', 'Droits et obligations du citoyen', 'Responsabilités civiques complètes du citoyen français.', 18, 21),
  ('Politics', 'Naturalisation', 'Système politique expert', 'Analyse experte des institutions et processus politiques français.', 20, 20),
  ('Politics', 'Naturalisation', 'Géopolitique française', 'La France sur la scène internationale : diplomatie et défense.', 18, 21),
  ('Society', 'Naturalisation', 'Société et culture avancées', 'Compréhension experte de la société française contemporaine.', 20, 20),
  ('Society', 'Naturalisation', 'Innovation et avenir', 'Les défis contemporains de la France : transition écologique, numérique.', 18, 21);
