# NTD Calculator Frontend

## Users

[x] provide with at least two user/passwords

- `john@gmail.com` password `john0000`
- `mary@gmail.com` passord `mary0000`

## Tech Stack, choose from: Java, Clojure, MySQL, Node.js, Go, Python, Vue.js/React.js, AWS.

[x] AWS 
[x] Java (Spring Boot)
[x] React (Vite)
[x] MySQL

## Repos

[x] Frontend and Backend should be on separate stacks.
[x] Frontend and Backend should be on separate repos.

## Technical requirements

### Frontend requirements

- [x] use a Bootstrap or Material Design library (CSS/Design Library) of your choice. YES React Material UI
- [x] make sure that the current balance is always visible (always display the User Balance and its value should be deducted immediately each time an operation is performed.)
- [x] Login and “sign out” button anywhere available for all session-required screens, YES the exit button in the Calculator
    - [x] A simple username and password input form
- [x] New Operation
    - [x] an input form providing all fields to request a new operation on behalf of the current user, YES the Calculator keypad 
- [x] User Records
    - [x] Datatable of all operation records from the current user
    - [x] Datatable should have pagination (page number and per-page option) and sorting, Yes for Dates and Operation Names
    - [x] Datatable should have a filter/search input field for partial matches, YES for Operation Names
    - [x] Delete button to delete records, YES in the Datatable
- [ ] add automated tests such as Unit Tests front-end. WILL DO

## Improvements

[ ] abstract authentication properly to include token-authentication besides basic-authentication making this configurable
