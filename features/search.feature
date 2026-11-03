Feature: Book search on the DemoQA Book Store
  The Book Store must filter books by keyword and show an explicit
  empty state when no book matches.

  Background:
    Given the user is on the Book Store page

  @smoke
  Scenario: Search with an existing keyword
    When the user searches for "Git"
    Then only books matching the keyword are listed
    And the results include a book whose title contains "Git Pocket Guide"

  Scenario: Search with a non-existing keyword
    When the user searches for "ISTQB Fundamentals"
    Then the results table shows an empty state