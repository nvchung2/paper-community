--
-- PostgreSQL database dump
--

-- Dumped from database version 13.5 (Ubuntu 13.5-0ubuntu0.21.04.1)
-- Dumped by pg_dump version 13.5 (Ubuntu 13.5-0ubuntu0.21.04.1)

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

--
-- Name: on_delete_article(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.on_delete_article() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
	update
	"user"
set
	"articlesCount" = "articlesCount" - 1
where
	"user".id = old."authorId";
delete from notification where "notifiableId" = old.id and "notifiableType" = 'article';
delete from reaction where "reactableId" = old.id and "reactableType" = 'article';
return new;
end
$$;


ALTER FUNCTION public.on_delete_article() OWNER TO postgres;

--
-- Name: on_delete_comment(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.on_delete_comment() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
	update
	"user"
set
	"commentsCount" = "commentsCount" - 1
where
	"user".id = old."authorId";
update
	article
set
	"commentsCount" = "commentsCount" - 1
where
	"article".id = old."articleId";
update "comment" set "childrenCount"="childrenCount"-1 where id=old."parentId";
delete from notification where "notifiableId" = old.id and ("notifiableType" = 'comment' or "notifiableType" = 'reply');
delete from reaction where "reactableId" = old.id and "reactableType" = 'comment';
return new;
end
$$;


ALTER FUNCTION public.on_delete_comment() OWNER TO postgres;

--
-- Name: on_delete_follow(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.on_delete_follow() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin 
	case old."followableType" when 'user' then
	update "user" set "followersCount" = "followersCount" -1 where id = old."followableId";
	delete from notification where "notifiableId" = old.id and "notifiableType"='follow';
else
	update tag set "followersCount" = "followersCount" -1 where id = old."followableId";
end case;
return new;
end
$$;


ALTER FUNCTION public.on_delete_follow() OWNER TO postgres;

--
-- Name: on_delete_reaction(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.on_delete_reaction() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin 
	case old."reactableType" when 'article' then 
	update article set "reactionsCount" ="reactionsCount" -1 where id = old."reactableId";
else update "comment" set "heartsCount" = "heartsCount"-1 where id = old."reactableId";
end case;
delete from notification where "notifiableType"='react' and "notifiableId"=old.id;
return new;
end
$$;


ALTER FUNCTION public.on_delete_reaction() OWNER TO postgres;

--
-- Name: on_delete_tag_article(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.on_delete_tag_article() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin 
	update tag set "articlesCount" = "articlesCount" -1 where id = old."tagId";
return new;
end
$$;


ALTER FUNCTION public.on_delete_tag_article() OWNER TO postgres;

--
-- Name: on_insert_article(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.on_insert_article() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
	update
	"user"
set
	"articlesCount" = "articlesCount" + 1
where
	"user".id = new."authorId";
return new;
end
$$;


ALTER FUNCTION public.on_insert_article() OWNER TO postgres;

--
-- Name: on_insert_comment(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.on_insert_comment() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
	update
	"user"
set
	"commentsCount" = "commentsCount" + 1
where
	"user".id = new."authorId";

update
	article
set
	"commentsCount" = "commentsCount" + 1
where
	"article".id = new."articleId";
update "comment" set "childrenCount"="childrenCount"+1 where id=new."parentId";
return new;
end
$$;


ALTER FUNCTION public.on_insert_comment() OWNER TO postgres;

--
-- Name: on_insert_follow(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.on_insert_follow() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin 
	case new."followableType" when 'user' then
	update "user" set "followersCount" = "followersCount" +1 where id = new."followableId";
else
	update tag set "followersCount" = "followersCount" +1 where id = new."followableId";
end case;
return new;
end
$$;


ALTER FUNCTION public.on_insert_follow() OWNER TO postgres;

--
-- Name: on_insert_reaction(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.on_insert_reaction() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin 
	case new."reactableType" when 'article' then 
	update article set "reactionsCount" ="reactionsCount" +1 where id = new."reactableId";
else update "comment" set "heartsCount" = "heartsCount"+1 where id = new."reactableId";
end case;
return new;
end
$$;


ALTER FUNCTION public.on_insert_reaction() OWNER TO postgres;

--
-- Name: on_insert_tag_article(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.on_insert_tag_article() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin 
	update tag set "articlesCount" = "articlesCount" +1 where id = new."tagId";
return new;
end
$$;


ALTER FUNCTION public.on_insert_tag_article() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: article; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.article (
    id character varying NOT NULL,
    title character varying NOT NULL,
    content character varying NOT NULL,
    "coverImage" character varying NOT NULL,
    "commentsCount" integer DEFAULT 0 NOT NULL,
    "viewsCount" integer DEFAULT 0 NOT NULL,
    "readingTime" integer NOT NULL,
    "createdTime" timestamp with time zone NOT NULL,
    "reactionsCount" integer DEFAULT 0 NOT NULL,
    "authorId" character varying,
    vector tsvector GENERATED ALWAYS AS (to_tsvector('english'::regconfig, (((title)::text || ' '::text) || (content)::text))) STORED
);


ALTER TABLE public.article OWNER TO postgres;

--
-- Name: comment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comment (
    id character varying NOT NULL,
    content character varying NOT NULL,
    "createdTime" timestamp with time zone NOT NULL,
    "heartsCount" integer DEFAULT 0 NOT NULL,
    "articleId" character varying NOT NULL,
    mpath character varying DEFAULT ''::character varying,
    "authorId" character varying,
    "parentId" character varying,
    "childrenCount" integer DEFAULT 0 NOT NULL,
    vector tsvector GENERATED ALWAYS AS (to_tsvector('english'::regconfig, (content)::text)) STORED
);


ALTER TABLE public.comment OWNER TO postgres;

--
-- Name: follow; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.follow (
    id character varying NOT NULL,
    "followableId" character varying NOT NULL,
    "followableType" character varying NOT NULL,
    "userId" character varying
);


ALTER TABLE public.follow OWNER TO postgres;

--
-- Name: notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification (
    id character varying NOT NULL,
    "notifiableId" character varying NOT NULL,
    "notifiableType" character varying NOT NULL,
    "createdTime" timestamp with time zone NOT NULL,
    read boolean DEFAULT false NOT NULL,
    data json,
    "targetId" character varying NOT NULL,
    "sourceId" character varying
);


ALTER TABLE public.notification OWNER TO postgres;

--
-- Name: reaction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reaction (
    id character varying NOT NULL,
    "reactableId" character varying NOT NULL,
    "reactableType" character varying NOT NULL,
    type character varying NOT NULL,
    "userId" character varying
);


ALTER TABLE public.reaction OWNER TO postgres;

--
-- Name: tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tag (
    id character varying NOT NULL,
    name character varying NOT NULL,
    "articlesCount" integer DEFAULT 0 NOT NULL,
    "followersCount" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.tag OWNER TO postgres;

--
-- Name: tag_articles_article; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tag_articles_article (
    "tagId" character varying NOT NULL,
    "articleId" character varying NOT NULL
);


ALTER TABLE public.tag_articles_article OWNER TO postgres;

--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id character varying NOT NULL,
    name character varying NOT NULL,
    bio character varying DEFAULT 'Unknown'::character varying NOT NULL,
    location character varying DEFAULT 'Unknown'::character varying NOT NULL,
    "githubLink" character varying DEFAULT 'https://github.com/jvjspy'::character varying NOT NULL,
    avatar character varying NOT NULL,
    work character varying DEFAULT 'Unknown'::character varying NOT NULL,
    email character varying DEFAULT 'unknown@unknown.com'::character varying NOT NULL,
    "socialId" character varying NOT NULL,
    "joinedDate" timestamp with time zone NOT NULL,
    "articlesCount" integer DEFAULT 0 NOT NULL,
    "commentsCount" integer DEFAULT 0 NOT NULL,
    "followersCount" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Data for Name: article; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.article (id, title, content, "coverImage", "commentsCount", "viewsCount", "readingTime", "createdTime", "reactionsCount", "authorId") FROM stdin;
\.


--
-- Data for Name: comment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comment (id, content, "createdTime", "heartsCount", "articleId", mpath, "authorId", "parentId", "childrenCount") FROM stdin;
\.


--
-- Data for Name: follow; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.follow (id, "followableId", "followableType", "userId") FROM stdin;
\.


--
-- Data for Name: notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notification (id, "notifiableId", "notifiableType", "createdTime", read, data, "targetId", "sourceId") FROM stdin;
\.


--
-- Data for Name: reaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reaction (id, "reactableId", "reactableType", type, "userId") FROM stdin;
\.


--
-- Data for Name: tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tag (id, name, "articlesCount", "followersCount") FROM stdin;
\.


--
-- Data for Name: tag_articles_article; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tag_articles_article ("tagId", "articleId") FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, name, bio, location, "githubLink", avatar, work, email, "socialId", "joinedDate", "articlesCount", "commentsCount", "followersCount") FROM stdin;
\.


--
-- Name: comment PK_0b0e4bbc8415ec426f87f3a88e2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY (id);


--
-- Name: tag_articles_article PK_2129190b0af0fac2a9dab842bb3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag_articles_article
    ADD CONSTRAINT "PK_2129190b0af0fac2a9dab842bb3" PRIMARY KEY ("tagId", "articleId");


--
-- Name: article PK_40808690eb7b915046558c0f81b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.article
    ADD CONSTRAINT "PK_40808690eb7b915046558c0f81b" PRIMARY KEY (id);


--
-- Name: reaction PK_41fbb346da22da4df129f14b11e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reaction
    ADD CONSTRAINT "PK_41fbb346da22da4df129f14b11e" PRIMARY KEY (id);


--
-- Name: notification PK_705b6c7cdf9b2c2ff7ac7872cb7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY (id);


--
-- Name: tag PK_8e4052373c579afc1471f526760; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag
    ADD CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY (id);


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: follow PK_fda88bc28a84d2d6d06e19df6e5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.follow
    ADD CONSTRAINT "PK_fda88bc28a84d2d6d06e19df6e5" PRIMARY KEY (id);


--
-- Name: IDX_00a259b3084b03e9a6ceaa19c5; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_00a259b3084b03e9a6ceaa19c5" ON public.tag_articles_article USING btree ("tagId");


--
-- Name: IDX_f5ed2bfd5725e6567b9f5a3d46; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_f5ed2bfd5725e6567b9f5a3d46" ON public.tag_articles_article USING btree ("articleId");


--
-- Name: article delete_article; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER delete_article AFTER DELETE ON public.article FOR EACH ROW EXECUTE FUNCTION public.on_delete_article();


--
-- Name: comment delete_comment; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER delete_comment AFTER DELETE ON public.comment FOR EACH ROW WHEN ((old."parentId" IS NOT NULL)) EXECUTE FUNCTION public.on_delete_comment();


--
-- Name: follow delete_follow; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER delete_follow AFTER DELETE ON public.follow FOR EACH ROW EXECUTE FUNCTION public.on_delete_follow();


--
-- Name: reaction delete_reaction; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER delete_reaction AFTER DELETE ON public.reaction FOR EACH ROW EXECUTE FUNCTION public.on_delete_reaction();


--
-- Name: tag_articles_article delete_tag_article; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER delete_tag_article AFTER DELETE ON public.tag_articles_article FOR EACH ROW EXECUTE FUNCTION public.on_delete_tag_article();


--
-- Name: article insert_article; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER insert_article AFTER INSERT ON public.article FOR EACH ROW EXECUTE FUNCTION public.on_insert_article();


--
-- Name: comment insert_comment; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER insert_comment AFTER INSERT ON public.comment FOR EACH ROW WHEN ((new."parentId" IS NOT NULL)) EXECUTE FUNCTION public.on_insert_comment();


--
-- Name: follow insert_follow; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER insert_follow AFTER INSERT ON public.follow FOR EACH ROW EXECUTE FUNCTION public.on_insert_follow();


--
-- Name: reaction insert_reaction; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER insert_reaction AFTER INSERT ON public.reaction FOR EACH ROW EXECUTE FUNCTION public.on_insert_reaction();


--
-- Name: tag_articles_article insert_tag_article; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER insert_tag_article AFTER INSERT ON public.tag_articles_article FOR EACH ROW EXECUTE FUNCTION public.on_insert_tag_article();


--
-- Name: tag_articles_article FK_00a259b3084b03e9a6ceaa19c5d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag_articles_article
    ADD CONSTRAINT "FK_00a259b3084b03e9a6ceaa19c5d" FOREIGN KEY ("tagId") REFERENCES public.tag(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comment FK_276779da446413a0d79598d4fbd; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT "FK_276779da446413a0d79598d4fbd" FOREIGN KEY ("authorId") REFERENCES public."user"(id);


--
-- Name: notification FK_6814e77599ba2264a2a3fe5ad80; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT "FK_6814e77599ba2264a2a3fe5ad80" FOREIGN KEY ("targetId") REFERENCES public."user"(id);


--
-- Name: notification FK_6ed10b6540f08b3cc6c8ed5f255; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT "FK_6ed10b6540f08b3cc6c8ed5f255" FOREIGN KEY ("sourceId") REFERENCES public."user"(id);


--
-- Name: article FK_a9c5f4ec6cceb1604b4a3c84c87; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.article
    ADD CONSTRAINT "FK_a9c5f4ec6cceb1604b4a3c84c87" FOREIGN KEY ("authorId") REFERENCES public."user"(id);


--
-- Name: follow FK_af9f90ce5e8f66f845ebbcc6f15; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.follow
    ADD CONSTRAINT "FK_af9f90ce5e8f66f845ebbcc6f15" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: comment FK_c20404221e5c125a581a0d90c0e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT "FK_c20404221e5c125a581a0d90c0e" FOREIGN KEY ("articleId") REFERENCES public.article(id) ON DELETE CASCADE;


--
-- Name: comment FK_e3aebe2bd1c53467a07109be596; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT "FK_e3aebe2bd1c53467a07109be596" FOREIGN KEY ("parentId") REFERENCES public.comment(id) ON DELETE CASCADE;


--
-- Name: reaction FK_e58a09ab17e3ce4c47a1a330ae1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reaction
    ADD CONSTRAINT "FK_e58a09ab17e3ce4c47a1a330ae1" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: tag_articles_article FK_f5ed2bfd5725e6567b9f5a3d46b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag_articles_article
    ADD CONSTRAINT "FK_f5ed2bfd5725e6567b9f5a3d46b" FOREIGN KEY ("articleId") REFERENCES public.article(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

