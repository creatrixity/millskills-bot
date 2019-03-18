'use strict';

const searchIndexedSnippets = require('../lib/searchIndexedSnippets');
const { createTextMessage } = require('../utilities/chatfuelPayloadGenerator');

const handleBookSnippetRetrieval = async ({ parameters, response }) => {
  const { snippetTerm } = JSON.parse(parameters);
  // let snippets = await searchIndexedSnippets(snippetTerm);

  // if (!snippets.length) {
  //   return response.send(createTextMessage(`Sorry, we did not find any snippets on ${snippetTerm}`));
  // }

  // snippets = snippets.map(snippet => {
  //   return { text: snippet }
  // });

  // return response.send(createTextMessage(snippets));  
  return response.send(createTextMessage('You got your snippets', ['Find Book Satisfaction Value']));
};

const handleCustomerBookSnippetWish = ({ parameters, response }) => {
  const { snippetWishAnswer } = JSON.parse(parameters);

  if (snippetWishAnswer === 'Yes') {
    return response.send(createTextMessage('Thank you for reading an excerpt from _Bigger Love_.'))
  } else {
    return response.send(createTextMessage('Would you like to read another snippet from _Bigger Love_?', ['Find Book Satisfaction Value']));
  }
}

module.exports = {
  handleBookSnippetRetrieval,
  handleCustomerBookSnippetWish
}