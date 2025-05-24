# Hevelius Web Interface Changelog

0.4.0 (unreleased)

- Upgraded to Angular 19

0.3.0 (2025-04-22)

- Pagination for tasks added
- Sorting for tasks added
- Filtering for tasks added
- Telescopes list added
- Catalogs (currently NGC,IC,Messier,Caldwell) added
- When adding or editing tasks, it's now possible to select a scope
  from the list
- When adding or editing tasks, the target object can be selected
  from the catalogs. Just type at least 3 chars.

0.2.0 (2025-04-13)

- Added ability to edit tasks (long press a task)
- Doc cleaned up
- Updated github workflows, cleaned up some old tests
- The backend version is now reported on the login page
- Menu redesigned to be more user friendly
- Night plan implemented (experimental)
- The title now shows the number of tasks in the night plan
- Better login (ability to log out, handling token expiration)

0.1.0 (2025-03-02)

- Updated messages to use SnackBar instead of console log prints
- Cleaned up LoginService to always return a proper structure
- RA, Dec now formatted using sexagesimal format
- Upgraded to Angular 17, then 18
- Addressed es-linter issues
- Removed old, unused PHP code for the server-side API
- JWT support added
- Implemented adding new tasks

0.0.4 (2023-11-17)

- Upgraded to Angular 16
- tslint replaced with es-lint
- fixed all tests
- github workflow added

0.0.3 (2023-01-03)

- Upgraded to Angular 10
- the API URL is now configured in one place
- the tasks list remains broken

0.0.2 (2019 Jul 9)

- increased default view to 1000 tasks
- states column is now interpreted correctly
- Changelog added
- user AAVSO logins are now displayed

0.0.1 (2019 Feb)

- Initial version with limited capabilities (login, able to list 10 tasks, without any interpretation)
