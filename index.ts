import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import * as docker from "@pulumi/docker";

// Create a GCP resource (Storage Bucket)
const bucket = new gcp.storage.Bucket("importmap-bucket");

const bucketAC = new gcp.storage.BucketAccessControl("full-access", {
  bucket: bucket.name,
  entity: "allUsers",
  role: "WRITER"
})

const enableCloudRun = new gcp.projects.Service("EnableCloudRun", {
  service: "run.googleapis.com",
});

// Location to deploy Cloud Run services
const location = gcp.config.region || "us-central1";

const importmapDeployerImage = new docker.Image("importmap-deployer", {
  imageName: pulumi.interpolate`gcr.io/${gcp.config.project}/importmap-deployer:latest`,
  build: {
      context: "./",
  },
});

const importmapDeployerService = new gcp.cloudrun.Service("importmap-deployer-service", {
  location,
  template: {
      spec: {
          containers: [{
              image: importmapDeployerImage.imageName,
              resources: {
                  limits: {
                      memory: "1Gi",
                  },
              },
          }],
          containerConcurrency: 1,
      },
  },
}, { dependsOn: enableCloudRun });

const iamImportmapDeployer = new gcp.cloudrun.IamMember("fullAccess", {
  service: importmapDeployerService.name,
  location,
  role: "roles/run.invoker",
  member: "allUsers",
});


// Export the URL
export const serviceUrl = importmapDeployerService.status.url;

// Export the DNS name of the bucket
export const bucketName = bucket.url;
