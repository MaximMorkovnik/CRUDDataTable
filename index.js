// https://54e23e019413.ngrok.io/users GET -> list of the users
// https://54e23e019413.ngrok.io/users/{id} GET -> info about 1 user

// https://54e23e019413.ngrok.io/users POST -> {name, surname, email} -> create new user

// https://54e23e019413.ngrok.io/users PATCH -> {name, surname, email} -> edit user

// https://54e23e019413.ngrok.io/users/{id} DELETE -> remove user

const URL = 'https://54e23e019413.ngrok.io/users';

function updateUserData(id, dataToChange) {
    const request = new XMLHttpRequest();

    request.open('PATCH', `${URL}/${id}`);

    request.setRequestHeader('Content-Type', 'aplication/json');

    request.send(JSON.stringify(dataToChange));

    request.addEventListener('load', () => {
        console.log(request.response);
    });
}

function editUser(event) {
    const row = event.target.closest('tr');
    const disabledInputs = row.querySelectorAll('input:disabled');

    disabledInputs.forEach(input => {
        input.removeAttribute('disabled');
    });

    event.target.setAttribute('hidden', true);
    row.querySelector('[data-action="save"]').removeAttribute('hidden');
}

function saveEditedUser(event) {
    const row = event.target.closest('tr');
    const disabledInputs = row.querySelectorAll('input');

    const id = row.getAttribute('data-id');
    const editedData = {};

    disabledInputs.forEach(input => {
        const name = input.getAttribute('name');

        editedData[name] = input.value.trim();

        input.setAttribute('disabled', true);
    });

    updateUserData(id, editedData);

    event.target.setAttribute('hidden', true);
    row.querySelector('[data-action="edit"]').removeAttribute('hidden');
}

function deleteUser() {
    const row = event.target.closest('tr');
    const id = row.getAttribute('data-id');

    const request = new XMLHttpRequest();

    request.open('DELETE', `${URL}/${id}`);

    request.send();

    request.addEventListener('load', () => {
        row.remove();
    });
}

function renderUser(users) {
    usersTable.innerHTML = ''; // очищаем таблицу

    users.map(user => { // map сделал новый массив 
        const tr = document.createElement('tr'); // создаем один тег <tr> в списке пользователей

        tr.setAttribute('data-id', user._id); // проставляем ему id

        tr.innerHTML = `  
                <td>
                    <input type="text" value="${user.name}" name="name" disabled>
                </td>
                <td>
                    <input type="text" value="${user.surname}" name="surname" disabled>
                </td>
                <td>
                    <input type="email" value="${user.email}" name="email" disabled>
                </td>
        `;  // записываем в него html код

        const td = document.createElement('td'); // td с кнопками делаем програмно

        const buttonEdit = document.createElement('button');
        const buttonSave = buttonEdit.cloneNode();
        const buttonDelete = buttonEdit.cloneNode();

        buttonSave.innerText = 'SAVE'; // добавили туда текст
        buttonEdit.innerText = 'EDIT';
        buttonDelete.innerText = 'DELETE';

        buttonSave.setAttribute('data-action', 'save'); // добавили туда 'data-action', чтобы знать на какую кнопку, куда кликнули
        buttonEdit.setAttribute('data-action', 'edit');
        buttonDelete.setAttribute('data-action', 'delete');

        buttonSave.setAttribute('hidden', true); // одну кнопку скрыли
        buttonSave.addEventListener('click', saveEditedUser); // прикрепили 'click'
        buttonEdit.setAttribute('click', editUser);
        buttonDelete.setAttribute('click', deleteUser);

        td.append(buttonSave); // все эти кнопки добавили в последний td
        td.append(buttonEdit);
        td.append(buttonDelete);

        tr.append(td); // в tr добавили td

        return tr;
    }).forEach(element => {
        usersTable.append(element);
    });
}

function getUsers() {
    const request = new XMLHttpRequest(); // создаем запрос

    request.open('GET', URL);

    request.send();

    request.addEventListener('load', () => {
        const users = JSON.parse(request.response);

        renderUsers(users);
    });
}

getUsers();

const usersTable = document.getElementById('users');
const newUserForm = document.getElementById('new-user');

function addNewUser(user) {
    const request = new XMLHttpRequest();

    request.open('POST', URL);

    request.setRequestHeader('Content-Type', 'aplication/json');

    request.send(JSON.stringify(user));

    request.addEventListener('load', () => {
        getUsers();
    });
}

newUserForm.addEventListener('submit', event => {
    event.preventDefault(); // отмена действия браузера по умолчанию 

    const newUser = {
        name: newUserForm.element.name.value.trim(),
        surname: newUserForm.element.surname.value.trim(),
        email: newUserForm.element.email.value.trim()
    };

    addNewUser(newUser);

    newUserForm.elements.name.value = '';
    newUserForm.elements.surname.value = '';
    newUserForm.elements.email.value = '';
});