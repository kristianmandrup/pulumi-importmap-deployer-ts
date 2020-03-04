# Pulumi stack for importmap deployer on GCP

This Pulumi stack is designed to make it easy to set up GCP infrastructure for [importmap-deployer](https://github.com/single-spa/import-map-deployer)

The stack will:

- Create a Storage Bucket
- Create a Kubernetes cluster or Cloud Run configuration

## Install

Install dependencies

```sh
$ npm i
# dependencies
```

## Run

```sh
$ pulumi up

Previewing update (dev):
     Type                   Name                    Plan       
 +   pulumi:pulumi:Stack    importmap-deployer-dev  create     
 +   └─ gcp:storage:Bucket  my-bucket               create     
 
Resources:
    + 2 to create

Do you want to perform this update?
> yes
  no
  details

Do you want to perform this update? yes
Updating (dev):
     Type                   Name                    Status      
 +   pulumi:pulumi:Stack    importmap-deployer-dev  created     
 +   └─ gcp:storage:Bucket  my-bucket               created     
 
Outputs:
    bucketName: "gs://my-bucket-6a691e9"

Resources:
    + 2 created

Duration: 11s

Permalink: https://app.pulumi.com/username/importmap-deployer/dev/updates/1  
```

## Troubleshooting

`google: could not find default credentials`. See [application-default-credentials](https://developers.google.com/accounts/docs/application-default-credentials) for more information.

### Pulumi GCP setup

See [Pulumi GCP setup](https://www.pulumi.com/docs/intro/cloud-providers/gcp/setup/)

The Pulumi Google Cloud Platform Provider needs to be configured with Google credentials before it can be used to create resources.

When developing locally, we recommend that you use gcloud login to configure your account credentials:

```sh
gcloud auth login
gcloud config set project <YOUR_GCP_PROJECT_HERE>
gcloud auth application-default login
```
