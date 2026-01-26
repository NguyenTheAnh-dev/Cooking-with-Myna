-- Seed data for public.characters

INSERT INTO public.characters (code, name, image_url)
VALUES
  ('GIRL_01', 'Chef Girl Main', '/characters/char-girl-1.png'),
  ('GIRL_02', 'Chef Girl Buns', '/characters/char-girl-2.png'),
  ('GIRL_03', 'Chef Girl Headband', '/characters/char-girl-3.png'),
  ('GIRL_04', 'Chef Girl Ponytail', '/characters/char-girl-4.png'),
  ('GIRL_05', 'Chef Girl Braids', '/characters/char-girl-5.png'),
  ('BOY_01', 'Chef Boy Main', '/characters/char-boy-1.png'),
  ('BOY_02', 'Chef Boy Glasses', '/characters/char-boy-2.png'),
  ('BOY_03', 'Chef Boy Spiky', '/characters/char-boy-3.png')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url;
