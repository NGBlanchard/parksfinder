'use strict';

const apiKey = 'txX9JfsZpRLAKJsXnur5L1IgEer7chCvgLnD2ekU'; 
const searchURL = 'https://developer.nps.gov/api/v1/places';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function removeLast(responseJson) {
  responseJson.data.pop();
}

function displayResults(responseJson) {
  console.log(responseJson)
  $('#results-list').empty();
  removeLast(responseJson);
  for (let i = 0; i < responseJson.data.length; i++){
    
    $('#results-list').append(
      `<li><h3><a href="${responseJson.data[i].url}">${responseJson.data[i].title}</a></h3>
      <p>${responseJson.data[i].listingdescription}</p>
      <img src='${responseJson.data[i].listingimage.url}'>
      </li>`
    )}; 
  $('#results').removeClass('hidden');
};

function getParks(query, maxResults=10) {
  const params = {
    limit: maxResults,
    stateCode: query,
    api_key: apiKey,
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getParks(searchTerm, maxResults);
  });
}

$(watchForm);