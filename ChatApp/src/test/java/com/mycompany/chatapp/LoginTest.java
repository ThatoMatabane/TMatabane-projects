/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/UnitTests/JUnit5TestClass.java to edit this template
 */
package com.mycompany.chatapp;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class LoginTest {

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

    @Test
    public void testUsernameIncorrect() {

        Login login = new Login(
                "kyle!!!!",
                "Ch&&sec@ke99!",
                "+27838968976",
                "Kyl",
                "Smith"
        );

        assertFalse(login.checkUserName());
    }

    @Test
    public void testPasswordCorrect() {

        Login login = new Login(
                "kyl_1",
                "Ch&&sec@ke99!",
                "+27838968976",
                "Kyl",
                "Smith"
        );

        assertTrue(login.checkPasswordComplexity());
    }

    @Test
    public void testPasswordIncorrect() {

        Login login = new Login(
                "kyl_1",
                "password",
                "+27838968976",
                "Kyl",
                "Smith"
        );

        assertFalse(login.checkPasswordComplexity());
    }

    @Test
    public void testCellPhoneCorrect() {

        Login login = new Login(
                "kyl_1",
                "Ch&&sec@ke99!",
                "+27838968976",
                "Kyl",
                "Smith"
        );

        assertTrue(login.checkCellPhoneNumber());
    }

    @Test
    public void testCellPhoneIncorrect() {

        Login login = new Login(
                "kyl_1",
                "Ch&&sec@ke99!",
                "08966553",
                "Kyl",
                "Smith"
        );

        assertFalse(login.checkCellPhoneNumber());
    }

    @Test
    public void testSuccessfulRegistration() {

        Login login = new Login(
                "kyl_1",
                "Ch&&sec@ke99!",
                "+27838968976",
                "Kyl",
                "Smith"
        );

        assertEquals(
                "User successfully registered.",
                login.registerUser()
        );
    }

    @Test
    public void testIncorrectUsernameMessage() {

        Login login = new Login(
                "kyle!!!!",
                "Ch&&sec@ke99!",
                "+27838968976",
                "Kyl",
                "Smith"
        );

        assertEquals(
                "Username is not correctly formatted; "
                + "please ensure that your username contains "
                + "an underscore and is no more than five "
                + "characters in length.",
                login.registerUser()
        );
    }

    @Test
    public void testIncorrectPasswordMessage() {

        Login login = new Login(
                "kyl_1",
                "password",
                "+27838968976",
                "Kyl",
                "Smith"
        );

        assertEquals(
                "Password is not correctly formatted; "
                + "please ensure that the password contains "
                + "at least eight characters, a capital letter, "
                + "a number, and a special character.",
                login.registerUser()
        );
    }

    @Test
    public void testIncorrectCellPhoneMessage() {

        Login login = new Login(
                "kyl_1",
                "Ch&&sec@ke99!",
                "08966553",
                "Kyl",
                "Smith"
        );

        assertEquals(
                "Cell phone number is incorrectly formatted "
                + "or does not contain an international code; "
                + "please correct the number and try again.",
                login.registerUser()
        );
    }

    @Test
    public void testLoginSuccessful() {

        Login login = new Login(
                "kyl_1",
                "Ch&&sec@ke99!",
                "+27838968976",
                "Kyl",
                "Smith"
        );

        login.registerUser();

        assertTrue(
                login.loginUser(
                        "kyl_1",
                        "Ch&&sec@ke99!"
                )
        );
    }

    @Test
    public void testLoginFailed() {

        Login login = new Login(
                "kyl_1",
                "Ch&&sec@ke99!",
                "+27838968976",
                "Kyl",
                "Smith"
        );

        login.registerUser();

        assertFalse(
                login.loginUser(
                        "kyl_1",
                        "WrongPassword1!"
                )
        );
    }

    @Test
    public void testSuccessfulLoginMessage() {

        Login login = new Login(
                "kyl_1",
                "Ch&&sec@ke99!",
                "+27838968976",
                "Kyl",
                "Smith"
        );

        login.registerUser();

        assertEquals(
                "Welcome Kyl Smith, "
                + "it is great to see you again.",
                login.returnLoginStatus(
                        "kyl_1",
                        "Ch&&sec@ke99!"
                )
        );
    }

    @Test
    public void testFailedLoginMessage() {

        Login login = new Login(
                "kyl_1",
                "Ch&&sec@ke99!",
                "+27838968976",
                "Kyl",
                "Smith"
        );

        login.registerUser();

        assertEquals(
                "Username or password incorrect, "
                + "please try again.",
                login.returnLoginStatus(
                        "kyl_1",
                        "WrongPassword1!"
                )
        );
    }
}