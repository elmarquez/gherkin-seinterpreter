Feature: Portal security and user authentication
    User may not access the AURIN portal unless they are authenticated
    A failed access attempt will redirect the user to the authentication page
    The user can select an identity provider to authenticate against
    The user agent is redirected to the identity provider authentication page

    Scenario: Unauthenticated user tries to access the portal
        This is a description for the scenario.
        Given I navigate to aurin.home.url
        And I click the aurin.home.portal_link
        Then I should be redirected to aurin.home.url

    Scenario: User authenticates against VHO, 1
        Given I navigate to aurin.home.url
        And I enter portal.user.name in the aurin.vho.login.box
        And I enter portal.user.password in the ui.vho.password.box
        When I click the aurin.vho.auth.login_button
        Then I should be redirected to aurin.home.url

    Scenario: User authenticates against VHO, 2
        Given I am at the aurin.home.url
        And I enter portal.user.name in the ui.vho.login.box
        And I enter portal.user.password in the ui.vho.password.box
        When I click the aurin.vho.auth.login_button
        Then I should be redirected to aurin.home.url
