# Feature 2857
# Metadata about who wrote the script
# Any processing notes, etc.

@billing
Feature: #2857 Shop for APM data sets
	APM data sets should be available for selection
	APM ...

    @important
	Scenario: the user is logged in
    	Given that the user is logged in
    		And I have deposited 1$
    	When I press the coffee button
    	Then I should be served a coffee

  	Scenario: Multiple Givens
    	Given one thing
      		And another thing
      		And yet another thing
    	When I open my eyes
    	Then I see something
      		But I don't see something else

  	Scenario: Select and view APM data set "Sales in Melbourne"
  		Given the user is logged in
  		When I select
