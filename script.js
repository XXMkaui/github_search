const formInput = document.getElementsByClassName('form__input')[0];
const formSearchBtn = document.getElementsByClassName('form__search-btn')[0];

formSearchBtn.addEventListener('click', getRepos);

isInvalid = false;

function getRepos(e) {
  e.preventDefault();

  if (formInput.value === '') {
    if (document.getElementsByClassName('no-repo').length > 0) {
      document.getElementsByClassName('no-repo')[0].remove();
    }

    if (document.getElementsByClassName('repo-list').length > 0) document.getElementsByClassName('repo-list')[0].remove();

    formInput.classList.add('input-invalid');

    if (document.getElementsByClassName('invalid-msg').length < 1) {
      const invalidMsg = document.createElement('div');
      invalidMsg.classList = 'invalid-msg';
      invalidMsg.innerHTML = '<p>The minimum length of a repository is 1 character!</p>';
      document.getElementsByClassName('card__form')[0].insertAdjacentElement('afterend', invalidMsg);
    }

    isInvalid = true;
    return 0;
  }
  if (isInvalid) { 
    formInput.classList.remove('input-invalid');
    document.getElementsByClassName('invalid-msg')[0].remove();
  }

  const xhr = new XMLHttpRequest();

  xhr.open('GET', `https://api.github.com/search/repositories?q=${formInput.value}&per_page=10`);

  xhr.send();

  xhr.onload = function () {
    console.log('Соеденинение установлено!');
    const xhrResponse = JSON.parse(xhr.response);
    if (xhrResponse.total_count > 0) {
      if (document.getElementsByClassName('no-repo').length > 0) {
        document.getElementsByClassName('no-repo')[0].remove();
      }
      console.log('Репозитории найдены!');
      console.log(xhrResponse);
      console.log(xhrResponse.message);

      if (document.getElementsByClassName('repo-list').length > 0) document.getElementsByClassName('repo-list')[0].remove();

      if (document.getElementsByClassName('repo-list').length < 1) {
        // const repos = document.createElement('div');
        // repos.classList = 'repo-list';
        // repos.innerHTML = `<p>${xhrResponse.items[0].html_url}</p>`;
        // document.getElementsByClassName('card__form')[0].insertAdjacentElement('afterend', repos);
        const repos = document.createElement('div');
        repos.classList = 'repo-list';
        for (let i = 0; i < xhrResponse.total_count; i++) {
          if (i == 10) break;
          repos.innerHTML += `
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px">
                <p style="font-size: 13px;"><span style="color: #F8EDE3">Lan: </span><span style="background-color: #F8EDE3; color: #7D6E83; padding: 1px 5px; border-radius: 10px;">${xhrResponse.items[i].language}</span></p>
                <a target="_blank" href="${xhrResponse.items[i].html_url}"style="width: 70%"><input readonly style="color: #F8EDE3; font-size: 13px; width: 100%; height: 100%; font-family: 'Albert Sans', sans-serif;" value="${xhrResponse.items[i].html_url.slice(8)}"></a>
              </div>
          `;
        }
        document.getElementsByClassName('card__form')[0].insertAdjacentElement('afterend', repos);
      }

    } else {
      console.log('ОШИБКА! Репозитории не найдены!');
      console.log(xhrResponse);
      console.log(xhrResponse.message);
      if (document.getElementsByClassName('repo-list').length > 0) document.getElementsByClassName('repo-list')[0].remove();

      if (document.getElementsByClassName('no-repo').length < 1) {
        const noRepo = document.createElement('div');
        noRepo.classList = 'no-repo';
        noRepo.innerHTML = '<p>No repositories for this substring!</p>';
        document.getElementsByClassName('card__form')[0].insertAdjacentElement('afterend', noRepo);
      }
    }
  }

  xhr.onerror = function () {
    console.log('Ошибка соединения!');
  }

}

function validation() {
  if (formInput.value !== '') {
    if (formInput.classList !== 'form__input') formInput.classList.remove('input-invalid');
    if (document.getElementsByClassName('invalid-msg').length > 0) document.getElementsByClassName('invalid-msg')[0].remove();
    isInvalid = false;  
  }
}
