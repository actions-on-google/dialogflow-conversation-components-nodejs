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
  actionssdk,
  BasicCard,
  Button,
  Carousel,
  Image,
  LinkOutSuggestion,
  List,
  Suggestions,
  SimpleResponse,
 } = require('actions-on-google');
const functions = require('firebase-functions');

// Constants for list and carousel selection
const SELECTION_KEY_GOOGLE_ALLO = 'googleAllo';
const SELECTION_KEY_GOOGLE_HOME = 'googleHome';
const SELECTION_KEY_GOOGLE_PIXEL = 'googlePixel';
const SELECTION_KEY_ONE = 'title';

// Constants for image URLs
const IMG_URL_AOG = 'https://developers.google.com/actions/images/badges' +
  '/XPM_BADGING_GoogleAssistant_VER.png';
const IMG_URL_GOOGLE_ALLO = 'https://allo.google.com/images/allo-logo.png';
const IMG_URL_GOOGLE_HOME = 'https://lh3.googleusercontent.com' +
  '/Nu3a6F80WfixUqf_ec_vgXy_c0-0r4VLJRXjVFF_X_CIilEu8B9fT35qyTEj_PEsKw';
const IMG_URL_GOOGLE_PIXEL = 'https://storage.googleapis.com/madebygoog/v1' +
  '/Pixel/Pixel_ColorPicker/Pixel_Device_Angled_Black-720w.png';

// Constants for selected item responses
const SELECTED_ITEM_RESPONSES = {
  [SELECTION_KEY_ONE]: 'You selected the first item in the list or carousel',
  [SELECTION_KEY_GOOGLE_HOME]: 'You selected the Google Home!',
  [SELECTION_KEY_GOOGLE_PIXEL]: 'You selected the Google Home!',
  [SELECTION_KEY_GOOGLE_PIXEL]: 'You selected the Google Pixel!',
  [SELECTION_KEY_GOOGLE_ALLO]: 'You selected Google Allo!',
};

const intentSuggestions = [
  'Basic Card',
  'Browse Carousel',
  'Carousel',
  'List',
  'Media',
  'Suggestions',
];

const app = actionssdk({debug: true});

app.middleware((conv) => {
  conv.hasScreen =
    conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT');
  conv.hasAudioPlayback =
    conv.surface.capabilities.has('actions.capability.AUDIO_OUTPUT');
});

// Welcome
app.intent('actions.intent.MAIN', (conv) => {
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

// React to a text intent
app.intent('actions.intent.TEXT', (conv, input) => {
  let rawInput = input.toLowerCase();
  console.log('USER SAID ' + rawInput);
  if (rawInput === 'basic card') {
    basicCard(conv);
  } else if (rawInput === 'list') {
    list(conv);
  } else if (rawInput === 'carousel') {
    carousel(conv);
  } else if (rawInput === 'normal ask') {
    normalAsk(conv);
  } else if (rawInput === 'normal bye') {
    normalBye(conv);
  } else if (rawInput === 'bye card') {
    byeCard(conv);
  } else if (rawInput === 'bye response') {
    byeResponse(conv);
  } else if (rawInput === 'suggestions' || rawInput === 'suggestion chips') {
    suggestions(conv);
  } else {
    normalAsk(conv);
  }
});

// React to list or carousel selection
app.intent('actions.intent.OPTION', (conv, params, option) => {
  let response = 'You did not select any item from the list or carousel';
  if (option && SELECTED_ITEM_RESPONSES.hasOwnProperty(option)) {
    response = SELECTED_ITEM_RESPONSES[option];
  } else {
    response = 'You selected an unknown item from the list or carousel';
  }
  conv.ask(response);
});

/**
 * Normal Ask
 * @param {object} conv - The conversation object.
 */
function normalAsk(conv) {
  conv.ask('Ask me to show you a list, carousel, or basic card.');
}

/**
 * Suggestions
 * @param {object} conv - The conversation object.
 */
function suggestions(conv) {
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
}

/**
 * Basic Card
 * @param {object} conv - The conversation object.
 */
function basicCard(conv) {
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
    subtitle: 'This is a subtitle',
    title: 'Title: this is a title',
    buttons: new Button({
      title: 'This is a button',
      url: 'https://assistant.google.com/',
    }),
    image: new Image({
      url: IMG_URL_AOG,
      alt: 'Image alternate text',
    }),
  }));
  conv.ask(new SimpleResponse({
    speech: 'This is the second simple response.',
    text: 'This is the 2nd simple response.',
  }));
}

/**
 * List
 * @param {object} conv - The conversation object.
 */
function list(conv) {
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
      [SELECTION_KEY_ONE]: {
        synonyms: [
          'synonym of title 1',
          'synonym of title 2',
          'synonym of title 3',
        ],
        title: 'Title of First List Item',
        description: 'This is a description of a list item.',
        image: new Image({
          url: IMG_URL_AOG,
          alt: 'Image alternate text',
        }),
      },
      // Add the second item to the list
      [SELECTION_KEY_GOOGLE_HOME]: {
        synonyms: [
          'Google Home Assistant',
          'Assistant on the Google Home',
      ],
        title: 'Google Home',
        description: 'Google Home is a voice-activated speaker powered by ' +
          'the Google Assistant.',
        image: new Image({
          url: IMG_URL_GOOGLE_HOME,
          alt: 'Google Home',
        }),
      },
      // Add the third item to the list
      [SELECTION_KEY_GOOGLE_PIXEL]: {
        synonyms: [
          'Google Pixel XL',
          'Pixel',
          'Pixel XL',
        ],
        title: 'Google Pixel',
        description: 'Pixel. Phone by Google.',
        image: new Image({
          url: IMG_URL_GOOGLE_PIXEL,
          alt: 'Google Pixel',
        }),
      },
      // Add the last item to the list
      [SELECTION_KEY_GOOGLE_ALLO]: {
        title: 'Google Allo',
        synonyms: [
          'Allo',
        ],
        description: 'Introducing Google Allo, a smart messaging app that ' +
          'helps you say more and do more.',
        image: new Image({
          url: IMG_URL_GOOGLE_ALLO,
          alt: 'Google Allo Logo',
        }),
      },
    },
  }));
}

/**
 * Carousel
 * @param {object} conv - The conversation object.
 */
function carousel(conv) {
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
      [SELECTION_KEY_ONE]: {
        synonyms: [
          'synonym of title 1',
          'synonym of title 2',
          'synonym of title 3',
        ],
        title: 'Title of First Carousel Item',
        description: 'This is a description of a carousel item.',
        image: new Image({
          url: IMG_URL_AOG,
          alt: 'Image alternate text',
        }),
      },
      // Add the second item to the carousel
      [SELECTION_KEY_GOOGLE_HOME]: {
        synonyms: [
          'Google Home Assistant',
          'Assistant on the Google Home',
      ],
        title: 'Google Home',
        description: 'Google Home is a voice-activated speaker powered by ' +
          'the Google Assistant.',
        image: new Image({
          url: IMG_URL_GOOGLE_HOME,
          alt: 'Google Home',
        }),
      },
      // Add third item to the carousel
      [SELECTION_KEY_GOOGLE_PIXEL]: {
        synonyms: [
          'Google Pixel XL',
          'Pixel',
          'Pixel XL',
        ],
        title: 'Google Pixel',
        description: 'Pixel. Phone by Google.',
        image: new Image({
          url: IMG_URL_GOOGLE_PIXEL,
          alt: 'Google Pixel',
        }),
      },
      // Add last item of the carousel
      [SELECTION_KEY_GOOGLE_ALLO]: {
        title: 'Google Allo',
        synonyms: [
          'Allo',
        ],
        description: 'Introducing Google Allo, a smart messaging app that ' +
          'helps you say more and do more.',
        image: new Image({
          url: IMG_URL_GOOGLE_ALLO,
          alt: 'Google Allo Logo',
        }),
      },
    },
  }));
}

/**
 * Leave conversation with card
 * @param {object} conv - The conversation object.
 */
function byeCard(conv) {
  if (!hasScreen) {
    conv.ask('Sorry, try this on a screen device or select the phone ' +
      'surface in the simulator.');
    return;
  }
  conv.ask('Goodbye, World!');
  conv.close(new BasicCard({
    text: 'This is a goodbye card.',
  }));
}

/**
 * Leave conversation with SimpleResponse
 * @param {object} conv - The conversation object.
 */
function byeResponse(conv) {
  conv.close(new SimpleResponse({
    speech: 'Okay see you later',
    text: 'OK see you later!',
  }));
}

/**
 * Leave conversation
 * @param {object} conv - The conversation object.
 */
function normalBye(conv) {
  conv.close('Okay see you later!');
}

exports.conversationComponent = functions.https.onRequest(app);
