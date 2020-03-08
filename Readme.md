# Pulumi stack for importmap deployer on GCP

The importmap deployer is a service required for single-spa Micro Frontends to deploy importmaps

This Pulumi stack is designed to make it easy to set up GCP infrastructure for [importmap-deployer](https://github.com/single-spa/import-map-deployer)

Watch [Deploying Microfrontends Part 1 - Import Map Deployer](https://www.youtube.com/watch?v=QHunH3MFPZs&list=PLLUD8RtHvsAOhtHnyGx57EYXoaNsxGrTU&index=5)

The stack will:

- Create a Google Cloud Run service named `importmap-deployer-service`
- Define image `importmap-deployer` based on image `importmap-deployer:latest` that must exist in GCP container registry
- Deploy image `importmap-deployer` in service `importmap-deployer-service`
- Create a Storage Bucket `importmap-bucket`
- Create policy to allow all users to access service
- Create policy to allow all users to access bucket

The image `importmap-deployer` can be found in the folder of the same name.

See also [gcr-terraform-mfe-importmap-deployer](https://github.com/kristianmandrup/gcr-terraform-mfe-importmap-deployer) which should set up the same (or a similar) stack using terraform

## Resources

- [Google Cloud Run - Serverless Containers](https://www.pulumi.com/blog/google-cloud-run-serverless-containers/)
- [GCP bucket access control](https://www.pulumi.com/docs/reference/pkg/nodejs/pulumi/gcp/storage/#BucketAccessControl)
- [Cloud run container contract](https://cloud.google.com/run/docs/reference/container-contract)

Terraform

- [Issue: Cloud Run customized container port](https://github.com/terraform-providers/terraform-provider-google/issues/5539)
- [Release notes on customizing container port](https://cloud.google.com/run/docs/release-notes#January_07_2020)

Cloud Run exposes the service on port `8080` by default 

The Pulumi stack is converted to a Terraform template, so setting the `PORT` env variable might work:

```sh
$ export PORT=5000
$ export TF_PORT=5000
# ...
```

You can also [Set ENV variables for containers](https://cloud.google.com/compute/docs/containers/configuring-options-to-run-containers#setting_environment_variables) manually via the GCP console.

## Quickstart

1. Install dependencies
2. Configure `importmap-deployer`
3. Push image to GCP Container Registry (via docker)
4. Run `pulumi up` to create stack on GCP and deploy image on service

### Install

Install dependencies

```sh
$ npm i
# dependencies
```

### Configure importmap-deployer

Edit the `conf.js` file of the image to point to bucket entries.
Each location entry should point to an actual storage bucket entry on GCP which contains an importmap JSON file.

```js
  locations: {
    reactMf: 'google://react.microfrontends.app/importmap.json',
  }
```

### Push importmap-deployer image to GCP

Define environment variables

```sh
$ EXPORT $GCR_PRJ_NAME=microfrontend-app
$ EXPORT $GCR_CLUSTER_NAME=importmap-deployer
# ...
```

Build image and push to GCP

```sh
$ docker build -t gcr.io/$GCR_NAME/$GCR_CLUSTER_NAME importmap-deployer
# ...
$ docker push gcr.io/$GCR_NAME/$GCR_CLUSTER_NAME
# ...
```

To set custom container port `8080` (default for Cloud Run service):

```sh
$ docker build --container-port=8080 -t gcr.io/$GCR_NAME/$GCR_CLUSTER_NAME importmap-deployer
# ...
```

## Run

Note: output when this pulumi stack only built a bucket

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

### Pulumi Configuration

To control the resources being built, use can use [Pulumi Config](https://www.pulumi.com/docs/intro/concepts/config/)

```sh
$ pulumi config set <key> [value]
# ...
```

Passing the `--secret` flag to the config set command encrypts the data and stores the resulting ciphertext instead of plaintext.

```sh
$ pulumi config set --secret dbPassword S3cr37
# ...
```

Alternatively add variables to the `Pulumi.yaml` file

To see the list of config variables

```sh
$ pulumi config
KEY                        VALUE
region                     us-west-1
dbPassword                 ********
```

To use from within the pulumi source code file `index.ts`

```ts
import * as pulumi from "@pulumi/pulumi";

// create a config singleton containing all set config variables
const config = new pulumi.Config();

// use the config
console.log(`Password: ${config.require("dbPassword")}`);
```

Currently the code uses the following config vars:

- `version`
- `service_name`

```ts
const imageVersion = config.require("version") || "latest"
const serviceName = config.require("service_name") || "importmap-deployer-service"
```

## Deploy image to service via gcloud

You can use this step to deploy a new image to your GCR service, such as when you update the `conf.js` file

```sh
$ EXPORT IMG_TAG=gcr.io/$GCR_NAME/$GCR_CLUSTER_NAME
$ gcloud builds submit -t $IMG_TAG
# ...
$ gcloud run deploy --image $IMG_TAG
# returns url of running service
```

Open the url returned by the deploy command in a browser

Watch [Build and deploy with Cloud Run](https://www.youtube.com/watch?v=nJ0L28ZfmUA)

## Troubleshooting

`google: could not find default credentials`. See [application-default-credentials](https://developers.google.com/accounts/docs/application-default-credentials) for more information.

### Pulumi GCP setup

See [Pulumi GCP setup](https://www.pulumi.com/docs/intro/cloud-providers/gcp/setup/)

The Pulumi Google Cloud Platform Provider needs to be configured with Google credentials before it can be used to create resources.

When developing locally, we recommend that you use gcloud login to configure your account credentials:

```sh
$ gcloud auth login
$ gcloud config set project <YOUR_GCP_PROJECT_HERE>
$ gcloud auth application-default login
# ...
```
