import $http from './index.js'

export function getUsers(){
    return $http.get('/users');
}

export function getUserById(id) {
  return $http.get(`/user/${id}`);  
}

export function login(username,password){
    return $http.post('/login',{
        username,password
    });
}
export function registerUser(data) {
    return $http.post('/register', { data });
}
export function deleteUserById(id) {
    return $http.post('/del', { data: { id } });
}
export function updateUser(data) {
  return $http.post('/update', { data })
}