CREATE DATABASE IF NOT EXISTS pokemon_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE pokemon_db;

CREATE TABLE generations (
  id      INT PRIMARY KEY UNIQUE AUTO_INCREMENT,
  number  INT          NOT NULL,
  name    VARCHAR(50)  NOT NULL,
  region  VARCHAR(50)  NOT NULL
);

CREATE TABLE types (
  id     INT PRIMARY KEY UNIQUE AUTO_INCREMENT,
  name   VARCHAR(30) NOT NULL,
  color  VARCHAR(7)  NOT NULL DEFAULT '#A8A878'
);

CREATE TABLE abilities (
  id           INT PRIMARY KEY UNIQUE AUTO_INCREMENT,
  name         VARCHAR(60)  NOT NULL,
  description  VARCHAR(255) NULL
);

CREATE TABLE pokemon (
  id               INT PRIMARY KEY UNIQUE AUTO_INCREMENT,
  pokedex_number   INT           NOT NULL,
  name             VARCHAR(60)   NOT NULL,
  description      TEXT          NULL,
  height_m         FLOAT         NULL,
  weight_kg        FLOAT         NULL,
  base_experience  INT           NULL,
  sprite_url       VARCHAR(500)  NULL,
  generation_id    INT           NOT NULL,
  created_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
                                 ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_pokemon_generation
    FOREIGN KEY (generation_id) REFERENCES generations(id)
);

CREATE TABLE pokemon_stats (
  id          INT PRIMARY KEY UNIQUE AUTO_INCREMENT,
  pokemon_id  INT     NOT NULL,
  hp          INT     NOT NULL DEFAULT 0,
  attack      INT     NOT NULL DEFAULT 0,
  defense     INT     NOT NULL DEFAULT 0,
  sp_attack   INT     NOT NULL DEFAULT 0,
  sp_defense  INT     NOT NULL DEFAULT 0,
  speed       INT     NOT NULL DEFAULT 0,
  CONSTRAINT fk_stats_pokemon
    FOREIGN KEY (pokemon_id) REFERENCES pokemon(id) ON DELETE CASCADE
);

CREATE TABLE pokemon_types (
  id          INT PRIMARY KEY UNIQUE AUTO_INCREMENT,
  pokemon_id  INT     NOT NULL,
  type_id     INT     NOT NULL,
  slot        INT     NOT NULL DEFAULT 1,
  CONSTRAINT fk_pt_pokemon
    FOREIGN KEY (pokemon_id) REFERENCES pokemon(id) ON DELETE CASCADE,
  CONSTRAINT fk_pt_type
    FOREIGN KEY (type_id)    REFERENCES types(id)
);

CREATE TABLE pokemon_abilities (
  id          INT PRIMARY KEY UNIQUE AUTO_INCREMENT,
  pokemon_id  INT      NOT NULL,
  ability_id  INT      NOT NULL,
  is_hidden   BOOLEAN  NOT NULL DEFAULT FALSE,
  CONSTRAINT fk_pa_pokemon
    FOREIGN KEY (pokemon_id) REFERENCES pokemon(id) ON DELETE CASCADE,
  CONSTRAINT fk_pa_ability
    FOREIGN KEY (ability_id) REFERENCES abilities(id)
);

INSERT INTO generations (number, name, region) VALUES
  (1, 'Generation I',   'Kanto'),
  (2, 'Generation II',  'Johto'),
  (3, 'Generation III', 'Hoenn'),
  (4, 'Generation IV',  'Sinnoh'),
  (5, 'Generation V',   'Unova'),
  (6, 'Generation VI',  'Kalos'),
  (7, 'Generation VII', 'Alola'),
  (8, 'Generation VIII','Galar'),
  (9, 'Generation IX',  'Paldea');

INSERT INTO types (name, color) VALUES
  ('normal',   '#A8A878'),
  ('fire',     '#F08030'),
  ('water',    '#6890F0'),
  ('electric', '#F8D030'),
  ('grass',    '#78C850'),
  ('ice',      '#98D8D8'),
  ('fighting', '#C03028'),
  ('poison',   '#A040A0'),
  ('ground',   '#E0C068'),
  ('flying',   '#A890F0'),
  ('psychic',  '#F85888'),
  ('bug',      '#A8B820'),
  ('rock',     '#B8A038'),
  ('ghost',    '#705898'),
  ('dragon',   '#7038F8'),
  ('dark',     '#705848'),
  ('steel',    '#B8B8D0'),
  ('fairy',    '#EE99AC');

INSERT INTO abilities (name, description) VALUES
  ('overgrow',     'Potencia movimientos de planta en apuros.'),
  ('chlorophyll',  'Duplica la velocidad bajo el sol.'),
  ('blaze',        'Potencia movimientos de fuego en apuros.'),
  ('solar-power',  'Sube el ataque especial bajo el sol.'),
  ('torrent',      'Potencia movimientos de agua en apuros.'),
  ('static',       'Puede paralizar al contacto.'),
  ('lightning-rod','Atrae ataques eléctricos.'),
  ('cursed-body',  'Puede anular el movimiento que le golpea.'),
  ('run-away',     'Garantiza la huida de combates salvajes.'),
  ('adaptability', 'Potencia los movimientos del mismo tipo.'),
  ('inner-focus',  'Impide retroceder.'),
  ('pressure',     'Presiona al rival para gastar más PP.');

INSERT INTO pokemon
  (pokedex_number, name, description, height_m, weight_kg, base_experience, sprite_url, generation_id)
VALUES
  (1,   'bulbasaur',  'Semilla Pokémon.',   0.7,   6.9, 64,
   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',   1),
  (4,   'charmander', 'Lagartija Pokémon.', 0.6,   8.5, 62,
   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',   1),
  (7,   'squirtle',   'Tortuguita Pokémon.',0.5,   9.0, 63,
   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png',   1),
  (25,  'pikachu',    'Ratón Pokémon.',     0.4,   6.0, 112,
   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',  1),
  (94,  'gengar',     'Sombra Pokémon.',    1.5,  40.5, 225,
   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png',  1),
  (133, 'eevee',      'Evolución Pokémon.', 0.3,   6.5, 65,
   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png', 1),
  (149, 'dragonite',  'Dragón Pokémon.',    2.2, 210.0, 270,
   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png', 1),
  (150, 'mewtwo',     'Genético Pokémon.',  2.0, 122.0, 306,
   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png', 1);

INSERT INTO pokemon_stats (pokemon_id, hp, attack, defense, sp_attack, sp_defense, speed) VALUES
  (1,  45,  49,  49,  65,  65,  45),
  (2,  39,  52,  43,  60,  50,  65),
  (3,  44,  48,  65,  50,  64,  43),
  (4,  35,  55,  40,  50,  50,  90),
  (5,  60,  65,  60, 130,  75, 110),
  (6,  55,  55,  50,  45,  65,  55),
  (7,  91, 134,  95, 100, 100,  80),
  (8, 106, 110,  90, 154,  90, 130);

INSERT INTO pokemon_types (pokemon_id, type_id, slot) VALUES
  (1, 5, 1), (1, 8, 2),   -- bulbasaur: grass / poison
  (2, 2, 1),              -- charmander: fire
  (3, 3, 1),              -- squirtle: water
  (4, 4, 1),              -- pikachu: electric
  (5, 14, 1), (5, 8, 2),  -- gengar: ghost / poison
  (6, 1, 1),              -- eevee: normal
  (7, 15, 1), (7, 10, 2), -- dragonite: dragon / flying
  (8, 11, 1);             -- mewtwo: psychic

INSERT INTO pokemon_abilities (pokemon_id, ability_id, is_hidden) VALUES
  (1, 1, FALSE), (1, 2, TRUE),
  (2, 3, FALSE), (2, 4, TRUE),
  (3, 5, FALSE),
  (4, 6, FALSE), (4, 7, TRUE),
  (5, 8, FALSE),
  (6, 9, FALSE), (6, 10, TRUE),
  (7, 11, FALSE),
  (8, 12, FALSE);