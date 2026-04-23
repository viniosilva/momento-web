# Feature Spec

## Purpose

This skill guides the creation of feature specifications using Gherkin scenarios and BDD principles. It ensures features are well-documented, testable, and aligned with user needs.

## When to Use

Use this skill when:
- Writing a new feature specification
- Creating acceptance criteria
- Planning test scenarios
- Documenting edge cases
- Reviewing feature requirements

## Gherkin Syntax

Gherkin is a business-readable domain-specific language that allows you to describe behavior without detailing implementation.

### Basic Structure

```gherkin
Feature: [Feature Name]
  As a [user role]
  I want [goal]
  So that [benefit]

  Scenario: [Scenario Name]
    Given [initial context]
    When [action taken]
    Then [expected outcome]
```

### Example: Login

```gherkin
Feature: User Authentication
  As a registered user
  I want to log in to my account
  So that I can access my memories

  Scenario: Successful login
    Given I am on the login page
    And I have a valid account
    When I enter my email and password
    And I click "Sign In"
    Then I should be redirected to the dashboard
    And I should see my user name

  Scenario: Invalid credentials
    Given I am on the login page
    When I enter an invalid email
    And I enter an incorrect password
    And I click "Sign In"
    Then I should see an error message
    And I should remain on the login page
```

## Scenario Types

### Happy Path

The ideal user journey:

```gherkin
Scenario: [Expected behavior]
  Given [precondition]
  When [user action]
  Then [positive outcome]
```

### Alternative Paths

```gherkin
Scenario: [Alternative path]
  Given [precondition]
  When [different action]
  Then [different outcome]
```

### Error Handling

```gherkin
Scenario: [Error condition]
  Given [error state]
  When [user action]
  Then [error message displayed]
```

### Edge Cases

```gherkin
Scenario: [Edge case]
  Given [edge condition]
  When [user action]
  Then [handled outcome]
```

## Feature Spec Workflow

### Step 1: Identify Requirements

Collect requirements from:
- Product backlog
- User stories
- Design documents
- Stakeholder interviews
- Analytics data

### Step 2: Define User Role

```gherkin
# Template
As a [user role],
I want [goal],
So that [benefit].

# Example
As a Momento user,
I want to create memory entries,
So that I can preserve important moments.
```

### Step 3: Write Scenarios

Use this format:

```gherkin
Scenario: [Descriptive name]
  Given [precondition]
  When [action]
  Then [expectation]
```

### Step 4: Add Examples

For data-driven scenarios:

```gherkin
ScenarioOutline: Creating memory with different visibility
  Given I am logged in
  And I am on the create memory page
  When I create a memory with "<visibility>" visibility
  Then the memory should be "<visibility>"

  Examples:
    | visibility |
    | private    |
    | shared     |
    | public    |
```

## Feature Spec Template

```markdown
# Feature: [Feature Name]

## Overview
[Brief description of what this feature does and why it's important]

## User Story
As a [user role],
I want [goal],
So that [benefit].

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Scenarios

### Happy Path
Scenario: [Ideal user journey]
  Given [initial state]
  When [user action]
  Then [expected outcome]

### Alternative Paths
Scenario: [Alternative case]
  Given [initial state]
  When [different action]
  Then [different outcome]

### Error Handling
Scenario: [Error condition]
  Given [error state]
  When [user action]
  Then [error handling]

### Edge Cases
Scenario: [Edge case]
  Given [edge condition]
  When [user action]
  Then [handled outcome]

## Technical Notes
- [ ] API endpoints needed
- [ ] Components to modify
- [ ] Schema updates
- [ ] Accessibility requirements

## Dependencies
- [ ] Feature: [dependency]
- [ ] Component: [dependency]
- [ ] API: [dependency]

## Out of Scope
- [ ] Feature 1
- [ ] Feature 2
```

## Example: Memory Feature Spec

```markdown
# Feature: Create Memory

## Overview
Users can create new memory entries with title, content, and optional media. 
Memories are stored and can be viewed, edited, or deleted later.

## User Story
As a Momento user,
I want to create and save memory entries,
So that I can preserve important moments and access them later.

## Acceptance Criteria
- [ ] Users can enter a title (required)
- [ ] Users can enter content (required)
- [ ] Users can add optional media
- [ ] Users can set visibility (private/shared/public)
- [ ] Memory is saved to the database
- [ ] User is redirected to memory view

## Scenarios

### Happy Path: Create basic memory
Scenario: User creates a memory with title and content
  Given I am logged in
  And I am on the create memory page
  When I enter "Summer Vacation" as title
  And I enter "Best summer ever!" as content
  And I click "Save Memory"
  Then I should see the memory saved confirmation
  And I should be redirected to the memory view page

### Alternative: Create memory with visibility
Scenario: User creates a shared memory
  Given I am logged in
  And I am on the create memory page
  When I enter "Family Reunion" as title
  And I enter "Great to see everyone!" as content
  And I select "shared" visibility
  And I click "Save Memory"
  Then the memory should be marked as shared

### Error: Missing required fields
Scenario: User tries to save without title
  Given I am logged in
  And I am on the create memory page
  When I enter "Best summer ever!" as content
  And I click "Save Memory"
  Then I should see validation error "Title is required"
  And I should remain on the create page

### Error: Network failure
Scenario: Network error when saving
  Given I am logged in
  And I am on the create memory page
  And the network is offline
  When I enter "Summer Vacation" as title
  And I enter "Best summer ever!" as content
  And I click "Save Memory"
  Then I should see error "Unable to save. Please check your connection."
  And my content should be preserved

### Edge: Long content
Scenario: User enters very long content
  Given I am logged in
  And I am on the create memory page
  When I enter "Long Memory" as title
  And I enter 10000 characters of content
  And I click "Save Memory"
  Then the memory should be saved successfully
  And content should be stored completely

### Edge: Special characters
Scenario: User uses special characters in title
  Given I am logged in
  And I am on the create memory page
  When I enter "<emoji> Birthday! 🎂" as title
  And I enter "Party time!" as content
  And I click "Save Memory"
  Then the title should be saved with emoji
  And the emoji should display correctly

## Technical Notes
- API: POST /api/memories
- Max title length: 200 characters
- Max content length: 50000 characters
- Form validation: zod schema required
- Loading state during save

## Dependencies
- Auth hook: useAuth
- API client: api.post
- Form library: @tanstack/react-form
- Validation: memorySchema

## Out of Scope
- Media upload (v2)
- Rich text editor (v2)
- Multiple memories (v2)
```

## Testing from Spec

### Mapping Scenarios to Tests

Each scenario becomes a test case:

```typescript
// Happy Path
test('creates memory with title and content', async () => {
  render(<CreateMemoryPage />)
  await userEvent.type(screen.getByLabelText(/title/i), 'Summer Vacation')
  await userEvent.type(screen.getByLabelText(/content/i), 'Best summer ever!')
  await userEvent.click(screen.getByRole('button', { name: /save memory/i }))
  
  expect(await screen.findByText(/saved/i)).toBeInTheDocument()
  expect(router.state.location.pathname).toBe('/memory/[id]')
})
```

### Test Structure

```typescript
describe('Create Memory', () => {
  describe('Happy Path', () => {
    it('creates memory with title and content', ...)
  })

  describe('Alternative Paths', () => {
    it('creates shared memory', ...)
  })

  describe('Error Handling', () => {
    it('shows error when title missing', ...)
    it('shows error on network failure', ...)
  })

  describe('Edge Cases', () => {
    it('handles long content', ...)
    it('handles special characters', ...)
  })
})
```

## Checklist

- [ ] User story defined
- [ ] Acceptance criteria listed
- [ ] Happy path scenario written
- [ ] Alternative scenarios written
- [ ] Error scenarios written
- [ ] Edge cases identified
- [ ] Technical notes added
- [ ] Dependencies documented
- [ ] Out of scope defined
- [ ] Scenarios mapped to tests