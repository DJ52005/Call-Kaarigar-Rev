// thunks/usersThunk.js
import { getUsers, addUserApi, toggleUserStatusApi } from "../helpers/backend_helper";
import { fetchUsersSuccess, fetchUsersFail } from "../reducers/usersReducer";

// Thunk: Fetch Users
export const fetchUsers = () => async (dispatch) => {
  try {
    const response = await getUsers();
    dispatch(fetchUsersSuccess(response));
  } catch (error) {
    dispatch(fetchUsersFail(error));
  }
};

// Thunk: Add User
export const addUser = (userData) => async (dispatch) => {
  try {
    await addUserApi(userData);
    dispatch(fetchUsers()); // Refresh list after adding
  } catch (error) {
    console.error(error);
  }
};

// Thunk: Toggle Status
export const toggleUserStatus = (userId, newStatus) => async (dispatch) => {
  try {
    await toggleUserStatusApi(userId, newStatus);
    dispatch(fetchUsers()); // Refresh list after status change
  } catch (error) {
    console.error(error);
  }
};
