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


module.exports = {
  handleBookSnippetRetrieval
}