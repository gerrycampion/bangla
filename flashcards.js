var start; // used to initialize the app

$(document).ready(function () {


  /* To use another sheet, change the gid the value specified when you select a sheet when publishing */
  var alphabetGID = '353843499';
  var wordsGID = '1862333936';
  // var csv_url =
  //   'https://cors-anywhere.herokuapp.com/https://docs.google.com/spreadsheets/d/e/2PACX-1vRf2K-xeuMKKqSxNdftoDq2lvzWxKAUnupF68tHWHLXT62IQh3W1kwPwNIEewOS8GPhfLObks3eMbib/pub?gid='
  //   + wordsGID
  //   + '&single=true&output=csv';
  var csv_url =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vRf2K-xeuMKKqSxNdftoDq2lvzWxKAUnupF68tHWHLXT62IQh3W1kwPwNIEewOS8GPhfLObks3eMbib/pub?gid='
  + wordsGID
  + '&single=true&output=csv';


  var myFlashcards = [];
  Papa.parse(csv_url, {
    download: true,
    complete: function (results) {
      // console.log(results.data);
      for (var [key, row] of results.data.entries()) {
        /* [0A"Q", 1B"A", 2C"", 3D"", 4E"", 5F"", 6G""] */
        if (row[0] && key !== 0) {
          myFlashcards[myFlashcards.length] = { question: row[0], answer: row[1] + '\n\n' + row[2] };
        }
      }
      // Load default questions if no flashcards are found in localStorage
      //if (!localStorage.flashcards || localStorage.flashcards === '[]')
      ouicards.loadFromArray(shuffleArray(myFlashcards));
      initializeHandlers();
    }
  });

});

function shuffleArray(arrin) {
  var array = [...arrin];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function initializeHandlers() {
  // Unbind all events, in case the user loads new flashcard questions
  $('#load-questions').unbind();
  $('.correct').unbind();
  $('.wrong').unbind();
  $('.question').unbind();
  $('.answer').unbind();

  ouicards.getFromLS();
  updateFooter();

  /*
    // Load question functionality
    $('.upload label').on('click', function () {
      $('.upload-questions-label').hide();
      $('.upload').css({ "padding": " 0 2px 10px 2px" });
      $('#questions-input-area').show(100, function () {
        $('#load-questions').show(400);
      });
    });
  
    $('#load-questions').on('click', function () {
      initializeHandlers(ouicards.loadFromBrowser('#questions-input-area', ','));
      changeQuestion();
      $('#questions-input-area').hide();
      $('.upload').css({ "padding": "10px" });
      $('#load-questions').hide();
      $('.upload-questions-label').text("Upload New Questions");
      $('.upload-questions-label').show();
      start = true;
    });
  */


  $('.flashcard').on('click', function () {
    if (!start) {
      start = true;
      changeQuestion();
      return;
    }
  });

  // Correct and wrong answer functionality
  $('.correct').on('click', function () {
    if ($('.answer p').is(":visible")) {
      ouicards.correct();
      changeQuestion();
      updateFooter();
    } else {
      $('.answer p').show();
    }
  });

  $('.wrong').on('click', function () {
    if ($('.answer p').is(":visible")) {
      ouicards.wrong();
      changeQuestion();
      updateFooter();
    } else {
      $('.answer p').show();
    }
  });

  function changeQuestion() {
    var newQuestion = ouicards.next();

    if (newQuestion === undefined) {
      console.log('Trying to load an undefined question into the DOM.');
      return;
    }

    $('.question').html(newQuestion.question);
    $('.question').fitText();
    $('.answer').html(newQuestion.answer);
    $('.answer').fitText();
    $('.answer').children().hide();
  }

  $('.question').on('click', function () {
    $('.answer p').show();
  });

  $('.answer').on('click', function () {
    $('.answer p').show();
  });

  // Update footer info
  function updateFooter() {
    $('.questions-count').html(ouicards.flashcards.length + ' questions');
    $('#stat-details').text(ouicards.bucketA.length + ' - ' +
      ouicards.bucketB.length + ' - ' +
      ouicards.bucketC.length);
  }
}
