export class APIRequest {
    constructor() {
        this.http = new XMLHttpRequest();
    }

    baseUrl = "https://imcard.one/api/v1";

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
                callback(null,data.data);
            }
        }
        this.http.onerror = () => {
            let error = "Request failed";
            callback(error, null);
        }
    }

    //Get external request
    getExternal = (url, callback) => {
        this.http.open('GET',url,true);
        this.http.send();
        this.http.onload = () => {
            if (this.http.status !== 200){
                let data = JSON.parse(this.http.responseText);
                console.log(data);
                callback(data);
            }
            else {
                let data = JSON.parse(this.http.responseText);
                callback(null,data.data);
            }
        }
        this.http.onerror = () => {
            let error = "Request failed";
            callback(error, null);
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
                callback(null,data.data);
            }
        }
        this.http.onerror = () => {
            let error = "Request failed";
            callback(error, null);
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
                callback(null,data.data);
            }
        }
        this.http.onerror = () => {
            let error = "Request failed";
            callback(error, null);
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
                callback(null,data.data);
            }
        }
        this.http.onerror = () => {
            let error = "Request failed";
            callback(error, null);
        }
    }


    //login request
    login = (url, req, callback) => {
        try {
            console.log(`url====> ${url}`);
            console.log(`payload====> ${req}`);
            this.http.open('POST',url,true);
            this.http.setRequestHeader('Content-Type', 'application/json');
            this.http.send(JSON.stringify(req));
            this.http.onload = () => {
                if (this.http.status !== 200 && this.http.status !== 201){
                    let error = JSON.parse(this.http.responseText);
                    console.log(`response====> ${error}`);
                    callback(error, null);
                } else {
                    let data = JSON.parse(this.http.responseText);
                    console.log(`response====> ${data}`);
                    callback(null,data.data);
                }
            }
            this.http.onerror = () => {
                let error = "Login failed";
                callback(error, null);
            }
        } catch (e) {
            callback(e);
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
                callback(null,data.data);
            }
        }
        this.http.onerror = () => {
            let error = "Request failed";
            callback(error, null);
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
                callback(null,data.data);
            }
        }
        this.http.onerror = () => {
            let error = "Request failed";
            callback(error, null);
        }
    }
}