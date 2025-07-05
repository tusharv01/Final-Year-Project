import * as userService from '../services/userService.js';

export const registerUser = async (req, res) => {
  try {
    const user = await userService.registerPendingUser(req.body);
    res.status(201).json({ message: 'Registration request submitted for approval', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const approveUserController = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userService.approvePendingUser(userId);
    res.status(200).json({ message: 'User approved', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const approveAllUsersController = async (req, res) => {
  try {
    const users = await userService.approveAllPendingUsers();
    res.status(200).json({ message: 'All users approved', users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await userService.loginUser(email, password);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ error: 'User not found' });
  }
};

