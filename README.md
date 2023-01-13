# Office Day Scheduler
<p align="justify"> Since employees have both the office and remote working options, it is desired to develop a system that will keep information such as which and how many days they come to the office for each month, which days they work remotely, information about the department they are affiliated with, how many days off they are, which region they come from and which transportation option they use. It was aimed to develop this system so that these actions can be performed using a certain common platform. </p>

## Used Technologies
1. Back-end: Spring Boot 2.7.4
2. Front-end: React.js
3. Database: PostgreSQL

## Installation 
### Back-End
- Clone from GitHub
```
git clone https://github.com/oguzhanulusoy/office-day-scheduler.git
```
- Install PostgreSQL and create a database. In order to configure the database connection, write your own username, password and the name of the database you created in the application.properties file. Setting the "spring.jpa.hibernate.ddl-auto" to "update" and running the project will create tables in the database.
- Install Lombok and add to your IDE.
### application.properties
```
spring.jpa.hibernate.ddl-auto = update
spring.datasource.url = jdbc:postgresql://localhost:5432/ /* your database name */
spring.datasource.username = /* your PostgreSQL username */
spring.datasource.password = /* your PostgreSQL password */
spring.datasource.driver-class-name = org.postgresql.Driver
server.port = 8090 /* you can change the port */
spring.jpa.show-sql = true
spring.jpa.properties.hibernate.default_schema = public
spring.jpa.properties.hibernate.dialect = org.hibernate.dialect.PostgreSQLDialect
ods.app.secret = odscheduler
ods.expires.in = 60000
refresh.token.expires.in = 604800

```

* Note: Make sure that the port number defined in the "package.json" file in the React project, is the same as the port number in "application.properties"

```
"proxy": "http://localhost:8090"
```

### Front-End (React.js)
- Install Node.js
- Clone the project and open with Visual Studio Code
- In this project, Material UI is used. If you get errors about MUI packages, you can install the mui in your terminal according to https://mui.com/
- Then, try "npm start" command to run project
- If you get the following error, try running the following command 

```
npm install mui-datatables --save --legacy-peer-deps

```
![image1](/docs/image1.jpg)

## Scenarios
* Role -> User is able to create, read, update and delete the data both on the server side and on the client side.
* Out of Office Day -> User is able to create, read, update and delete the data both on the server side and on the client side.
* Department -> User is able to create, read, update and delete the data both on the server side and on the client side.
* Schedule -> User is able to create, read, update and delete the data on the server side. On the client side, user can only read data. The user interface needs to be improved so that data can be added, updated and deleted.
* Calendar -> User is able to create, read, update and delete the data on the server side. On the client side, user can only read data. The user interface needs to be improved so that data can be added, updated and deleted.
* User -> User is able to create, read, update and delete the data on the server side. On the client side, user can only read data. The user interface needs to be improved so that data can be updated.
* Zone -> User is able to create, read, update and delete the data on the server side. On the client side, user can only read data. The user interface needs to be improved so that data can be added, updated and deleted.
* User is able to login on the server side.
* User is not able to login on the client side.
* User is able to choose dates and mark them as Office or Work From Home on the client side, but the data is not saved to the database and user cannot remove the selected items from the calendar in order to make new choice.
* User is able to use refresh token to get new access token on the server side, but there is no implementation on the client side.
* When the authentication is completed in the client side, information such as logged in user's zone, report, vacation should be obtained and sent to database.

### Authentication & Authorization
#### Roles
* EMPLOYEE
* MANAGER
* SUPER_USER

<p align="justify"> If you want to login to the system and get the access token using Postman, you should have a user entity by sending POST request to "/user" URL. Before that, there is a relationship between "Role" & "User", "Zone" & "User" and "Department" & "User", so that you should create "Role", "Zone" and "Department" entities first. While sending POST request to "/zone", "/role" or "/department" URLs, be careful about the fields and validation rules defined in "RoleCreateRequest.java", "ZoneCreateRequest.java" and "DepartmentCreateRequest.java" classes. After that, create a user and try to send POST request to "/auth/login" URL using the following fields: </p> 

```
    {  
    "email":"example@gmail.com",
    "password":"example"
    }
```
<p align="justify"> The antMatchers() is a Spring Boot HTTP method used to configure the URL paths from which the Spring Boot application security should permit requests based on the user's roles. By creating the AUTH_LIST list and passing the list as a parameter to the antMatchers() in the filterChain() method in the “SecurityConfig.java” class, we indicate that users can perform all actions throughout the application.  Otherwise, the user will receive a “401 Unauthorized” response status code.  You can edit the "AUTH_LIST" according to the restrictions you want to impose. </p>

```
 private static final String[] AUTH_LIST = {
            "/role/**",
            "/zone/**",
            "/schedule/**",
            "/user/**",
            "/department/**",
            "/outofofficeday/**",
            "/calendar/**",
    };
```

```
.antMatchers(AUTH_LIST).permitAll()

```

	
Screenshots           |  Screenshots 
:-------------------------:|:-------------------------:
![image5](/docs/image5.jpg)  |  ![image2](/docs/image2.jpg)
![image3](/docs/image3.jpg)  |  ![image4](/docs/image4.jpg)

