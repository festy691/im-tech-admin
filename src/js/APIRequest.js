export class APIRequest {
    constructor() {
        this.http = new XMLHttpRequest();
    }

    //Get request
    get = (url, callback) => {
        this.http.open('GET',url,true);
        this.http.setRequestHeader('Authorization', `bearer ${sessionStorage.getItem('login')}`);
        this.http.send();
        this.http.onload = () => {
            if (this.http.status !== 200){
                let data = JSON.parse(this.http.responseText);
                console.log(data);
                callback(data);
            }
            else {
                let data = JSON.parse(this.http.responseText);
                callback(null,data);
            }
        }
    }

    //post request
    post = (url, req, callback) => {
        this.http.open('POST',url,true);
        this.http.setRequestHeader('Content-Type', 'application/json');
        this.http.setRequestHeader('Authorization', `bearer ${sessionStorage.getItem('login')}`);
        this.http.send(JSON.stringify(req));
        this.http.onload = () => {
            if (this.http.status !== 200 && this.http.status !== 201){
                let data = JSON.parse(this.http.responseText);
                callback(data);
            }
            else {
                let data = JSON.parse(this.http.responseText);
                callback(null,data);
            }
        }
    }


    //post request via form data
    postForm = (url, req, callback) => {
        this.http.open('POST',url,true);
        this.http.setRequestHeader('Authorization', `bearer ${sessionStorage.getItem('login')}`);
        this.http.send(req);
        this.http.onload = () => {
            if (this.http.status !== 200 && this.http.status !== 201){
                let data = JSON.parse(this.http.responseText);
                console.log(data);
                callback(data);
            }
            else {
                let data = JSON.parse(this.http.responseText);
                callback(null,data);
            }
        }
    }


    //put request via form data
    putForm = (url, req, callback) => {
        this.http.open('PUT',url,true);
        this.http.setRequestHeader('Authorization', `bearer ${sessionStorage.getItem('login')}`);
        this.http.send(req);
        this.http.onload = () => {
            if (this.http.status !== 200 && this.http.status !== 201){
                let data = JSON.parse(this.http.responseText);
                callback(data);
            }
            else {
                let data = JSON.parse(this.http.responseText);
                callback(null,data);
            }
        }
    }


    //login request
    login = (url, req, callback) => {
        this.http.open('POST',url,true);
        this.http.setRequestHeader('Content-Type', 'application/json');
        this.http.send(JSON.stringify(req));
        this.http.onload = () => {
            if (this.http.status !== 200 && this.http.status !== 201){
                let data = JSON.parse(this.http.responseText);
                console.log(data);
                callback(data);
            }
            else {
                let data = JSON.parse(this.http.responseText);
                callback(null,data);
            }
        }
    }


    //put request
    put = (url, req, callback) => {
        this.http.open('PUT',url,true);
        this.http.setRequestHeader('Content-Type', 'application/json');
        this.http.setRequestHeader('Authorization', `bearer ${sessionStorage.getItem('login')}`);
        this.http.send(JSON.stringify(req));
        this.http.onload = () => {
            if (this.http.status !== 200 && this.http.status !== 201){
                let data = JSON.parse(this.http.responseText);
                callback(data);
            }
            else {
                let data = JSON.parse(this.http.responseText);
                callback(null,data);
            }
        }
    }


    //delete request
    delete = (url, callback) => {
        this.http.open('DELETE',url,true);
        this.http.setRequestHeader('Authorization', `bearer ${sessionStorage.getItem('login')}`);
        this.http.send();
        this.http.onload = () => {
            if (this.http.status !== 200 && this.http.status !== 201){
                let data = JSON.parse(this.http.responseText);
                callback(data);
            }
            else {
                let data = JSON.parse(this.http.responseText);
                callback(null,data);
            }
        }
    }
}