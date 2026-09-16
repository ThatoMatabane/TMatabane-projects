/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package com.mycompany.chatapp;

/**
 *
 * @author Student
 */
import java.util.Scanner;

public class ChatApp {

    public static void main(String[] args) {

        Scanner scanner = new Scanner(System.in);

        System.out.println("====================================");
        System.out.println("           CHAT APP");
        System.out.println("     REGISTRATION AND LOGIN");
        System.out.println("====================================");

        System.out.println();

        System.out.print("Enter first name: ");
        String firstName = scanner.nextLine();

        System.out.print("Enter last name: ");
        String lastName = scanner.nextLine();

        System.out.print("Enter username: ");
        String username = scanner.nextLine();

        System.out.print("Enter password: ");
        String password = scanner.nextLine();

        System.out.print("Enter South African cellphone number: ");
        String cellPhone = scanner.nextLine();

        Login login = new Login(
                username,
                password,
                cellPhone,
                firstName,
                lastName
        );

        System.out.println();
        System.out.println("------------------------------------");
        System.out.println("REGISTRATION");
        System.out.println("------------------------------------");

        String registrationResult =
                login.registerUser();

        System.out.println(registrationResult);

        if (registrationResult.equals(
                "User successfully registered.")) {

            System.out.println();
            System.out.println("------------------------------------");
            System.out.println("LOGIN");
            System.out.println("------------------------------------");

            System.out.print("Enter username: ");
            String loginUsername = scanner.nextLine();

            System.out.print("Enter password: ");
            String loginPassword = scanner.nextLine();

            System.out.println();

            String loginResult =
                    login.returnLoginStatus(
                            loginUsername,
                            loginPassword
                    );

            System.out.println(loginResult);

        } else {

            System.out.println();
            System.out.println(
                    "Registration failed. "
                    + "Please correct your details."
            );
        }

        scanner.close();
    }
}