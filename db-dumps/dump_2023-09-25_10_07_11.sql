--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2
-- Dumped by pg_dump version 15.2

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

ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_pkey";
ALTER TABLE ONLY public."SequelizeMeta" DROP CONSTRAINT "SequelizeMeta_pkey";
ALTER TABLE ONLY public."HotelRooms" DROP CONSTRAINT "HotelRooms_pkey";
ALTER TABLE ONLY public."Clients" DROP CONSTRAINT "Clients_pkey";
ALTER TABLE ONLY public."Bookings" DROP CONSTRAINT "Bookings_pkey";
ALTER TABLE ONLY public."Assets" DROP CONSTRAINT "Assets_pkey";
ALTER TABLE public."Users" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public."HotelRooms" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public."Clients" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public."Bookings" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public."Assets" ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE public."Users_id_seq";
DROP TABLE public."Users";
DROP TABLE public."SequelizeMeta";
DROP SEQUENCE public."HotelRooms_id_seq";
DROP TABLE public."HotelRooms";
DROP SEQUENCE public."Clients_id_seq";
DROP TABLE public."Clients";
DROP SEQUENCE public."Bookings_id_seq";
DROP TABLE public."Bookings";
DROP SEQUENCE public."Assets_id_seq";
DROP TABLE public."Assets";
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Assets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Assets" (
    id integer NOT NULL,
    "strId" character varying(255) NOT NULL,
    type character varying(255),
    "pathName" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."Assets" OWNER TO postgres;

--
-- Name: Assets_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Assets_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Assets_id_seq" OWNER TO postgres;

--
-- Name: Assets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Assets_id_seq" OWNED BY public."Assets".id;


--
-- Name: Bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Bookings" (
    id integer NOT NULL,
    "strId" character varying(255) NOT NULL,
    "hotelRoomStrId" character varying(255) NOT NULL,
    "clientStrId" character varying(255) NOT NULL,
    status character varying(255),
    "checkInAt" timestamp with time zone NOT NULL,
    "checkOutAt" timestamp with time zone NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."Bookings" OWNER TO postgres;

--
-- Name: Bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Bookings_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Bookings_id_seq" OWNER TO postgres;

--
-- Name: Bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Bookings_id_seq" OWNED BY public."Bookings".id;


--
-- Name: Clients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Clients" (
    id integer NOT NULL,
    "strId" character varying(255) NOT NULL,
    name character varying(255),
    phone character varying(255),
    email character varying(255),
    status character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."Clients" OWNER TO postgres;

--
-- Name: Clients_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Clients_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Clients_id_seq" OWNER TO postgres;

--
-- Name: Clients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Clients_id_seq" OWNED BY public."Clients".id;


--
-- Name: HotelRooms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."HotelRooms" (
    id integer NOT NULL,
    "strId" character varying(255) NOT NULL,
    name character varying(255),
    description text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."HotelRooms" OWNER TO postgres;

--
-- Name: HotelRooms_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."HotelRooms_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."HotelRooms_id_seq" OWNER TO postgres;

--
-- Name: HotelRooms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."HotelRooms_id_seq" OWNED BY public."HotelRooms".id;


--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO postgres;

--
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    id integer NOT NULL,
    "strId" character varying(255) NOT NULL,
    name character varying(255),
    login character varying(255),
    password character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Users_id_seq" OWNER TO postgres;

--
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;


--
-- Name: Assets id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Assets" ALTER COLUMN id SET DEFAULT nextval('public."Assets_id_seq"'::regclass);


--
-- Name: Bookings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Bookings" ALTER COLUMN id SET DEFAULT nextval('public."Bookings_id_seq"'::regclass);


--
-- Name: Clients id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Clients" ALTER COLUMN id SET DEFAULT nextval('public."Clients_id_seq"'::regclass);


--
-- Name: HotelRooms id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."HotelRooms" ALTER COLUMN id SET DEFAULT nextval('public."HotelRooms_id_seq"'::regclass);


--
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);


--
-- Data for Name: Assets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Assets" (id, "strId", type, "pathName", "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: Bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Bookings" (id, "strId", "hotelRoomStrId", "clientStrId", status, "checkInAt", "checkOutAt", "createdAt", "updatedAt", "deletedAt") FROM stdin;
2	-NV995KYi6ilpQoQkeKPM	hotelRoom1	client1	not-confirmed	2023-09-25 03:56:19.569+00	2023-09-25 03:56:19.569+00	2023-09-25 03:56:19.683+00	2023-09-25 03:56:19.683+00	\N
3	wPn-_IoNUgRyMDTK9Eioo	hotelRoom1	client1	not-confirmed	2023-09-25 04:04:53.296+00	2023-09-25 04:04:53.296+00	2023-09-25 04:04:53.372+00	2023-09-25 04:04:53.372+00	\N
4	382qjgV0Ai4wdKPUPddHv	hotelRoom1	client1	not-confirmed	2023-09-25 04:07:09.812+00	2023-09-25 04:07:09.812+00	2023-09-25 04:07:09.841+00	2023-09-25 04:07:09.841+00	\N
5	x5ikajq3sDv18TpGYg5iW	hotelRoom1	client1	not-confirmed	2023-09-25 04:07:52.852+00	2023-09-25 04:07:52.852+00	2023-09-25 04:07:52.905+00	2023-09-25 04:07:52.905+00	\N
6	lBHCqQZEri9CRFL8q6frq	hotelRoom1	client1	not-confirmed	2023-09-25 04:08:52.973+00	2023-09-25 04:08:52.973+00	2023-09-25 04:08:53.004+00	2023-09-25 04:08:53.004+00	\N
7	xJyC-H-0U1uVcf9C4X632	hotelRoom1	client1	not-confirmed	2023-09-25 04:10:53.712+00	2023-09-25 04:10:53.712+00	2023-09-25 04:10:53.749+00	2023-09-25 04:10:53.749+00	\N
8	RGeeypMeQUW04tYyUbAPv	hotelRoom1	client1	not-confirmed	2023-09-25 04:11:27.753+00	2023-09-25 04:11:27.753+00	2023-09-25 04:11:27.785+00	2023-09-25 04:11:27.785+00	\N
9	0KgYWXeHy_jm6X4_3Eb5m	hotelRoom1	client1	not-confirmed	2023-09-25 04:12:32.436+00	2023-09-25 04:12:32.436+00	2023-09-25 04:12:32.463+00	2023-09-25 04:12:32.463+00	\N
10	z0pKJ0yWPwIcQAKskWcU8	hotelRoom1	client1	not-confirmed	2023-09-25 04:14:24.973+00	2023-09-25 04:14:24.973+00	2023-09-25 04:14:25.019+00	2023-09-25 04:14:25.019+00	\N
11	-NaC74pD7Vhm0phb0aORb	hotelRoom1	client1	not-confirmed	2023-09-25 04:15:55.776+00	2023-09-25 04:15:55.776+00	2023-09-25 04:15:55.805+00	2023-09-25 04:15:55.805+00	\N
12	c_051x7I1IigpAAplFOdc	hotelRoom1	client1	not-confirmed	2023-09-25 04:25:49.825+00	2023-09-25 04:25:49.825+00	2023-09-25 04:25:49.869+00	2023-09-25 04:25:49.869+00	\N
18	ZI1M8-GhyceW41jUxl7KI	hotelRoom1	client1	cancelled	2024-01-01 10:00:00+00	2024-01-05 07:00:00+00	2023-09-25 04:50:11.034+00	2023-09-25 04:50:14.094+00	\N
19	c-6C2afPZC4_-f_lSZjMP	hotelRoom1	client1	cancelled	2024-01-01 10:00:00+00	2024-01-05 07:00:00+00	2023-09-25 04:52:35.007+00	2023-09-25 04:52:38.072+00	\N
20	LgR0vx0VhNee6-4L-1iIC	hotelRoom1	client1	cancelled	2024-01-01 10:00:00+00	2024-01-05 07:00:00+00	2023-09-25 04:56:46.655+00	2023-09-25 04:56:49.741+00	\N
21	bcpJLeSp79GEEy881ET40	hotelRoom1	client1	cancelled	2024-01-01 10:00:00+00	2024-01-05 07:00:00+00	2023-09-25 04:58:55.321+00	2023-09-25 04:58:58.379+00	\N
\.


--
-- Data for Name: Clients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Clients" (id, "strId", name, phone, email, status, "createdAt", "updatedAt", "deletedAt") FROM stdin;
2	client1	Лев Трифонов	+79120333533	levtrifonov@mail.ru	VIP	2023-09-24 19:26:13.173+00	2023-09-24 19:26:13.173+00	\N
\.


--
-- Data for Name: HotelRooms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."HotelRooms" (id, "strId", name, description, "createdAt", "updatedAt", "deletedAt") FROM stdin;
1	hotelRoom1	Комната 1(тестовая)	Какая-то комната в каком-то отеле	2023-09-24 19:26:13.182+00	2023-09-24 19:26:13.182+00	\N
2	hotelRoom2	Комната 2(тестовая)	Какая-то комната в каком-то отеле	2023-09-24 19:26:13.182+00	2023-09-24 19:26:13.182+00	\N
\.


--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SequelizeMeta" (name) FROM stdin;
20230923171631-create-Users.js
20230923174209-create-Assets.js
20230924083655-create-HotelRooms.js
20230924085042-create-Clients.js
20230924091321-create-Bookings.js
20230924091400-create-Bookings.js
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" (id, "strId", name, login, password, "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Name: Assets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Assets_id_seq"', 1, false);


--
-- Name: Bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Bookings_id_seq"', 21, true);


--
-- Name: Clients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Clients_id_seq"', 2, true);


--
-- Name: HotelRooms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."HotelRooms_id_seq"', 2, true);


--
-- Name: Users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Users_id_seq"', 1, false);


--
-- Name: Assets Assets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Assets"
    ADD CONSTRAINT "Assets_pkey" PRIMARY KEY (id);


--
-- Name: Bookings Bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Bookings"
    ADD CONSTRAINT "Bookings_pkey" PRIMARY KEY (id);


--
-- Name: Clients Clients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Clients"
    ADD CONSTRAINT "Clients_pkey" PRIMARY KEY (id);


--
-- Name: HotelRooms HotelRooms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."HotelRooms"
    ADD CONSTRAINT "HotelRooms_pkey" PRIMARY KEY (id);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

