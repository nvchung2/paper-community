--Insert comment trigger
create or replace
function on_insert_comment()
returns trigger
language plpgsql
as
$$
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
return new;
end
$$;
drop trigger if exists insert_comment on comment;
create trigger insert_comment after insert on comment for each row when (new."parentId" is not null) execute procedure on_insert_comment();
-- Delete comment trigger
create or replace
function on_delete_comment()
returns trigger
language plpgsql
as
$$
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
delete from notification where "notifiableId" = old.id and ("notifiableType" = 'comment' or "notifiableType" = 'reply');
delete from reaction where "reactableId" = old.id and "reactableType" = 'comment';
return new;
end
$$;
drop trigger if exists delete_comment on comment;
create trigger delete_comment after delete on comment for each row when (old."parentId" is not null) execute procedure on_delete_comment();

--Insert article trigger
create or replace
function on_insert_article()
returns trigger
language plpgsql
as
$$
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
drop trigger if exists insert_article on article;
create trigger insert_article after insert on article for each row execute procedure on_insert_article();
-- Delete article trigger
create or replace
function on_delete_article()
returns trigger
language plpgsql
as
$$
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
drop trigger if exists delete_article on article;
create trigger delete_article after delete on article for each row execute procedure on_delete_article();
-- Insert tag_article trigger
create or replace function on_insert_tag_article()
returns trigger
language plpgsql
as 
$$
begin 
	update tag set "articlesCount" = "articlesCount" +1 where id = new."tagId";
return new;
end
$$;
drop trigger if exists insert_tag_article on tag_articles_article;
create trigger insert_tag_article after insert on tag_articles_article for each row execute procedure on_insert_tag_article();
-- Delete tag_article trigger
create or replace function on_delete_tag_article()
returns trigger
language plpgsql
as 
$$
begin 
	update tag set "articlesCount" = "articlesCount" -1 where id = old."tagId";
return new;
end
$$;
drop trigger if exists delete_tag_article on tag_articles_article;
create trigger delete_tag_article after delete on tag_articles_article for each row execute procedure on_delete_tag_article();
--Insert follow trigger
create or replace function on_insert_follow()
returns trigger language plpgsql
as 
$$
begin 
	case new."followableType" when 'user' then
	update "user" set "followersCount" = "followersCount" +1 where id = new."followableId";
else
	update tag set "followersCount" = "followersCount" +1 where id = new."followableId";
end case;
return new;
end
$$;
drop trigger if exists insert_follow on follow;
create trigger insert_follow after insert on follow for each row execute procedure on_insert_follow();
--Delete follow trigger
create or replace function on_delete_follow()
returns trigger language plpgsql
as 
$$
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
drop trigger if exists delete_follow on follow;
create trigger delete_follow after delete on follow for each row execute procedure on_delete_follow();

-- Insert reaction trigger
create or replace function on_insert_reaction()
returns trigger language plpgsql
as 
$$
begin 
	case new."reactableType" when 'article' then 
	update article set "reactionsCount" ="reactionsCount" +1 where id = new."reactableId";
else update "comment" set "heartsCount" = "heartsCount"+1 where id = new."reactableId";
end case;
return new;
end
$$;
drop trigger if exists insert_reaction on reaction;
create trigger insert_reaction after insert on reaction for each row execute procedure on_insert_reaction();
-- Delete reaction trigger
create or replace function on_delete_reaction()
returns trigger language plpgsql
as 
$$
begin 
	case old."reactableType" when 'article' then 
	update article set "reactionsCount" ="reactionsCount" -1 where id = old."reactableId";
else update "comment" set "heartsCount" = "heartsCount"-1 where id = old."reactableId";
end case;
return new;
end
$$;
drop trigger if exists delete_reaction on reaction;
create trigger delete_reaction after delete on reaction for each row execute procedure on_delete_reaction();

alter table article add column if not exists vector tsvector generated always as (to_tsvector('english',title || ' ' || content)) stored;
alter table "comment" add column if not exists vector tsvector generated always as (to_tsvector('english',content)) stored;



















