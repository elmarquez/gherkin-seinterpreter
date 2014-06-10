Feature: Portal security and user authentication
    User may not access the AURIN portal unless they are authenticated
    A failed access attempt will redirect the user to the authentication page
    The user can select an identity provider to authenticate against
    The user agent is redirected to the identity provider authentication page

    Scenario: Unauthenticated user tries to access the portal
        Given I am at the aurin.home.url
        And I go to portal.home.url
        Then I should be redirected to portal.vho.login.url

    Scenario: User authenticates against VHO
        Given I am at the portal.vho.login.url
        And I enter portal.user.name in the ui.vho.login.box
        And I enter portal.user.password in the ui.vho.password.box
        When I click the ui.vho.login.button
        Then I should be redirected to portal.home.url

    Scenario: User authenticates against VHO
        Given I am at the portal.vho.login.url
        And I enter portal.user.name in the ui.vho.login.box
        And I enter portal.user.password in the ui.vho.password.box
        When I click the ui.vho.login.button
        Then I should be redirected to portal.home.url
