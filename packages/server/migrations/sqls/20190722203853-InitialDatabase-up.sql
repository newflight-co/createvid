/* Replace with your SQL commands */

-- auto-generated definition
create table domains
(
    id     serial  not null
        constraint domains_pk
            primary key,
    domain varchar not null
);

create unique index domains_domain_uindex
    on domains (domain);

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

create unique index users_email_uindex
    on users (email);


-- auto-generated definition
create table tasks
(
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
