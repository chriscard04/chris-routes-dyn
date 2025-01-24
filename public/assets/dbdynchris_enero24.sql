--
-- PostgreSQL database dump
--

-- Dumped from database version 15.10 (Homebrew)
-- Dumped by pg_dump version 15.10 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: orden; Type: TABLE; Schema: public; Owner: chriscard11
--

CREATE TABLE public.orden (
    id_orden integer NOT NULL,
    secuencia integer,
    valor numeric,
    prioritario boolean,
    ruta_id integer
);


ALTER TABLE public.orden OWNER TO chriscard11;

--
-- Name: ruta; Type: TABLE; Schema: public; Owner: chriscard11
--

CREATE TABLE public.ruta (
    id_ruta integer NOT NULL,
    conductor integer,
    fecha_entrega timestamp with time zone,
    notas text
);


ALTER TABLE public.ruta OWNER TO chriscard11;

--
-- Data for Name: orden; Type: TABLE DATA; Schema: public; Owner: chriscard11
--

COPY public.orden (id_orden, secuencia, valor, prioritario, ruta_id) FROM stdin;
3812530	1	36.93	f	236699
3812562	2	34.16	f	236699
3812564	3	275.54	t	236699
3812539	4	17.96	f	236699
3812525	5	52.31	f	236699
3812558	6	46.09	f	236699
3812548	7	14.14	f	236699
3812563	8	7.2	f	236699
3812565	9	26.91	f	236699
3815202	1	12.48	t	237008
3815241	2	17.08	t	237008
3815244	3	33.77	f	237008
3000104	1	31.1	t	235005
3000105	2	70.5	t	235005
3797342	1	7.7	t	235641
3797363	2	47.21	f	235641
3797332	3	49.36	f	235641
3797360	4	97.6	t	235641
3807614	1	85.9	f	236354
3807608	2	17.91	f	236354
3807610	3	113.75	f	236354
3807622	4	56.58	f	236354
3807624	5	13.23	f	236354
3807627	6	333.64	t	236354
\.


--
-- Data for Name: ruta; Type: TABLE DATA; Schema: public; Owner: chriscard11
--

COPY public.ruta (id_ruta, conductor, fecha_entrega, notas) FROM stdin;
235641	13	2025-01-07 00:00:00-05	\N
236354	12	2024-11-04 00:00:00-05	Agregada nueva
236699	17	2024-11-05 00:00:00-05	\N
237008	18	2024-11-06 00:00:00-05	Ruta Editada
235005	9	2025-02-01 00:00:00-05	Actualizado
\.


--
-- Name: orden orden_pkey; Type: CONSTRAINT; Schema: public; Owner: chriscard11
--

ALTER TABLE ONLY public.orden
    ADD CONSTRAINT orden_pkey PRIMARY KEY (id_orden);


--
-- Name: ruta ruta_pkey; Type: CONSTRAINT; Schema: public; Owner: chriscard11
--

ALTER TABLE ONLY public.ruta
    ADD CONSTRAINT ruta_pkey PRIMARY KEY (id_ruta);


--
-- Name: orden orden_ruta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chriscard11
--

ALTER TABLE ONLY public.orden
    ADD CONSTRAINT orden_ruta_id_fkey FOREIGN KEY (ruta_id) REFERENCES public.ruta(id_ruta);


--
-- PostgreSQL database dump complete
--

