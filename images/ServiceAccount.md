# Create GCP service account with credentials

[credentials service account](https://console.cloud.google.com/apis/credentials/serviceaccountkey)

Default service account

![](./images/Create-GCP-Default-Service-Account.png)

Service account

![](./images/Create-GCP-Service-Account.png)

Service accounts

![](./images/GCP-Service-Accounts.png)

### using gcloud

Create the service account. Replace [NAME] with a name for the service account.

`gcloud iam service-accounts create [NAME]`

Grant permissions to the service account. Replace [PROJECT_ID] with your project ID.

`gcloud projects add-iam-policy-binding [PROJECT_ID] --member "serviceAccount:[NAME]@[PROJECT_ID].iam.gserviceaccount.com" --role "roles/owner"`

Generate the key file. Replace [FILE_NAME] with a name for the key file.

`gcloud iam service-accounts keys create [FILE_NAME].json --iam-account [NAME]@[PROJECT_ID].iam.gserviceaccount.com`

Provide authentication credentials to your application code by setting the environment variable GOOGLE_APPLICATION_CREDENTIALS. Replace [PATH] with the file path of the JSON file that contains your service account key, and [FILE_NAME] with the filename. 

`export GOOGLE_APPLICATION_CREDENTIALS="[PATH]"`

For example:

`export GOOGLE_APPLICATION_CREDENTIALS="/home/user/Downloads/[FILE_NAME].json"`