'use strict';

const subjectIndex = 'bigger-love';
const subjectIndexCount = 509;

/**
 * Finds hits for a term within indexes.
 * 
 * @param {String} searchTerm
 */
async function searchIndexedSnippets (searchTerm='aging') {
  const { Client } = require('@elastic/elasticsearch');
  const elasticSearchClient = new Client({ node: 'http://localhost:9200' });

  const { body } = await elasticSearchClient.search({
    index: subjectIndex,
    body: {
      query: {
        match: {
          snippet: searchTerm
        }
      }
    }
  });

  const searchResults = body.hits.hits;

  if (!searchResults.length) return [];

  const searchResult = searchResults[0];
  const searchResultId = parseInt(searchResult._id, 10)
  let docs = [];

  if (searchResultId <= 2) {
    docs = [
      { "_id": `${searchResultId + 1}` },
      { "_id": `${searchResultId + 2}` },
    ]
  } else if (searchResultId > subjectIndexCount + 3) {
    docs = [
      { "_id": `${searchResultId - 1}` },
      { "_id": `${searchResultId - 2}` },
    ]
  } else {
    docs = [
      { "_id": `${searchResultId - 1}` },
      { "_id": `${searchResultId - 2}` },
      { "_id": `${searchResultId + 1}` },
      { "_id": `${searchResultId + 2}` },
    ]
  }

  const accompanyingParagraphsQuery = await elasticSearchClient.mget({
    index: subjectIndex,
    type: 'paragraph',
    body: {
      docs
    }
  });

  const accompanyingParagraphs = accompanyingParagraphsQuery.body.docs.map(doc => doc);

  const responseParagraphs = [searchResult, ...accompanyingParagraphs]
    .sort((a, b) => {
      return parseInt(a._id, 10) - parseInt(b._id, 10);
    })
    .map(par =>  par._source.snippet);

  // console.log(responseParagraphs);
  
  return responseParagraphs;
}

module.exports = searchIndexedSnippets;