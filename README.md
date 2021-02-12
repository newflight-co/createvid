---
## Local Environments
- Create epmty .env file and put it into ~/packages/server and ~/packages/worker

## Prerequirements

# Setup Google Storage

- Put GCloudStorage Key in ~/keys/

- Add varables in both .env fiiles 
    
    For Dev:

    - GC_PROJECT - google storage project
    - GCS_BUCKET - google storage bucket
    - KEY_FILE_FOR_GC - key file for google storage
    - QUEUE_URL - url for queue service
    - SENTRY_URL - Sentry (logging service) url for worker
    

    For production:
    - QUEUE_CERT, QUEUE_KEY, QUEUE_PASSPHRASE, QUEUE_CA - crdits for queue service
    - DATABASE_URL - Databese url (SQL)

## Install and run

lerna bootstrap
lerna run dev --parallel watch

---