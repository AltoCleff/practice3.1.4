$(document).ready(async function () {
    await userInfo()
    await allUserTable();
    await newUser();
    await  deleteUser();
    await editUser();
});

async function allUserTable() {
    let table = $('#allUsersTableBody').empty();
    await fetch('/api/users',{
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Referer': null
        }
    })
        .then(response => response.json())
        .then(body => {
            body.forEach(user => {
                let tableBody = `$(
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.name}</td>
                            <td>${user.lastName}</td>
                            <td>${user.age}</td>     
                            <td>${user.email}</td>                                       
                            <td>
                                ${user.roles.map(role => role.name).join(' ')}
                            </td> 
                            <td>
                            <button href="/api/users/${user.id}"
                                type="button"
                                class="btn btn-info editButton"
                                data-toggle="modal">Edit</button>
                            </td>    
                            <td>
                             <button href="/api/users/${user.id}"
                                type="button"
                                class="btn btn-danger deleteButton"
                                data-toggle="modal">Delete</button>
                            </td>      
                        </tr>
                )`;
                table.append(tableBody);
            })
        })
    $('#allUsersTableBody .deleteButton').on('click', async function(event) {
        event.preventDefault();
        let req = $(this).attr('href');
        let roleList = $('#deleteUserRoles').empty();

        await fetch('/api/users/roles',{
            method: 'GET',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Referer': null
            }
        })
            .then(response => response.json())
            .then(body => {
                    for(let i = 0; i < body.length; i++) {
                        let option = `$(<option value=${body[i].name}>${body[i].name}</option>))`;
                        roleList.append(option);
                    }
            });
        await fetch(req)
            .then(response => response.json())
            .then(async function (user) {
                $('#deleteUserId').val(user.id);
                $('#deleteUserName').val(user.name);
                $('#deleteUserLastname').val(user.lastName);
                $('#deleteUserAge').val(user.age);
                $('#deleteUserEmail').val(user.email);
            });
        $('#deleteUser').modal();
    });

    $('#allUsersTableBody .editButton').on('click', async function (event) {
        event.preventDefault();
        let req = $(this).attr('href');
        let roleList = $('#editUserRoles').empty();
        await fetch('/api/users/roles',{
            method: 'GET',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Referer': null
            }
        })
            .then(response => response.json())
            .then(body => {
                for(let i = 0; i < body.length; i++) {
                    let option = `$(<option value=${body[i].name}>${body[i].name}</option>))`;
                    roleList.append(option);
                }
            });
        await fetch(req)
            .then(response => response.json())
            .then(async function (user) {
                    $('#editUserId').val(user.id);
                    $('#editUserName').val(user.name);
                    $('#editUserLastname').val(user.lastName);
                    $('#editUserAge').val(user.age);
                    $('#editUserEmail').val(user.email);
            });
        $('#editUser').modal();
    });

    $('#new-user-tab').on('click', async(event) => {
        event.preventDefault();
        let roleList = $('#newUserRoles').empty();
        await fetch('/api/users/roles',{
            method: 'GET',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Referer': null
            }
        })
            .then(response => response.json())
            .then(body => {
                for(let i = 0; i < body.length; i++) {
                    let option = `$(<option value=${body[i].name}>${body[i].name}</option>))`;
                    roleList.append(option);
                }
            });
    });
}

async function newUser() {
    const form = document.getElementById('newUser');
    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        const data = {
            id: $('#newUserId').val(),
            name: $('#newUserName').val(),
            lastName:  $('#newUserLastname').val(),
            age: $('#newUserAge').val(),
            email: $('#newUserEmail').val(),
            password: $('#newUserPassword').val(),
            roles: $('#newUserRoles').val()
        };
        let json = JSON.stringify(data);
        console.log(json);
        let response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: json
        });
        if (response.ok) {
            document.getElementById("newUser").reset();
            document.getElementById('user-table-tab').click();
            await allUserTable();
        }
    });
}

async function deleteUser() {
    const form = document.getElementById('deleteForm');
    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        const data = {
            id: $('#deleteUserId').val(),
            name: $('#deleteUserName').val(),
            lastName:  $('#deleteUserLastname').val(),
            age: $('#deleteUserAge').val(),
            email: $('#deleteUserEmail').val(),
            password: $('#deleteUserPassword').val(),
            roles: $('#deleteUserRoles').val()
        };
        let json = JSON.stringify(data);
        let response = await fetch(`/api/users/${data.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: json
        });
        if (response.ok) {
            $('#deleteUser').modal('hide');
            await allUserTable();
        }
    });
}

async function editUser() {
    const form = document.getElementById('editForm');
    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        const data = {
            id: $('#editUserId').val(),
            name: $('#editUserName').val(),
            lastName:  $('#editUserLastname').val(),
            age: $('#editUserAge').val(),
            email: $('#editUserEmail').val(),
            password: $('#editUserPassword').val(),
            roles: $('#editUserRoles').val()
        };
        let json = JSON.stringify(data);
        let response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: json
        });
        if (response.ok) {
            $('#editUser').modal('hide');
            await allUserTable();
        }
    });
}

async function userInfo() {
    let userTable = $('#userTableBody').empty();
    await fetch('/api/user/auth',{
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Referer': null
        }
    })
        .then(res => res.json())
        .then(user => {
            $('#userEmail').html(user.email);
            $('#userRoles').html(user.roles.map(role => role.name).join('\n'));
            let table = `$(
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.name}</td>
                            <td>${user.lastName}</td>
                            <td>${user.age}</td>     
                            <td>${user.email}</td>                                       
                            <td>
                                ${user.roles.map(role => role.name).join(' ')}
                            </td>                           
                        </tr>
                )`;
            userTable.append(table);
        })


}