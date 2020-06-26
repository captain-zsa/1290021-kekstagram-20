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
  'Елизавета',
];

var bigPicture = document.querySelector('.big-picture');
var pictureBox = document.querySelector('.pictures');
var bodyEl = document.querySelector('body');

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
      avatar  : "img/avatar-" + randomInteger(1, 6) + ".svg",
      name    : names[randomInteger(0, 10)],
      message : comments[randomInteger(0, comments.length - 1)] + ' ' + comments[randomInteger(0, comments.length - 1)]
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
      url           : 'photos/' + i + '.jpg',
      likes         : randomInteger(15, 200),
      comments      : generateComments(amountComments),
      description   : description[randomInteger(0, description.length - 1)],
      numberPicture : i,
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
  // удаляем у body класс
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

var onEscPress = function (e) {
  e.preventDefault();
  if (e.keyCode === KEY_ESC) {
    closeBigPicture();
  }
};

renderPictures(picturesArray);

// при клике на .picture открываем картинки в попапе
pictureBox.addEventListener('click', function (e) {
  var picture = e.target.closest('.picture');

  e.preventDefault();

  if (!picture) {
    return;
  }

  showBigPicture(picturesArray[picture.dataset.number]);
});

// Закрываем попап с картинкой
var popupClose = document.querySelector('#picture-cancel');
popupClose.addEventListener('click', closeBigPicture);

// Резетим всю форму
