Feature: Login validation on the DemoQA Book Store
  The Book Store must authenticate valid users and reject invalid credentials
  with a clear error message.

  Background:
    Given the user is on the login page

  @smoke
  Scenario: Successful login with a valid pre-created user
    When the user logs in with valid credentials created for this run
    Then the profile page shows the user's username
    And the user session is active

  Scenario Outline: Failed login with invalid credentials
    When the user tries to log in with "<userName>" and "<password>"
    Then an error message "Invalid username or password!" is displayed
    And the user remains on the login page

    Examples:
      | userName              | password       |
      | nonexistent_user_x9z  | Wrong!Pass123  |
      | qa_deleted_user_0001 | short          |