// Copyright 2017-2018, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const {
  dialogflow,
  BasicCard,
  BrowseCarousel,
  BrowseCarouselItem,
  Button,
  Carousel,
  Image,
  LinkOutSuggestion,
  List,
  MediaObject,
  Suggestions,
  SimpleResponse,
  Table,
 } = require('actions-on-google');
const functions = require('firebase-functions');

// Constants for list and carousel selection
const SELECTION_KEY_GOOGLE_ASSISTANT = 'googleAssistant';
const SELECTION_KEY_GOOGLE_PAY = 'googlePay';
const SELECTION_KEY_GOOGLE_MAPS = 'googleMaps';
const SELECTION_KEY_GOOGLE_FLUTTER = 'googleFlutter';

// Constant for image URLs
const IMG_URL_AOG = 'https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png';
const IMG_URL_GOOGLE_PAY = 'https://storage.googleapis.com/actionsresources/logo_pay_64dp.png';
const IMG_URL_GOOGLE_MAPS = 'https://storage.googleapis.com/actionsresources/logo_maps_2x_64dp.png';
const IMG_URL_GOOGLE_FLUTTER ='https://storage.googleapis.com/actionsresources/logo_flutter_2x_64dp.png';

// Constants for selected item responses
const SELECTED_ITEM_RESPONSES = {
  [SELECTION_KEY_GOOGLE_ASSISTANT]: 'You selected Google Assistant!',
  [SELECTION_KEY_GOOGLE_PAY]: 'You selected Google Pay!',
  [SELECTION_KEY_GOOGLE_MAPS]: 'You selected Google Maps!',
  [SELECTION_KEY_GOOGLE_FLUTTER]: 'You selected Google Flutter!',
};

const intentSuggestions = [
  'Basic Card',
  'Browse Carousel',
  'Carousel',
  'List',
  'Media',
  'Suggestions',
  'Table',
];

const app = dialogflow({debug: true});

app.middleware((conv) => {
  conv.hasScreen =
    conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT');
  conv.hasAudioPlayback =
    conv.surface.capabilities.has('actions.capability.AUDIO_OUTPUT');
  conv.hasWebBrowser =
    conv.surface.capabilities.has('actions.capability.WEB_BROWSER');
});

app.intent('Default Welcome Intent', (conv) => {
  conv.ask(new SimpleResponse({
    speech: 'Hi there!',
    text: 'Hello there!',
  }));
  conv.ask(new SimpleResponse({
    speech: 'I can show you basic cards, lists and carousels ' +
      'as well as suggestions on your phone.',
    text: 'I can show you basic cards, lists and carousels as ' +
      'well as suggestions.',
  }));
  conv.ask(new Suggestions(intentSuggestions));
});

app.intent('normal ask', (conv) => {
  conv.ask('Ask me to show you a list, carousel, or basic card.');
});

// Suggestions
app.intent('suggestions', (conv) => {
  if (!conv.hasScreen) {
    conv.ask('Sorry, try this on a screen device or select the ' +
      'phone surface in the simulator.');
    return;
  }
  conv.ask('This is a simple response for suggestions.');
  conv.ask(new Suggestions('Suggestion Chips'));
  conv.ask(new Suggestions(intentSuggestions));
  conv.ask(new LinkOutSuggestion({
    name: 'Suggestion Link',
    url: 'https://assistant.google.com/',
  }));
});

// Basic card
app.intent('basic card', (conv) => {
  if (!conv.hasScreen) {
    conv.ask('Sorry, try this on a screen device or select the ' +
      'phone surface in the simulator.');
    return;
  }
  conv.ask('This is the first simple response for a basic card.');
  conv.ask(new Suggestions(intentSuggestions));
  // Create a basic card
  conv.ask(new BasicCard({
    text: `This is a basic card.  Text in a basic card can include "quotes" and
    most other unicode characters including emoji 📱.  Basic cards also support
    some markdown formatting like *emphasis* or _italics_, **strong** or
    __bold__, and ***bold itallic*** or ___strong emphasis___ as well as other
    things like line  \nbreaks`, // Note the two spaces before '\n' required for
                                 // a line break to be rendered in the card.
    subtitle: 'Build Actions',
    title: 'Google Assistant',
    buttons: new Button({
      title: 'This is a button',
      url: 'https://assistant.google.com/',
    }),
    image: new Image({
      url: IMG_URL_AOG,
      alt: 'Google Assistant logo',
    }),
  }));
  conv.ask(new SimpleResponse({
    speech: 'This is the second simple response.',
    text: 'This is the 2nd simple response.',
  }));
});

// List
app.intent('list', (conv) => {
  if (!conv.hasScreen) {
    conv.ask('Sorry, try this on a screen device or select the ' +
      'phone surface in the simulator.');
    return;
  }
  conv.ask('This is a simple response for a list.');
  conv.ask(new Suggestions(intentSuggestions));
  // Create a list
  conv.ask(new List({
    title: 'List Title',
    items: {
      // Add the first item to the list
      [SELECTION_KEY_GOOGLE_ASSISTANT]: {
        synonyms: [
          'Assistant',
          'Google Assistant',
        ],
        title: 'Google and Assistant',
        description: 'Build Actions for Google Assistant.',
        image: new Image({
          url: 'https://www.gstatic.com/images/branding/product/2x/assistant_48dp.png',
          alt: 'Google Assistant logo',
        }),
      },
      // Add the second item to the list
      [SELECTION_KEY_GOOGLE_PAY]: {
        synonyms: [
          'Transactions',
          'Google Payments',
          'Transactions API',
      ],
        title: 'Monetize',
        description: 'Use Google Pay in your Action.',
        image: new Image({
          url: 'https://www.gstatic.com/images/branding/product/2x/pay_48dp.png',
          alt: 'Google Pay logo',
        }),
      },
      // Add the third item to the list
      [SELECTION_KEY_GOOGLE_MAPS]: {
        synonyms: [
          'Google Maps',
          'Maps',
          'Google Maps API',
        ],
        title: 'Google Maps',
        description: 'Maps by Google.',
        image: new Image({
          url: 'https://www.gstatic.com/images/branding/product/2x/maps_48dp.png',
          alt: 'Google Maps logo',
        }),
      },
      // Add the last item to the list
      [SELECTION_KEY_GOOGLE_FLUTTER]: {
        title: 'Google Flutter',
        synonyms: [
          'Flutter',
        ],
        description: 'Introducing Google Flutter for iOS and Android development.',
        image: new Image({
          url: 'https://www.gstatic.com/images/branding/product/2x/flutter_48dp.png',
          alt: 'Google Flutter logo',
        }),
      },
    },
  }));
});

// Carousel
app.intent('carousel', (conv) => {
  if (!conv.hasScreen) {
    conv.ask('Sorry, try this on a screen device or select the ' +
      'phone surface in the simulator.');
    return;
  }
  conv.ask('This is a simple response for a carousel.');
  conv.ask(new Suggestions(intentSuggestions));
  // Create a carousel
  conv.ask(new Carousel({
    items: {
      // Add the first item to the carousel
      [SELECTION_KEY_GOOGLE_ASSISTANT]: {
        synonyms: [
          'Assistant',
          'Google Assistant',
        ],
        title: 'Google Assistant',
        description: 'Build Actions for Google Assistant.',
        image: new Image({
          url: IMG_URL_AOG,
          alt: 'Google Assistant logo',
        }),
      },
      // Add the second item to the carousel
      [SELECTION_KEY_GOOGLE_PAY]: {
        synonyms: [
          'Transactions',
          'Google Payments',
          'Transactions API',
      ],
        title: 'Google Pay',
        description: 'Use Google Pay in your Action with Transactions API.',
        image: new Image({
          url: IMG_URL_GOOGLE_PAY,
          alt: 'Google Pay logo',
        }),
      },
      // Add third item to the carousel
      [SELECTION_KEY_GOOGLE_MAPS]: {
        synonyms: [
          'Google Maps',
          'Maps',
          'Google Maps APIs'
        ],
        title: 'Google Maps',
        description: 'Maps by Google.',
        image: new Image({
          url: IMG_URL_GOOGLE_MAPS,
          alt: 'Google Maps logo',
        }),
      },
      // Add last item of the carousel
      [SELECTION_KEY_GOOGLE_FLUTTER]: {
        title: 'Google Flutter',
        synonyms: [
          'Flutter',
        ],
        description: 'Introducing Google Flutter for iOS and Android development.',
        image: new Image({
          url: IMG_URL_GOOGLE_FLUTTER,
          alt: 'Google Flutter logo',
        }),
      },
    },
  }));
});

// Browse Carousel
app.intent('browse carousel', (conv) => {
  if (!conv.hasScreen) {
    conv.ask('Sorry, try this on a mobile device or select the ' +
      'phone surface in the simulator.');
    return;
  }

  if (!conv.hasWebBrowser) {
    conv.ask(`I'm sorry, browse carousel isn't supported on smart display`);
  }

  conv.ask('This is an example of a "Browse Carousel"');
  // Create a browse carousel
  conv.ask(new BrowseCarousel({
    items: [
      new BrowseCarouselItem({
        title: 'Actions on Assistant',
        url: 'https://assistant.google.com/',
        description: 'Build Actions for Google Assistant.',
        image: new Image({
          url: 'https://www.gstatic.com/images/branding/product/2x/assistant_64dp.png',
          alt: 'Google Assistant logo',
        }),
        footer: 'Item 1 footer',
      }),
      new BrowseCarouselItem({
        title: 'Google Pay',
        url: 'https://developers.google.com/actions/transactions/physical/dev-guide-physical-gpay',
        description: 'Use Google Pay in your Action with Transactions API.',
        image: new Image({
          url: 'https://www.gstatic.com/images/branding/product/2x/pay_64dp.png',
          alt: 'Google Pay logo',
        }),
        footer: 'Item 2 footer',
      }),
    ],
  }));
  conv.ask(new Suggestions(intentSuggestions));
});

// Media response
app.intent('media response', (conv) => {
  if (!conv.hasAudioPlayback) {
    conv.close('Sorry, this device does not support audio playback.');
    return;
  }
  conv.ask('This is the first simple response for a media response');
  conv.ask(new MediaObject({
    name: 'Jazz in Paris',
    url: 'http://storage.googleapis.com/automotive-media/Jazz_In_Paris.mp3',
    description: 'A funky Jazz tune',
    icon: new Image({
      url: 'http://storage.googleapis.com/automotive-media/album_art.jpg',
      alt: 'Media icon',
    }),
  }));
  conv.ask(new Suggestions(intentSuggestions));
});

// Handle a media status event
app.intent('media status', (conv) => {
  const mediaStatus = conv.arguments.get('MEDIA_STATUS');
  let response = 'Unknown media status received.';
  if (mediaStatus && mediaStatus.status === 'FINISHED') {
    response = 'Hope you enjoyed the tunes!';
  }
  conv.ask(response);
  conv.ask(new Suggestions(intentSuggestions));
});

// Handle list or carousel selection
app.intent('item selected', (conv, params, option) => {
  let response = 'You did not select any item from the list or carousel';
  if (option && SELECTED_ITEM_RESPONSES.hasOwnProperty(option)) {
    response = SELECTED_ITEM_RESPONSES[option];
  } else {
    response = 'You selected an unknown item from the list or carousel';
  }
  conv.ask(response);
});

app.intent('card builder', (conv) => {
  if (!conv.hasScreen) {
    conv.ask('Sorry, try this on a screen device or select the ' +
      'phone surface in the simulator.');
    return;
  }
  conv.ask(...conv.incoming);
  conv.ask(new BasicCard({
    text: `Actions on Google let you build for
    the Google Assistant. Reach users right when they need you. Users don’t
    need to pre-enable skills or install new apps.  \n  \nThis was written
    in the fulfillment webhook!`,
    subtitle: 'Engage users through the Google Assistant',
    title: 'Actions on Google',
    buttons: new Button({
      title: 'Developer Docs',
      url: 'https://developers.google.com/actions/',
    }),
    image: new Image({
      url: IMG_URL_AOG,
      alt: 'Google Assistant logo',
    }),
  }));
});

app.intent('table builder', (conv) => {
  if (!conv.hasScreen) {
    conv.ask('Sorry, try this on a screen device or select the ' +
      'phone surface in the simulator.');
    return;
  }
  conv.ask('You can include table data like this')
  conv.ask(new Table({
    dividers: true,
    columns: ['Basic Plan', 'Mid-tier Plan', 'Premium Plan'],
    rows: [
      ['row 1 item 1', 'row 1 item 2', 'row 1 item 3'],
      ['row 2 item 1', 'row 2 item 2', 'row 2 item 3'],
    ],
  }));
  conv.ask(new Suggestions(intentSuggestions));
});

// Leave conversation with card
app.intent('bye card', (conv) => {
  if (!conv.hasScreen) {
    conv.ask('Sorry, try this on a screen device or select the phone ' +
      'surface in the simulator.');
    return;
  }
  conv.ask('Goodbye, World!');
  conv.close(new BasicCard({
    text: 'This is a goodbye card.',
  }));
});

// Leave conversation with SimpleResponse
app.intent('bye response', (conv) => {
  conv.close(new SimpleResponse({
    speech: 'Okay see you later',
    text: 'OK see you later!',
  }));
});

// Leave conversation
app.intent('normal bye', (conv) => {
  conv.close('Okay see you later!');
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
