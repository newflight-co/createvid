---
## Local Environments
- Create epmty .env file and put it into ~/packages/server and ~/packages/worker

## Prerequirements

    - Node
    - Docker

# Setup Google Storage

- Put GCloudStorage Key in ~/keys/

- Add varables in both .env fiiles 
    
    For Dev:

    - GC_PROJECT - google storage project
    - GCS_BUCKET - google storage bucket
    - KEY_FILE_FOR_GC - key file for google storage
    - SENTRY_URL - Sentry (logging service) url for worker
    - SENDGRID_KEY - Key for SendGrid (mailing) service


    For production:

    - QUEUE_CERT, QUEUE_KEY, QUEUE_PASSPHRASE, QUEUE_CA - crdits for queue service
    - QUEUE_URL - url for queue service
    - DATABASE_URL - Databese url (SQL)

- change email in `packages/server/migrations/sql/20190815122846-CreateInisialAccounts-up.sql. Email should be real, you will receive a magic link to login there

- seed the database. To do that just run `npm run db:up`
 or `yarn db:up`
 
## Install and run


# Run docker with Queue and DB service. 
Run docker service first then run following commands to run containers

`$cd docker-dev`
`$docker-compose up`

# Run server, worker and front-ends
`npm run dev` or `yarn dev`


## Usage

Open `http://localhost:8080` 
enter