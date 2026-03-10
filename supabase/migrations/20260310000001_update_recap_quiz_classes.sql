-- Update class titles and descriptions for Quiz Récapitulatif classes (every 10th class)
-- These are the last class of each module and should launch a 20-question recap quiz

UPDATE classes SET
  title = 'Quiz Récapitulatif — Les Valeurs Fondamentales de la République',
  description = 'Testez vos connaissances sur l''ensemble du Module 1 avec 20 questions aléatoires. Obtenez 80% ou plus pour valider le module.',
  class_type = 'quiz_recap'
WHERE class_number = 10;

UPDATE classes SET
  title = 'Quiz Récapitulatif — Les Symboles et Principes Républicains',
  description = 'Testez vos connaissances sur l''ensemble du Module 2 avec 20 questions aléatoires. Obtenez 80% ou plus pour valider le module.',
  class_type = 'quiz_recap'
WHERE class_number = 20;

UPDATE classes SET
  title = 'Quiz Récapitulatif — Le Pouvoir Exécutif',
  description = 'Testez vos connaissances sur l''ensemble du Module 3 avec 20 questions aléatoires. Obtenez 80% ou plus pour valider le module.',
  class_type = 'quiz_recap'
WHERE class_number = 30;

UPDATE classes SET
  title = 'Quiz Récapitulatif — Le Pouvoir Législatif et Judiciaire',
  description = 'Testez vos connaissances sur l''ensemble du Module 4 avec 20 questions aléatoires. Obtenez 80% ou plus pour valider le module.',
  class_type = 'quiz_recap'
WHERE class_number = 40;

UPDATE classes SET
  title = 'Quiz Récapitulatif — Les Droits Fondamentaux',
  description = 'Testez vos connaissances sur l''ensemble du Module 5 avec 20 questions aléatoires. Obtenez 80% ou plus pour valider le module.',
  class_type = 'quiz_recap'
WHERE class_number = 50;

UPDATE classes SET
  title = 'Quiz Récapitulatif — Les Devoirs et la Citoyenneté',
  description = 'Testez vos connaissances sur l''ensemble du Module 6 avec 20 questions aléatoires. Obtenez 80% ou plus pour valider le module.',
  class_type = 'quiz_recap'
WHERE class_number = 60;

UPDATE classes SET
  title = 'Quiz Récapitulatif — L''Histoire de France',
  description = 'Testez vos connaissances sur l''ensemble du Module 7 avec 20 questions aléatoires. Obtenez 80% ou plus pour valider le module.',
  class_type = 'quiz_recap'
WHERE class_number = 70;

UPDATE classes SET
  title = 'Quiz Récapitulatif — La Géographie et la Culture Française',
  description = 'Testez vos connaissances sur l''ensemble du Module 8 avec 20 questions aléatoires. Obtenez 80% ou plus pour valider le module.',
  class_type = 'quiz_recap'
WHERE class_number = 80;

UPDATE classes SET
  title = 'Quiz Récapitulatif — Économie, Travail et Protection Sociale',
  description = 'Testez vos connaissances sur l''ensemble du Module 9 avec 20 questions aléatoires. Obtenez 80% ou plus pour valider le module.',
  class_type = 'quiz_recap'
WHERE class_number = 90;

UPDATE classes SET
  title = 'Quiz Récapitulatif — Vie Quotidienne et Intégration',
  description = 'Testez vos connaissances sur l''ensemble du Module 10 avec 20 questions aléatoires. Obtenez 80% ou plus pour valider le module.',
  class_type = 'quiz_recap'
WHERE class_number = 100;
