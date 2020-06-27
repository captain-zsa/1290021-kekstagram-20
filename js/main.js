'use strict';

var lengthPictures = 25;
var KEY_ESC = 27;
var description = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];
var comments = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
var names = [
  'Кристина',
  'Артём',
  'Марина',
  'Сергей',
  'Виктор',
  'Павел',
  'Пётр',
  'Алевтина',
  'Влад',
  'Светлана',
  'Елизавета'
];

var bigPicture = document.querySelector('.big-picture');
var pictureBox = document.querySelector('.pictures');
var bodyEl = document.querySelector('body');

var uploadInput = document.querySelector('#upload-file');
var effectLevel = document.querySelector('.effect-level');
var sliderPin = effectLevel.querySelector('.effect-level__pin');
var effects = document.querySelector('.effects');
var effectLine = effectLevel.querySelector('.effect-level__depth');
var imgPreview = document.querySelector('.img-upload__preview img');
var scale = document.querySelector('.scale');
var scaleInput = scale.querySelector('.scale__control--value');

// Функция для генерации рандома между min и max
var randomInteger = function (min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1);
  rand = Math.round(rand);
  return rand;
};

var generateComments = function (amount) {
  var commentaries = [];

  for (var j = 0; j < amount; j++) {
    commentaries[j] = {
      avatar: 'img/avatar-' + randomInteger(1, 6) + '.svg',
      name: names[randomInteger(0, 10)],
      message: comments[randomInteger(0, comments.length - 1)] + ' ' + comments[randomInteger(0, comments.length - 1)]
    };
  }

  return commentaries;
};

// Функция для генерации массива картинок
var generatePictures = function (picCol) {
  var pictures = [];
  var amountComments = randomInteger(1, 10);

  for (var i = 1; i <= picCol; i++) {
    pictures[i] = {
      url: 'photos/' + i + '.jpg',
      likes: randomInteger(15, 200),
      comments: generateComments(amountComments),
      description: description[randomInteger(0, description.length - 1)],
      numberPicture: i,
    };
  }

  return pictures;
};

// генерим массив с картинками
var picturesArray = generatePictures(lengthPictures);


// функция наполнения .pictures
var renderPictures = function (data) {
  var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var items = document.createDocumentFragment();

  for (var i = 1; i < data.length; i++) {
    var pictureElement = pictureTemplate.cloneNode(true);

    pictureElement.dataset.number = data[i].numberPicture;
    pictureElement.querySelector('.picture__img').src = data[i].url;
    pictureElement.querySelector('.picture__likes').textContent = data[i].likes;
    pictureElement.querySelector('.picture__comments').textContent = data[i].comments.length;

    items.appendChild(pictureElement);
  }

  pictureBox.appendChild(items);
};

// Закрытие .big-picture
var closeBigPicture = function () {
  bigPicture.classList.add('hidden');
  document.removeEventListener('keydown', onEscPress);
  bodyEl.classList.remove('modal-open');
};


// Функция для работы с .big-picture
var showBigPicture = function (data) {
  var socialCommentsList = bigPicture.querySelector('.social__comments');
  var itemsComments = document.createDocumentFragment();


  // открываем попап с первой фоткой и добавляем ему всякое из П.4
  bigPicture.classList.remove('hidden');
  bigPicture.querySelector('.big-picture__img img').src = data.url;
  bigPicture.querySelector('.likes-count').textContent = data.likes;
  bigPicture.querySelector('.comments-count').textContent = data.comments.length;
  bigPicture.querySelector('.social__caption').textContent = data.description;

  // очищаем список комментариев
  socialCommentsList.innerHTML = '';

  // Добавляем комментарии в этот попап
  for (var j = 0; j < data.comments.length; j++) {
    var li = document.createElement('li');
    var img = document.createElement('img');
    var p = document.createElement('p');

    li.classList.add('social__comment');
    li.classList.add('social__comment--text');

    img.classList.add('social__picture');
    img.src = data.comments[j].avatar;
    img.alt = 'Аватар комментатора фотографии';
    img.width = 35;
    img.height = 35;

    p.classList.add('social__text');
    p.textContent = data.comments[j].message;

    li.appendChild(img);
    li.appendChild(p);

    itemsComments.appendChild(li);
  }

  socialCommentsList.appendChild(itemsComments);

  // прячем счетчики и загрузки новых комментариев
  bigPicture.querySelector('.social__comment-count').classList.add('hidden');
  bigPicture.querySelector('.comments-loader').classList.add('hidden');

  document.addEventListener('keydown', onEscPress);

  // добавляем для body класс чтоб не прокручивался
  bodyEl.classList.add('modal-open');
};

// закрытие по ESC
var onEscPress = function (e) {
  if (e.keyCode === KEY_ESC) {
    e.preventDefault();
    closeBigPicture();
    closeFormUpload();
  }
};

// применяет фильтр
var applyEffect = function (val) {
  var checkedEffect = effects.querySelector('.effects__radio:checked');
  var effectLevelInput = effectLevel.querySelector('.effect-level__value');
  var effect = checkedEffect.value;

  effectLine.style.width = val + '%';
  sliderPin.style.left = val + '%';
  effectLevelInput.value = val;

  if (effect === 'none') {
    effectLevel.classList.add('hidden');
  } else {
    effectLevel.classList.remove('hidden');
  }

  var maxSize = 1;
  var minSize = 1;
  var coefficient = maxSize * val / 100;
  var filterVal;

  switch (effect) {
    case 'chrome':
      filterVal = 'grayscale(' + coefficient + ')';

      break;

    case 'sepia':
      filterVal = 'sepia(' + coefficient + ')';

      break;

    case 'marvin':
      filterVal = 'invert(' + val + '%)';
      break;

    case 'phobos':
      maxSize = 3;
      coefficient = maxSize * val / 100;

      filterVal = 'blur(' + coefficient + 'px)';
      break;

    case 'heat':
      maxSize = 3;
      coefficient = (maxSize - minSize) * val / 100 + minSize;
      filterVal = 'brightness(' + coefficient + ')';

      break;
  }

  imgPreview.style.filter = (effect !== 'none' && val !== 100) ? filterVal : '';
};

// меняет эффект
var changeEffect = function (effect) {
  imgPreview.className = 'effects__preview--' + effect;
  applyEffect(100);
};

// измеряет значение ползунка
var effectLevelUpdate = function () {
  var sliderLine = effectLevel.querySelector('.effect-level__line');

  // измеряю по линии depth так как она находится прямо в центре ползунка
  var effectValue = effectLine.offsetWidth / sliderLine.offsetWidth * 100;

  applyEffect(effectValue.toFixed(2));
};

// открывает форму редактирования
var openFormUpload = function () {
  imgPreview.className = '';
  imgPreview.style = '';
  pictureBox.querySelector('.img-upload__overlay').classList.remove('hidden');

  // так как при открытии стандартно выбран "Оригинал" - скрываю ползунок и очищаю форму
  effectLevel.classList.add('hidden');
  document.querySelector('#upload-select-image').reset();

  document.addEventListener('keydown', onEscPress);
  bodyEl.classList.add('modal-open');


  sliderPin.addEventListener('mouseup', effectLevelUpdate);

  scaleInput.value = '100%';

  effects.addEventListener('change', function (e) {
    var input = e.target.closest('.effects__radio');

    if (!input) {
      return;
    }

    changeEffect(input.value);
  });
};

// закрывает форму редактирования
var closeFormUpload = function () {
  pictureBox.querySelector('.img-upload__overlay').classList.add('hidden');
  document.removeEventListener('keydown', onEscPress);
  bodyEl.classList.remove('modal-open');
  uploadInput.value = '';
};

var scaleUpdate = function (act) {
  var scaleStep = 25;
  var scaleMax = 100;
  var scaleMin = 25;
  var scaleNow = parseInt(scaleInput.value, 10);
  var scaleTotal = scaleNow;

  if (act === 'reduce' && scaleNow > scaleMin) {
    scaleTotal = scaleNow - scaleStep;
  }
  if (act === 'increase' && scaleNow < scaleMax) {
    scaleTotal = scaleNow + scaleStep;
  }

  scaleInput.value = scaleTotal + '%';
  imgPreview.style.transform = 'scale(' + scaleTotal / 100 + ')';
};

renderPictures(picturesArray);

// при клике на .picture открываем картинки в попапе
pictureBox.addEventListener('click', function (e) {
  var picture = e.target.closest('.picture');

  if (!picture) {
    return;
  }

  e.preventDefault();

  showBigPicture(picturesArray[picture.dataset.number]);
});

// Закрываем попап с картинкой
var popupClose = document.querySelector('#picture-cancel');
var formClose = document.querySelector('#upload-cancel');

popupClose.addEventListener('click', closeBigPicture);
formClose.addEventListener('click', closeFormUpload);

uploadInput.addEventListener('change', openFormUpload);

scale.addEventListener('click', function (e) {
  var smaller = e.target.closest('.scale__control--smaller');
  var bigger = e.target.closest('.scale__control--bigger');

  if (smaller) {
    scaleUpdate('reduce');
  } else if (bigger) {
    scaleUpdate('increase');
  } else {
    return;
  }

  e.preventDefault();
});

// работа с хеш-тегами
var btnSubmitUpload = document.querySelector('#upload-submit');

var submitFormUpload = function (e) {
  var hashtagsInput = document.querySelector('.text__hashtags');
  var hashtagsArr = hashtagsInput.value.split(' ');
  var error = '';


  var duplicateHashtags = hashtagsArr.filter(function (elem, pos, arr) {
      return pos !== arr.indexOf(elem) || pos !== arr.lastIndexOf(elem);
  });

  if(duplicateHashtags.length) {
    error = 'Есть повторяющиеся хеш-теги';
  }

  if(hashtagsArr.length > 5) {
    error = 'Хеш-тегов не может быть больше 5';
  }

  if (hashtagsArr.length && hashtagsInput.value.length) {
    for(var h = 0; h < hashtagsArr.length; h++) {
      if(!hashtagsArr[h].match(/^#[а-яА-ЯёЁa-zA-Z0-9]{1,19}/)) {
        error = h + 1 + '-й хеш-тэг указан неверно';
      }
    }
  }

  if(error) {
    hashtagsInput.setCustomValidity(error);

    e.preventDefault();
    return;
  }

};

btnSubmitUpload.addEventListener('click', submitFormUpload);
