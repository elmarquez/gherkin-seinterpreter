Feature: dataset-ABS-ABS_CENSUS2011_B01-aus
    The AUS-based B01 Selected Person Characteristics as at 2011-08-11 data set should be listed in the Available Datasets panel.
    Selecting the data set should update the Available Attributes panel.
    The Available Attributes panel should display one or more attributes.
    Clicking the Add Dataset button should add the data set to the Select your data panel.

    Scenario: Select the data set from the Available Datasets pane
        Given each step in portal.authentication.steps
        And each step in sample.area.steps
        And I click the sample.dataset.button

    Scenario: Select the data set from the Available Datasets pane 2
        Given each step in portal.authentication.steps
        And each step in sample.area.steps
        And I click the sample.dataset.button
