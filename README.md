# Actions on Google: Conversation Component Sample

A simple sample showing the visual conversation components available with Actions on Google.

## Setup Instructions

### Steps for Actions SDK
1. Use the [Actions on Google Console](https://console.actions.google.com) to add a new project with a name of your choosing.
1. Choose *Actions SDK* in the *Add actions to your app* section. A dialog pops up: leave it open because you will need it for an upcoming step.
1. Deploy the fulfillment webhook provided in the `functions` folder using [Google Cloud Functions for Firebase](https://firebase.google.com/docs/functions/):
   1. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com) if you don't have one already.
   1. Follow the instructions to [set up and initialize Firebase SDK for Cloud Functions](https://firebase.google.com/docs/functions/get-started#set_up_and_initialize_functions_sdk). Make sure to reply "N" when asked to overwrite existing files by the Firebase CLI.
   1.Run `firebase deploy --only functions` and take note of the endpoint where the fulfillment webhook has been published. It should look like `Function URL (conversationComponent): https://us-central1-YOUR_PROJECT.cloudfunctions.net/conversationComponent`
1. Update the action package, `action.json`, replacing the placeholder value `YOUR_ENDPOINT_URL` with the value for Function URL obtained from the previous step.
1. [Install the gactions CLI](https://developers.google.com/actions/tools/gactions-cli) if you haven't already.
1. Go back to the Actions console, copy the command shown in the Actions console, replace `PACKAGE_NAME` with "action.json" and execute it in a shell. The final command should look like `gactions update --action_package action.json --project <YOUR_PROJECT_ID>`
1. Click *OK* in the Actions console to dismiss the *Use Actions SDK to add actions to your Assistant app* dialog.
1. Open the Simulator in the Actions console.
1. Type "Talk to my test app" in the simulator, or say "OK Google, talk to my test app" to any Actions on Google enabled device signed into your developer account.

### Steps for API.AI
1. Use the [Actions on Google Console](https://console.actions.google.com) to add a new project with a name of your choosing.
1. Click *Use API.AI* and then *Create Actions on API.AI* to open the API.AI console.
1. Click *Save* to save the project.
1. Click on the gear icon to see the project settings.
1. Select *Export and Import*.
1. Select *Restore from zip*. Follow the directions to restore from the `agent.zip` file in this repo.
1. Deploy the fulfillment webhook provided in the `functions` folder using [Google Cloud Functions for Firebase](https://firebase.google.com/docs/functions/):
   1. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com) if you don't have one already.
   1. Follow the instructions to [set up and initialize Firebase SDK for Cloud Functions](https://firebase.google.com/docs/functions/get-started#set_up_and_initialize_functions_sdk). Make sure to reply "N" when asked to overwrite existing files by the Firebase CLI.
   1.Run `firebase deploy --only functions` and take note of the endpoint where the fulfillment webhook has been published. It should look like `Function URL (conversationComponent): https://us-central1-YOUR_PROJECT.cloudfunctions.net/conversationComponent`
1. Go back to the API.AI console and select *Fulfillment* from the left navigation menu. Enable *Webhook*, set the value of *URL* to the `Function URL` from the preiovus step, then click *Save*.
1. Select *Integrations* from the left navigation menu and open the *Settings* menu for Actions on Google.
1. Click *Test*.
1. Click *View* to open the Actions on Google simulator.
1. Type `Talk to my test app` in the simulator, or say `OK Google, talk to my test app` to any Actions on Google enabled device signed into your developer account.

For more detailed information on deployment, see the [documentation](https://developers.google.com/actions/samples/).

## References and How to report bugs
* Actions on Google documentation: [https://developers.google.com/actions/](https://developers.google.com/actions/).
* If you find any issues, please open a bug here on GitHub.
* Questions are answered on [StackOverflow](https://stackoverflow.com/questions/tagged/actions-on-google).

## How to make contributions?
Please read and follow the steps in the [CONTRIBUTING.md](CONTRIBUTING.md).

## License
See [LICENSE](LICENSE).

## Terms
Your use of this sample is subject to, and by using or downloading the sample files you agree to comply with, the [Google APIs Terms of Service](https://developers.google.com/terms/).

## Google+
Actions on Google Developers Community on Google+ [https://g.co/actionsdev](https://g.co/actionsdev).
