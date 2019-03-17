'use strict';

const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const subjectFilePath = '../assets/bigger-love.html';
const subjectIndex = 'bigger-love';

/**
 * Initiates crawler actions.
 * 
 * @param {Object} request 
 * @param {Object} response 
 */
async function processCrawlerActions (request, response) {
  await fs.readFile(path.join(__dirname, subjectFilePath), 'utf-8', (err, html) => {
    if (err) throw err;

    const $ = cheerio.load(html);

    const paragraphs = [];
    
    $('p').each((i, paragraph) => {
      const paragraphChildren = paragraph
        .children
        .filter(child => typeof child.data !== 'undefined' && child.data !== '\n')
        .map(({ data }) => data.replace(/\n/g, ' '));

      paragraphs.push(...paragraphChildren)
    });

    indexSubjectSnippets(paragraphs, function (){
      response.send(`Successfully indexed snippets for ${subjectIndex}`)
    });
  });
}

/**
 * Indexes paragraph snippets with the ElasticSearch client.
 *  
 * @param {Array<Object>} snippets - Array of paragraph snippets to index.
 * @param {Function} callback - Callback function invoked when indexing is completed.
 * 
 * @returns {Function}
 */
async function indexSubjectSnippets(snippets, callback) {
  const { Client } = require('@elastic/elasticsearch');
  const elasticSearchClient = new Client({ node: 'http://localhost:9200' });

  const body = [];

  snippets.map((snippet, id) => {
    body.push({ index: { _index: subjectIndex, _type: 'paragraph', _id: `${id + 1}` } });
    body.push({ snippet });
  });

  try {
    await elasticSearchClient.bulk({
      body
    })
    
    return callback();
  } catch (e) {
    console.log(e);
  }
}

module.exports = processCrawlerActions;