--DROP TEXT SEARCH DICTIONARY IF EXISTS spanish_hunspell;
--CREATE TEXT SEARCH DICTIONARY spanish_hunspell (
--    TEMPLATE = ispell,
--    DictFile = es_spell,
--    AffFile = es_spell,
--    StopWords = spanish
--);

DROP TEXT SEARCH DICTIONARY IF EXISTS public.streets_synonyms;
CREATE TEXT SEARCH DICTIONARY public.streets_synonyms (
    TEMPLATE = synonym,
    SYNONYMS = streets
);

DROP TEXT SEARCH DICTIONARY IF EXISTS public.streets_simple;
CREATE TEXT SEARCH DICTIONARY public.streets_simple (
    TEMPLATE = pg_catalog.simple,
    STOPWORDS = streets
);

DROP TEXT SEARCH CONFIGURATION IF EXISTS public.cuba;
CREATE TEXT SEARCH CONFIGURATION public.cuba ( COPY = pg_catalog.spanish );
ALTER TEXT SEARCH CONFIGURATION public.cuba
ALTER MAPPING FOR asciiword, asciihword, hword_asciipart,
                      word, hword, hword_part
WITH unaccent, spanish_stem;

DROP TEXT SEARCH CONFIGURATION IF EXISTS public.cuba_streets;
CREATE TEXT SEARCH CONFIGURATION public.cuba_streets ( COPY = pg_catalog.spanish );
ALTER TEXT SEARCH CONFIGURATION public.cuba_streets
ALTER MAPPING FOR asciiword, asciihword, hword_asciipart,
                      word, hword, hword_part,
                      numword, numhword, hword_numpart
WITH unaccent, public.streets_synonyms, public.streets_simple;
