# Chat App – Part 1

## Registration, Login and Unit Testing

### 1. Project Overview

This project is the first part of the Chat App development task. The purpose of Part 1 is to create a secure and testable registration and login feature using Java.

The application was developed as a standard Java application using Apache NetBeans. The solution demonstrates fundamental Object-Oriented Programming (OOP) concepts, decision-making, input validation, regular expressions, authentication and unit testing.

The project has been designed so that the registration and login functionality can be tested independently before additional Chat App features are added.

---

## 2. Purpose of Part 1

Part 1 focuses on creating the foundation of the Chat App.

The application allows a user to:

1. Enter their first name and last name.
2. Create a username.
3. Create a password.
4. Enter a South African cellphone number.
5. Have their information validated.
6. Register successfully when all requirements are met.
7. Log in using the username and password used during registration.
8. Receive an appropriate message indicating whether the login was successful or unsuccessful.

The application also includes JUnit tests to verify that the validation and login methods work correctly.

---

## 3. Development Environment

The application was created using:

* Java
* Apache NetBeans
* JUnit 5
* Java Regular Expressions
* Git/GitHub for version control

The application is a Java desktop/console application. It is not an Android Studio project.

---

## 4. Project Structure

The project is organised into source and test packages.

```text
ChatApp
│
├── Source Packages
│   └── za.ac.chatapp
│       ├── ChatApp.java
│       └── Login.java
│
├── Test Packages
│   └── za.ac.chatapp
│       └── LoginTest.java
│
└── Libraries
    └── JUnit 5
```

### ChatApp.java

`ChatApp.java` is the main class of the application.

It provides the console interface and allows the user to enter their registration information. After the information has been entered, a `Login` object is created and the registration process is performed.

If registration is successful, the user can continue to the login section.

### Login.java

`Login.java` contains the main business logic for Part 1.

The class contains the required methods:

* `checkUserName()`
* `checkPasswordComplexity()`
* `checkCellPhoneNumber()`
* `registerUser()`
* `loginUser()`
* `returnLoginStatus()`

Keeping these functions inside a separate class makes the application easier to maintain and test.

### LoginTest.java

`LoginTest.java` contains the JUnit 5 unit tests.

The tests verify both successful and unsuccessful inputs. The test data supplied in the PoE has been used, including:

```text
Username: kyl_1
Password: Ch&&sec@ke99!
Cell phone: +27838968976
```

Incorrect test data such as:

```text
Username: kyle!!!!
Password: password
Cell phone: 08966553
```

is also tested.

---

# 5. Username Validation

The username validation is performed using the `checkUserName()` method.

The requirements are:

* The username must contain an underscore.
* The username must be no more than five characters long.

For example:

```text
kyl_1
```

is valid because it contains an underscore and contains five characters.

An example of an invalid username is:

```text
kyle!!!!
```

because it does not meet the required formatting rules.

The method returns:

```text
true
```

when the username is correctly formatted and:

```text
false
```

when it is incorrectly formatted.

---

# 6. Password Validation

Password validation is performed by the `checkPasswordComplexity()` method.

The password must:

* Contain at least eight characters.
* Contain a capital letter.
* Contain a number.
* Contain a special character.

The following password is used as the successful test example:

```text
Ch&&sec@ke99!
```

The following password is used as the unsuccessful test example:

```text
password
```

The application checks each of the required password conditions before accepting the password.

The method returns:

```text
true
```

when all requirements are satisfied.

It returns:

```text
false
```

when one or more requirements are not satisfied.

---

# 7. Cell Phone Validation

The `checkCellPhoneNumber()` method validates the South African cellphone number.

The application requires the international South African country code:

```text
+27
```

followed by nine digits.

The successful test value is:

```text
+27838968976
```

The unsuccessful test value is:

```text
08966553
```

The regular expression used by the application is:

```text
^\\+27\\d{9}$
```

This ensures that the number begins with `+27` and is followed by exactly nine digits.

The regular expression implementation uses Java's `Pattern` and `Matcher` classes.

The Java regular expression documentation used for attribution is available from Oracle:

https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/regex/Pattern.html

---

# 8. Registration

The `registerUser()` method combines the validation methods.

The registration process checks:

```text
Username
    ↓
Password
    ↓
Cell phone number
    ↓
Registration successful
```

If the username is invalid, the application displays an appropriate username error message.

If the password is invalid, the application displays an appropriate password error message.

If the cellphone number is invalid, the application displays an appropriate cellphone error message.

When all three conditions are satisfied, the user is registered successfully.

The successful registration message used in the application is:

```text
User successfully registered.
```

---

# 9. Login

After successful registration, the user can log in.

The `loginUser()` method compares the username and password entered during login with the details that were provided during registration.

If both values match, the method returns:

```text
true
```

If either the username or password is incorrect, it returns:

```text
false
```

The `returnLoginStatus()` method then converts this result into a user-friendly message.

A successful login produces a message such as:

```text
Welcome Kyl Smith, it is great to see you again.
```

An unsuccessful login produces:

```text
Username or password incorrect, please try again.
```

---

# 10. Object-Oriented Programming

Part 1 makes use of basic Object-Oriented Programming principles.

The `Login` class represents the registration and authentication functionality of a user.

The class contains attributes such as:

```java
private String username;
private String password;
private String cellPhoneNumber;
private String firstName;
private String lastName;
```

These variables are private, which provides encapsulation.

Methods are used to perform specific operations instead of placing all the application logic inside the `main()` method.

For example:

```java
checkUserName()
```

is responsible for username validation, while:

```java
checkPasswordComplexity()
```

is responsible for password validation.

This makes the application more organised and maintainable.

---

# 11. Unit Testing

JUnit 5 was used to test the application.

Unit testing is important because it allows individual methods to be tested before the complete application is relied upon.

The following functionality is tested:

### Username

* Correct username
* Incorrect username

### Password

* Correct password
* Incorrect password

### Cell phone

* Correct cellphone number
* Incorrect cellphone number

### Registration

* Successful registration
* Incorrect username message
* Incorrect password message
* Incorrect cellphone message

### Login

* Successful login
* Failed login
* Successful login message
* Failed login message

The tests use:

```java
assertTrue()
assertFalse()
assertEquals()
```

These assertions compare the expected result with the actual result produced by the application.

---

# 12. Example Test

An example of a successful username test is:

```java
@Test
public void testUsernameCorrect() {

    Login login = new Login(
            "kyl_1",
            "Ch&&sec@ke99!",
            "+27838968976",
            "Kyl",
            "Smith"
    );

    assertTrue(login.checkUserName());
}
```

The test expects:

```text
true
```

because `kyl_1` contains an underscore and is no more than five characters long.

---

# 13. Running the Application

To run the application in NetBeans:

1. Open the `ChatApp` project.
2. Locate `ChatApp.java`.
3. Right-click `ChatApp.java`.
4. Select **Run File**.

The application will open in the NetBeans Output window.

The user will be asked to enter:

```text
First name
Last name
Username
Password
Cell phone number
```

The application will then validate the information and display the appropriate result.

---

# 14. Running the Tests

To run the unit tests:

1. Open the `Test Packages` folder.
2. Open the `za.ac.chatapp` package.
3. Right-click `LoginTest.java`.
4. Select **Test File**.

NetBeans will execute all the JUnit tests.

A successful test run should show that the tests have passed.

---

# 15. Version Control

Git is intended to be used throughout the development of the Chat App.

Part 1 can be committed to GitHub as the initial version of the project.

An example commit message is:

```text
Initial Chat App registration and login implementation
```

Further changes can then be committed as additional parts of the application are developed.

Using Git makes it possible to keep track of changes and return to earlier versions if necessary.

---

# 16. Current State of the Application

At the completion of Part 1, the Chat App contains the basic user authentication foundation.

The following features have been implemented:

| Feature                            | Status    |
| ---------------------------------- | --------- |
| User registration                  | Completed |
| Username validation                | Completed |
| Password complexity validation     | Completed |
| South African cellphone validation | Completed |
| Login authentication               | Completed |
| Login status messages              | Completed |
| OOP structure                      | Completed |
| JUnit unit testing                 | Completed |
| Regular expression validation      | Completed |
| NetBeans Java application          | Completed |
| Git-ready project                  | Completed |

---

# 17. Future Parts of the Chat App

Part 1 provides the foundation for the remaining Chat App functionality.

Future development can extend the application to include the message functionality specified in the PoE.

The message functionality can include:

* Message text
* Message ID
* Message sent status
* Message received status
* Message read status
* Sending messages
* Receiving messages
* Storing messages
* Displaying messages
* Additional unit tests

The existing `Login` class can remain responsible for authentication while additional classes can be introduced for the message functionality.

For example, a future version may contain:

```text
ChatApp
│
├── Login.java
├── Message.java
├── MessageManager.java
└── ChatApp.java
```

This approach allows the application to grow without placing all functionality into one class.

---

# 18. Conclusion

Part 1 establishes the registration and login foundation of the Chat App.

The application demonstrates how Java classes and methods can be used to separate functionality, validate user input and authenticate registered users. JUnit testing has also been introduced to verify that the application's individual methods behave as expected.

The project is structured so that future Chat App functionality can be added without having to completely rewrite the existing registration and login system.

The next stage of development can therefore build on this foundation by implementing the message functionality and other requirements specified in the PoE.
