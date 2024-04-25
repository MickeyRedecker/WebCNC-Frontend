# WebCNC Frontend
## Web-based Centralized Network Controller (CNC) for Time-Sensitive Networking (TNS)

This software is released under the MIT License. 

It has been developed as part of a bachelor thesis at the University of Stuttgart.

The WebCNC can be used to manually configure IEEE 802.1Qbv compliant switches that support SNMPv3 through a web application. 

This project is the frontend, the webcnc backend project is also required to use the WebCNC.

I recommend setting up the backend before the frontend.

### Prerequisites:

#### Building the frontend

- Node.js (tested with version 21.1.0)
- Node package manager (npm) (tested with version 10.2.0)

#### Hosting the frontend

- A web server of your choice to host the frontend

### Building the project

##### Step 1: Installing dependencies

The project depends on multiple libraries that need to be installed via the node package manager (npm)

- navigate to the project's root directory (the directory containing this file)
- install the dependencies with npm:
```
npm install
```

#### Step 2: Configuring the frontend

Next, you need to configure the frontend to be able to connect to the backend

- navigate to the project's root directory (the directory containing this file)
- open the .env file

- set *VITE_BACKEND_ADDRESS* to the dns name of the backend (something like https://mybackenddomain.com)
- set *VITE_BACKEND_PORT* to the HTTPS port of the backend (as defined in the application.properties of the backend)

#### Step 3: Building the frontend

- navigate to the project's root directory (the directory containing this file)
- transpile and build the project using this command:
```
npm run build
```

- this will create a folder called *dist* . It contains the static files of the frontend that need to be served to clients via a web browser.

### Hosting the frontend

- move the *dist* folder to a directory on the host server

- obtain a TLS certificate.

About self-signed certificates: When using self-signed certificates, it is recommended to add them to the browser's trust store. 
Otherwise, under Firefox, the WebCNC won´t work at all. Under Chrome, it will work when backend and frontend use the same self-signed certificate.


- install a web server of your choice (for example nginx)
- configure the previously created *dist* folder as the web root of the web server

#### instructions for nginx:
Any webserver can be used to host the frontend. This section provides an example setup with nginx.

- install nginx with 
```
sudo apt install nginx
```
or 
```
sudo dnf install nginx
```
depending on your package manager.

- start nginx with
```
sudo systemctl start nginx
```

- navigate to
```
cd /etc/nginx/sites-available/
```

- create a configuration file for the webcnc frontend:
```
sudo nano webcnc_frontend_server
```

- the configuration looks something like this:
```
server {
    listen 80;
    server_name vssrv1.infra.informatik.uni-stuttgart.de;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name vssrv1.infra.informatik.uni-stuttgart.de;

    ssl_certificate /home/redeckmy/certificate/cert.pem;
    ssl_certificate_key /home/redeckmy/certificate/key.pem;
	
	
    root /home/redeckmy/frontend_static_files/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```
Adjust the addresses and paths to match your respective setup.
This configuration file will redirect HTTP requests on port 80 to HTTPS port 443

- link the configuration to the folder of active configurations:
```
sudo ln -s /etc/nginx/sites-available/webcnc_frontend_server /etc/nginx/sites-enabled/
```

- if the *default* configuration is present in /etc/nginx/sites-enabled/ , remove it to avoid issues:
```
sudo rm /etc/nginx/sites-enabled/default
```

- check the nginx configuration with 
```
sudo nginx -t
```

- restart nginx:
```
sudo systemctl restart nginx
```

- depending on your setup, you might have to change your firewall rules to allow HTTP requests on port 80 and HTTPS requests on port 443

### Accessing the WebCNC web application

To access the WebCNC webapp, just open the website that you have previously set up using a web browser of your choice. Being a GUI, using the frontend should be intuitive.

As a Single Page Application, the WebCNC will not work if your browser has JavaScript disabled.
It is also required to allow browser alerts and confirmation windows for some of the WebCNC's functionality.

The WebCNC has been tested using Google Chrome, but it should work with any modern browser.
