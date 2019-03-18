'use strict';

const searchIndexedSnippets = require('../lib/searchIndexedSnippets');
const { createTextMessage } = require('../utilities/chatfuelPayloadGenerator');

const handleBookSnippetRetrieval = async ({ parameters, response }) => {
  const { snippetTerm } = JSON.parse(parameters);
  let snippets = await searchIndexedSnippets(snippetTerm);

  if (!snippets.length) {
    return response.send(createTextMessage(`Sorry, we did not find any snippets on ${snippetTerm}`));
  }

  snippets = snippets.map(snippet => {
    return { text: snippet }
  });

  return response.send(createTextMessage(snippets, ['Find Book Satisfaction Value']));
};

const handleCustomerBookSnippetWish = ({ parameters, response }) => {
  const { snippetWishAnswer } = JSON.parse(parameters);

  if (snippetWishAnswer === 'Yes') {
    return response.send(createTextMessage('Thank you for reading an excerpt from Bigger Love'))
  } else {
    return response.send(createTextMessage('Great! Just a minute!', ['Handle Book Satisfaction Value']));
  }
}

const handleCustomerFreshBookSnippetWish = ({ parameters, response }) => {
  const { customerFreshSnippetWish } = JSON.parse(parameters);

  if (customerFreshSnippetWish === 'Yes') {
    return response.send(createTextMessage('You would like a snippet on?'))
  } else {
    return response.send(createTextMessage("You just saw another excerpt from Bigger Love. That's awesome."))
  }
}

module.exports = {
  handleBookSnippetRetrieval,
  handleCustomerBookSnippetWish,
  handleCustomerFreshBookSnippetWish
}