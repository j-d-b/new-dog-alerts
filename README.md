# New Dog Alerts
Adopting a puppy is competitive. Even with [Petfinder](https://www.petfinder.com) alerts and manual daily checks, I missed out on many new pups because I didn't see them soon enough. I created this application so that I could receive immediate notice by email of new dogs added to Petfinder.

This application uses the the [Petfinder API v2.0](https://www.petfinder.com/developers/v2/docs/) to fetch dogs and [Mailgun](https://www.mailgun.com/) to send emails.

## Installation

```
git clone https://github.com/j-d-b/new-dog-alerts.git
cd new-dog-alerts
npm install
```

## Setup
You must have a mailgun account and a Petfinder API Key.

Configure the app by including a `.env` file in the project root and define the following variables

variable | value
--- | ---
PETFINDER_API_KEY | Petfinder API key or Client ID
PETFINDER_SECRET_KEY | Petfinder secret key
MG_FROM_EMAIL | Mailgun sender email address
MG_API_KEY | Mailgun API Key
MG_DOMAIN | Mailgun domain
CHECK_FREQUENCY_MINUTES | How often you plan on checking for new dogs, this affects how recent dogs must have been updated to be counted as new
NEW_DOGS_RECIPIENTS | Comma-separated email addresses to receieve new dog alerts
ERROR_RECIPIENTS | Comma-separated email addresses to receive error emails (e.g. failed to fetch)
ZIP_CODE | Location to search for dogs (in a 150mi radius)

## Usage
Running `index.js` finds dogs that have been updated/added to Petfinder since `CHECK_FREQUENCY_MINUTES` ago and sends an email to `NEW_DOGS_RECIPIENTS` with these dogs. Dogs without photos are not included.

Run this process once with

```shell
npm run start
```

or 

```shell
node index
```

### With cron
This app was intendent to be deployed with `cron` and run every `CHECK_FREQUENCY_MINUTES`

```shell
*/<CHECK_FREQUENCY_MINUTES> * * * * node <PATH_TO_INDEX>/index
```

For example

```shell
*/15 * * * * node ~/new-dog-alerts/index
```
