create database createvid;

create table domains
(
    id     serial  not null
        constraint domains_pk
            primary key,
    domain varchar not null
);

alter table domains
    owner to postgres;

create unique index domains_domain_uindex
    on domains (domain);

-- auto-generated definition
create table tasks
(
    -- Only integer types can be auto increment
    id         varchar      not null
        constraint tasks_pk
            primary key,
    title      varchar(255) not null,
    templateid varchar(255) not null,
    status     varchar(64),
    url        varchar,
    poster     varchar,
    error      varchar,
    categories jsonb,
    author     integer
        constraint tasks_users_id_fk
            references users
            on update cascade on delete set null,
    domain     integer
        constraint tasks_domains_id_fk
            references domains
            on update cascade on delete restrict
);

alter table tasks
    owner to postgres;


-- auto-generated definition
create table users
(
    id          serial  not null
        constraint users_pk
            primary key,
    email       varchar not null,
    admin       boolean default false,
    code        varchar,
    codeexpires timestamp
);

alter table users
    owner to postgres;

create unique index users_email_uindex
    on users (email);

INSERT INTO public.domains (id, domain) VALUES (1, 'codecat.io');

INSERT INTO public.users (id, email, admin, code, codeexpires) VALUES (2, 'tallerstk97@gmail.com', false, null, null);
INSERT INTO public.users (id, email, admin, code, codeexpires) VALUES (3, 'tim@newflight.co', true, null, null);
INSERT INTO public.users (id, email, admin, code, codeexpires) VALUES (1, 'mateusz@russak.biz', true, '175937', '2019-05-29 15:29:38.811000');
INSERT INTO public.users (id, email, admin, code, codeexpires) VALUES (6, 'mateusz.russak@codecat.io', false, '519421', '2019-05-29 15:46:41.632000');
