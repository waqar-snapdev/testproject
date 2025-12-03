# Development Plan to Fix Regressions

## Introduction

The application is currently in a broken state with several regressions affecting the UI, logout functionality, and the Timeline and Family pages. This development plan outlines the necessary steps to restore the application to a stable and functional state. The plan is divided into several phases, each addressing a specific issue.

## Phase 1: Restore Sign-In and Authentication

The sign-in functionality is broken due to the absence of an `AuthContext` to manage the user's authentication state. This phase will focus on creating the necessary infrastructure to handle user authentication.

### Steps:

1.  **Create `AuthContext`:**
    *   Create a new file at `frontend/src/context/AuthContext.tsx`.
    *   Implement the `AuthContext` with the following functionalities:
        *   `login(token)`: Stores the authentication token in local storage.
        *   `logout()`: Removes the token from local storage.
        *   `getToken()`: Retrieves the token from local storage.
        *   `isAuthenticated()`: Checks if the user is authenticated.

2.  **Create `LoginForm.tsx` Component:**
    *   Create a new component at `frontend/src/components/LoginForm.tsx` to handle the login form.
    *   The component will use the `useApi` hook to send login requests to the backend.
    *   Upon successful login, the component will use the `AuthContext` to store the token.

3.  **Update `Login.tsx` Page:**
    *   Integrate the `LoginForm` component into the `Login.tsx` page.

4.  **Update `useApi.ts` Hook:**
    *   Import the `AuthContext`.
    *   Add the `Authorization` header to all API requests with the token from the `AuthContext`.

5.  **Update `App.tsx`:**
    *   Wrap the entire application with the `AuthProvider`.
    *   Protect all routes that require authentication.

## Phase 2: Fix Logout Button and Profile Dropdown

The logout functionality is currently broken. This phase will fix the logout button and implement a profile dropdown to display user information.

### Steps:

1.  **Create `ProfileDropdown.tsx` Component:**
    *   Create a new component at `frontend/src/components/ProfileDropdown.tsx`.
    *   The component will display the user's profile information and a logout button.
    *   The component will use the `AuthContext` to check if the user is authenticated.

2.  **Update `Header.tsx` Component:**
    *   Replace the hardcoded dropdown menu with the new `ProfileDropdown` component.
    *   Connect the "Log out" button to the `logout` function from the `AuthContext`.

## Phase 3: Repair Timeline and Family Pages

The Timeline and Family pages are currently using mock data. This phase will connect these pages to the backend API to display real data.

### Steps:

1.  **Repair the Timeline Page:**
    *   In `frontend/src/pages/Timeline.tsx`, use the `useApi` hook to fetch timeline data from the `/api/v1/timeline` endpoint.

2.  **Repair the Family Page:**
    *   In `frontend/src/pages/Family.tsx`, use the `useApi` hook to fetch family data from the `/api/v1/family` endpoint.

3.  **Create `Family` Endpoint in `main.py`:**
    *   Create a new endpoint at `/api/v1/family` in the backend.
    *   The endpoint will require authentication.
    *   For now, the endpoint will return mock data.

## Conclusion

This development plan provides a clear roadmap to fix the existing regressions and restore the application to a fully functional state. Each phase is designed to be implemented and tested independently to ensure a smooth and efficient development process.