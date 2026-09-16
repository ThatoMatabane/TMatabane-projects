/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.chatapp;

/**
 *
 * @author Student
 */

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Login {

    private String username;
    private String password;
    private String cellPhoneNumber;
    private String firstName;
    private String lastName;

    private boolean registered;

    public Login(String username, String password,
                 String cellPhoneNumber,
                 String firstName, String lastName) {

        this.username = username;
        this.password = password;
        this.cellPhoneNumber = cellPhoneNumber;
        this.firstName = firstName;
        this.lastName = lastName;

        registered = false;
    }

    /*
     * Checks that the username:
     * - contains an underscore
     * - is no more than five characters long
     */
    public boolean checkUserName() {

        return username != null
                && username.contains("_")
                && username.length() <= 5;
    }

    /*
     * Checks password complexity:
     * - at least 8 characters
     * - capital letter
     * - number
     * - special character
     */
    public boolean checkPasswordComplexity() {

        if (password == null || password.length() < 8) {
            return false;
        }

        boolean capitalLetter =
                password.matches(".*[A-Z].*");

        boolean number =
                password.matches(".*[0-9].*");

        boolean specialCharacter =
                password.matches(".*[^a-zA-Z0-9].*");

        return capitalLetter
                && number
                && specialCharacter;
    }

    /*
     * Checks the South African international
     * cellphone number.
     *
     * Example:
     * +27838968976
     */
    public boolean checkCellPhoneNumber() {

        if (cellPhoneNumber == null) {
            return false;
        }

        String regex = "^\\+27\\d{9}$";

        Pattern pattern = Pattern.compile(regex);

        Matcher matcher =
                pattern.matcher(cellPhoneNumber);

        return matcher.matches();
    }

    /*
     * Registers the user.
     */
    public String registerUser() {

        if (!checkUserName()) {

            return "Username is not correctly formatted; "
                    + "please ensure that your username contains "
                    + "an underscore and is no more than five "
                    + "characters in length.";
        }

        if (!checkPasswordComplexity()) {

            return "Password is not correctly formatted; "
                    + "please ensure that the password contains "
                    + "at least eight characters, a capital letter, "
                    + "a number, and a special character.";
        }

        if (!checkCellPhoneNumber()) {

            return "Cell phone number is incorrectly formatted "
                    + "or does not contain an international code; "
                    + "please correct the number and try again.";
        }

        registered = true;

        return "User successfully registered.";
    }

    /*
     * Checks the username and password entered
     * during login.
     */
    public boolean loginUser(String enteredUsername,
                             String enteredPassword) {

        return registered
                && username.equals(enteredUsername)
                && password.equals(enteredPassword);
    }

    /*
     * Returns the login status message.
     */
    public String returnLoginStatus(String enteredUsername,
                                    String enteredPassword) {

        if (loginUser(enteredUsername, enteredPassword)) {

            return "Welcome "
                    + firstName
                    + " "
                    + lastName
                    + ", it is great to see you again.";
        }

        return "Username or password incorrect, "
                + "please try again.";
    }
}